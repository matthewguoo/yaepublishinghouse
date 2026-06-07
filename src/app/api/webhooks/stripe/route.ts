import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { ORDER_STATUS } from '@/lib/api/constants';
import { apiError, ok } from '@/lib/api/responses';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) return apiError('Missing signature', 400);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return apiError('Webhook not configured', 500);
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return apiError('Invalid signature', 400);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', (event.data.object as Stripe.PaymentIntent).id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return ok({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return apiError('Webhook handler failed', 500);
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  const cartId = session.metadata?.cartId;
  if (!orderId) {
    console.error('No orderId in session metadata');
    return;
  }

  const sessionWithShipping = session as Stripe.Checkout.Session & {
    shipping_details?: { name?: string | null; address?: Stripe.Address | null } | null;
  };
  const shippingDetails = sessionWithShipping.shipping_details || null;
  const customerEmail = session.customer_details?.email || session.customer_email || '';

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new Error(`Order not found: ${orderId}`);
    if (order.status === ORDER_STATUS.paid) return;

    for (const item of order.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true } });
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.stock === null) continue;

      const result = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (result.count !== 1) throw new Error(`Insufficient stock for product ${item.productId}`);
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: ORDER_STATUS.paid,
        email: customerEmail,
        stripePaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
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

    if (cartId) await tx.cartItem.deleteMany({ where: { cartId } });
  });

  console.log(`Order ${orderId} completed successfully`);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  await prisma.order.updateMany({
    where: { id: orderId, status: ORDER_STATUS.pending },
    data: { status: ORDER_STATUS.cancelled },
  });

  console.log(`Order ${orderId} expired/cancelled`);
}
