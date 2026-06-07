import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { verifySessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const guestId = cookieStore.get('guestId')?.value;

    let userId: string | null = null;
    let userEmail: string | null = null;

    if (token) {
      userId = await verifySessionToken(token);
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        userEmail = user?.email || null;
      }
    }

    // Find cart
    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    } else if (guestId) {
      cart = await prisma.cart.findFirst({
        where: { guestId, userId: null },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Verify all products are still available
    for (const item of cart.items) {
      if (!item.product.published || item.product.ctaType !== 'stripe') {
        return NextResponse.json(
          { error: `Product "${item.product.name}" is no longer available` },
          { status: 400 }
        );
      }
      if (item.product.stock !== null && item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for "${item.product.name}"` },
          { status: 400 }
        );
      }
    }

    // Build line items for Stripe
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.subtitle || undefined,
          images: item.product.images.length > 0 ? [item.product.images[0]] : undefined,
        },
        unit_amount: item.product.priceInCents,
      },
      quantity: item.quantity,
    }));

    // Calculate totals
    const subtotalInCents = cart.items.reduce(
      (sum, item) => sum + item.product.priceInCents * item.quantity,
      0
    );

    // Create pending order
    const order = await prisma.order.create({
      data: {
        userId,
        email: userEmail || '', // Will be updated from Stripe session
        subtotalInCents,
        totalInCents: subtotalInCents, // Free shipping
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

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3456';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      customer_email: userEmail || undefined,
      client_reference_id: order.id,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
      metadata: {
        orderId: order.id,
        cartId: cart.id,
      },
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
