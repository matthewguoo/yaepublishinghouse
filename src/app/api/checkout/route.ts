import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import { CART_LIMITS, DEFAULTS, PRODUCT_CTA, RATE_LIMITS, STRIPE_CHECKOUT } from '@/lib/api/constants';
import { getSiteUrl } from '@/lib/api/env';
import { badRequest, ok, serverError } from '@/lib/api/responses';
import { enforceRateLimit, getAuthContext } from '@/lib/api/request';
import { cartWithItemsArgs } from '@/lib/api/cart';

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'checkout', RATE_LIMITS.checkout.attempts, RATE_LIMITS.checkout.windowMs, 'Too many checkout attempts. Please try again later.');
    if (limited) return limited;

    const stripe = getStripe();
    const { userId, guestId } = await getAuthContext();
    let userEmail: string | null = null;

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
      userEmail = user?.email || null;
    }

    const cart = userId
      ? await prisma.cart.findUnique({ where: { userId }, ...cartWithItemsArgs })
      : guestId
        ? await prisma.cart.findFirst({ where: { guestId, userId: null }, ...cartWithItemsArgs })
        : null;

    if (!cart || cart.items.length === 0) return badRequest('Cart is empty');
    if (cart.items.length > CART_LIMITS.maxCheckoutItems) return badRequest('Too many items in cart');

    for (const item of cart.items) {
      if (item.quantity < 1 || item.quantity > CART_LIMITS.maxQuantityPerItem) {
        return badRequest(`Invalid quantity for "${item.product.name}"`);
      }
      if (!item.product.published || item.product.ctaType !== PRODUCT_CTA.stripe || item.product.priceInCents <= 0) {
        return badRequest(`Product "${item.product.name}" is no longer available`);
      }
      if (item.product.stock !== null && item.product.stock < item.quantity) {
        return badRequest(`Not enough stock for "${item.product.name}"`);
      }
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: STRIPE_CHECKOUT.currency,
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
        email: userEmail || DEFAULTS.pendingCheckoutEmail,
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
      payment_method_types: [...STRIPE_CHECKOUT.paymentMethodTypes],
      mode: STRIPE_CHECKOUT.mode,
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: [...STRIPE_CHECKOUT.allowedShippingCountries] },
      customer_email: userEmail || undefined,
      client_reference_id: order.id,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
      metadata: { orderId: order.id, cartId: cart.id },
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });

    return ok({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error && error.message.includes('STRIPE_SECRET_KEY')
      ? 'Checkout is not configured yet'
      : 'Failed to create checkout session';
    return serverError(message);
  }
}
