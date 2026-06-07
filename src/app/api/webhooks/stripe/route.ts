import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  const cartId = session.metadata?.cartId;

  if (!orderId) {
    console.error('No orderId in session metadata');
    return;
  }

  // Get shipping details - using 'any' to access shipping_details which may not be in type def
  const sessionAny = session as Stripe.Checkout.Session & { shipping_details?: { name?: string | null; address?: Stripe.Address | null } };
  const shippingDetails = sessionAny.shipping_details || null;
  const customerEmail = session.customer_details?.email || session.customer_email;

  // Update order
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'paid',
      email: customerEmail || '',
      stripePaymentIntent: session.payment_intent as string,
      paidAt: new Date(),
      shippingName: shippingDetails?.name,
      shippingAddress: shippingDetails?.address ? {
        line1: shippingDetails.address.line1,
        line2: shippingDetails.address.line2,
        city: shippingDetails.address.city,
        state: shippingDetails.address.state,
        postal_code: shippingDetails.address.postal_code,
        country: shippingDetails.address.country,
      } : undefined,
    },
  });

  // Update stock
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (order) {
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
  }

  // Clear cart
  if (cartId) {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  console.log(`Order ${orderId} completed successfully`);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return;
  }

  // Mark order as cancelled
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'cancelled' },
  });

  console.log(`Order ${orderId} expired/cancelled`);
}
