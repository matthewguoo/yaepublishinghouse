import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifySessionToken } from '@/lib/auth';
import { randomBytes } from 'crypto';

// Get or create cart for user/guest
async function getOrCreateCart(userId: string | null, guestId: string | null) {
  if (userId) {
    // Find or create cart for logged-in user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return cart;
  }

  if (guestId) {
    // Find or create cart for guest
    let cart = await prisma.cart.findFirst({
      where: { guestId, userId: null },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { guestId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return cart;
  }

  return null;
}

// GET /api/cart - get current cart
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const guestId = cookieStore.get('guestId')?.value;

    let userId: string | null = null;
    if (token) {
      userId = await verifySessionToken(token);
    }

    const cart = await getOrCreateCart(userId, guestId || null);

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

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

    const total = items.reduce(
      (sum, item) => sum + item.product.priceInCents * item.quantity,
      0
    );

    return NextResponse.json({ items, total, cartId: cart.id });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

// POST /api/cart - add item to cart
export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Verify product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.published || product.ctaType !== 'stripe') {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    let guestId = cookieStore.get('guestId')?.value;

    let userId: string | null = null;
    if (token) {
      userId = await verifySessionToken(token);
    }

    // Create guest ID if needed
    const response = NextResponse.json({ success: true });
    if (!userId && !guestId) {
      guestId = randomBytes(16).toString('hex');
      response.cookies.set('guestId', guestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    const cart = await getOrCreateCart(userId, guestId || null);
    if (!cart) {
      return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
    }

    // Check if item already in cart
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return response;
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// DELETE /api/cart - remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const productId = searchParams.get('productId');

    if (!itemId && !productId) {
      return NextResponse.json({ error: 'Item ID or Product ID required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const guestId = cookieStore.get('guestId')?.value;

    let userId: string | null = null;
    if (token) {
      userId = await verifySessionToken(token);
    }

    const cart = await getOrCreateCart(userId, guestId || null);
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (itemId) {
      // Delete by item ID
      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cart.id },
      });
    } else if (productId) {
      // Delete by product ID
      await prisma.cartItem.deleteMany({
        where: { productId, cartId: cart.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

// PATCH /api/cart - update item quantity
export async function PATCH(req: NextRequest) {
  try {
    const { itemId, productId, quantity } = await req.json();

    if ((!itemId && !productId) || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Item ID/Product ID and quantity required' }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const guestId = cookieStore.get('guestId')?.value;

    let userId: string | null = null;
    if (token) {
      userId = await verifySessionToken(token);
    }

    const cart = await getOrCreateCart(userId, guestId || null);
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (itemId) {
      await prisma.cartItem.updateMany({
        where: { id: itemId, cartId: cart.id },
        data: { quantity },
      });
    } else if (productId) {
      await prisma.cartItem.updateMany({
        where: { productId, cartId: cart.id },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
