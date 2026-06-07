import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import { verifySessionToken, checkRateLimit } from '@/lib/auth';

const SESSION_COOKIE = 'yph_session';
const MAX_CHECKOUT_ITEMS = 20;

function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return 'http://localhost:3456';

  try {
    return new URL(configured).origin;
  } catch {
    console.error('Invalid NEXT_PUBLIC_SITE_URL:', configured);
    return 'http://localhost:3456';
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`checkout:${ip}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many checkout attempts. Please try again later.' }, { status: 429 });
    }

    const stripe = getStripe();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const guestId = cookieStore.get('guestId')?.value;

    let userId: string | null = null;
    let userEmail: string | null = null;

    if (token) {
      userId = await verifySessionToken(token);
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
        userEmail = user?.email || null;
      }
    }

    const cart = userId
      ? await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } })
      : guestId
        ? await prisma.cart.findFirst({ where: { guestId, userId: null }, include: { items: { include: { product: true } } } })
        : null;

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (cart.items.length > MAX_CHECKOUT_ITEMS) {
      return NextResponse.json({ error: 'Too many items in cart' }, { status: 400 });
    }

    for (const item of cart.items) {
      if (item.quantity < 1 || item.quantity > 10) {
        return NextResponse.json({ error: `Invalid quantity for "${item.product.name}"` }, { status: 400 });
      }
      if (!item.product.published || item.product.ctaType !== 'stripe' || item.product.priceInCents <= 0) {
        return NextResponse.json({ error: `Product "${item.product.name}" is no longer available` }, { status: 400 });
      }
      if (item.product.stock !== null && item.product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for "${item.product.name}"` }, { status: 400 });
      }
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.subtitle || undefined,
          images: item.product.images.filter((image) => image.startsWith('https://')).slice(0, 1),
        },
        unit_amount: item.product.priceInCents,
      },
      quantity: item.quantity,
    }));

    const subtotalInCents = cart.items.reduce(
      (sum, item) => sum + item.product.priceInCents * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        email: userEmail || 'pending@checkout.local',
        subtotalInCents,
        totalInCents: subtotalInCents,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSku: item.product.sku,
            priceInCents: item.product.priceInCents,
            quantity: item.quantity,
          })),
        },
      },
    });

    const baseUrl = getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      customer_email: userEmail || undefined,
      client_reference_id: order.id,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
      metadata: { orderId: order.id, cartId: cart.id },
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error && error.message.includes('STRIPE_SECRET_KEY')
      ? 'Checkout is not configured yet'
      : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
