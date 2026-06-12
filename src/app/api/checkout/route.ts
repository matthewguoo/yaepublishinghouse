import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import { CART_LIMITS, DEFAULTS, PRODUCT_CTA, RATE_LIMITS, STRIPE_CHECKOUT } from '@/lib/api/constants';
import { getSiteUrl } from '@/lib/api/env';
import { badRequest, ok, serverError } from '@/lib/api/responses';
import { enforceRateLimit, getAuthContext, getIntegerField, getStringField, readJson } from '@/lib/api/request';
import { cartWithItemsArgs } from '@/lib/api/cart';

type CheckoutItem = {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    subtitle: string | null;
    images: string[];
    published: boolean;
    ctaType: string;
    priceInCents: number;
    stock: number | null;
  };
  quantity: number;
};

function validateCheckoutItem(item: CheckoutItem) {
  if (item.quantity < 1 || item.quantity > CART_LIMITS.maxQuantityPerItem) {
    return `Invalid quantity for "${item.product.name}"`;
  }
  if (!item.product.published || item.product.ctaType !== PRODUCT_CTA.stripe || item.product.priceInCents <= 0) {
    return `Product "${item.product.name}" is no longer available`;
  }
  if (item.product.stock !== null && item.product.stock < item.quantity) {
    return `Not enough stock for "${item.product.name}"`;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'checkout', RATE_LIMITS.checkout.attempts, RATE_LIMITS.checkout.windowMs, 'Too many checkout attempts. Please try again later.');
    if (limited) return limited;

    const stripe = getStripe();
    const body = await readJson(req);
    const productId = getStringField(body, 'productId');
    const quantity = getIntegerField(body, 'quantity', 1);
    const { userId, guestId } = await getAuthContext();
    let userEmail: string | null = null;

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
      userEmail = user?.email || null;
    }

    let items: CheckoutItem[] = [];
    let cancelPath = '/cart?cancelled=true';
    let cartId: string | undefined;

    if (productId) {
      if (quantity < 1 || quantity > CART_LIMITS.maxQuantityPerItem) {
        return badRequest(`Quantity must be between 1 and ${CART_LIMITS.maxQuantityPerItem}`);
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          subtitle: true,
          images: true,
          published: true,
          ctaType: true,
          priceInCents: true,
          stock: true,
        },
      });

      if (!product) return badRequest('Product not found');
      items = [{ product, quantity }];
      cancelPath = `/products/${product.slug}?cancelled=true`;
    } else {
      const cart = userId
        ? await prisma.cart.findUnique({ where: { userId }, ...cartWithItemsArgs })
        : guestId
          ? await prisma.cart.findFirst({ where: { guestId, userId: null }, ...cartWithItemsArgs })
          : null;

      if (!cart || cart.items.length === 0) return badRequest('Cart is empty');
      if (cart.items.length > CART_LIMITS.maxCheckoutItems) return badRequest('Too many items in cart');

      items = cart.items.map((item) => ({ product: item.product, quantity: item.quantity }));
      cartId = cart.id;
    }

    for (const item of items) {
      const error = validateCheckoutItem(item);
      if (error) return badRequest(error);
    }

    const lineItems = items.map((item) => ({
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

    const subtotalInCents = items.reduce(
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
          create: items.map((item) => ({
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
      cancel_url: `${baseUrl}${cancelPath}`,
      metadata: {
        orderId: order.id,
        ...(cartId ? { cartId } : {}),
        ...(productId ? { productId } : {}),
      },
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
