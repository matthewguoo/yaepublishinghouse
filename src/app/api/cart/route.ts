import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifySessionToken, checkRateLimit } from '@/lib/auth';
import { randomBytes } from 'crypto';

const SESSION_COOKIE = 'yph_session';
const MAX_QUANTITY_PER_ITEM = 10;

type CartWithItems = Awaited<ReturnType<typeof getOrCreateCart>>;

function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

async function getAuthContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const guestId = cookieStore.get('guestId')?.value;

  let userId: string | null = null;
  if (token) userId = await verifySessionToken(token);

  return { cookieStore, userId, guestId: guestId || null };
}

function serializeCart(cart: NonNullable<CartWithItems>) {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: item.product.price,
      priceInCents: item.product.priceInCents,
      images: item.product.images,
    },
  }));

  return {
    items,
    total: items.reduce((sum, item) => sum + item.product.priceInCents * item.quantity, 0),
    cartId: cart.id,
  };
}

async function getOrCreateCart(userId: string | null, guestId: string | null) {
  if (userId) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  if (guestId) {
    const existing = await prisma.cart.findFirst({
      where: { guestId, userId: null },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (existing) return existing;

    return prisma.cart.create({
      data: { guestId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  return null;
}

export async function GET() {
  try {
    const { userId, guestId } = await getAuthContext();
    const cart = await getOrCreateCart(userId, guestId);

    if (!cart) return NextResponse.json({ items: [], total: 0 });

    return NextResponse.json(serializeCart(cart));
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`cart:${ip}`, 60, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many cart updates. Please try again later.' }, { status: 429 });
    }

    const body = (await req.json().catch(() => null)) as { productId?: unknown; quantity?: unknown } | null;
    const productId = typeof body?.productId === 'string' ? body.productId : '';
    const quantity = typeof body?.quantity === 'number' && Number.isInteger(body.quantity) ? body.quantity : 1;

    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    if (quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: `Quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}` }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.published || product.ctaType !== 'stripe' || product.priceInCents <= 0) {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 });
    }

    const { userId, guestId: existingGuestId } = await getAuthContext();
    let guestId = existingGuestId;
    const response = NextResponse.json({ success: true });

    if (!userId && !guestId) {
      guestId = randomBytes(16).toString('hex');
      response.cookies.set('guestId', guestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });

    const existingItem = cart.items.find((item) => item.productId === productId);
    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: `Maximum quantity is ${MAX_QUANTITY_PER_ITEM}` }, { status: 400 });
    }
    if (product.stock !== null && product.stock < newQuantity) {
      return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: newQuantity },
    });

    return response;
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`cart:${ip}`, 60, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many cart updates. Please try again later.' }, { status: 429 });
    }

    const body = (await req.json().catch(() => null)) as { itemId?: unknown; productId?: unknown; quantity?: unknown } | null;
    const itemId = typeof body?.itemId === 'string' ? body.itemId : '';
    const productId = typeof body?.productId === 'string' ? body.productId : '';
    const quantity = typeof body?.quantity === 'number' && Number.isInteger(body.quantity) ? body.quantity : NaN;

    if ((!itemId && !productId) || !Number.isFinite(quantity)) {
      return NextResponse.json({ error: 'Item ID/Product ID and quantity required' }, { status: 400 });
    }
    if (quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      return NextResponse.json({ error: `Quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}` }, { status: 400 });
    }

    const { userId, guestId } = await getAuthContext();
    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    const target = itemId
      ? cart.items.find((item) => item.id === itemId)
      : cart.items.find((item) => item.productId === productId);

    if (!target) return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    if (target.product.stock !== null && target.product.stock < quantity) {
      return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    await prisma.cartItem.update({ where: { id: target.id }, data: { quantity } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const productId = searchParams.get('productId');

    if (!itemId && !productId) {
      return NextResponse.json({ error: 'Item ID or Product ID required' }, { status: 400 });
    }

    const { userId, guestId } = await getAuthContext();
    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

    await prisma.cartItem.deleteMany({
      where: itemId ? { id: itemId, cartId: cart.id } : { productId: productId!, cartId: cart.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
