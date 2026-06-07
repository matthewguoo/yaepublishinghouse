import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CART_LIMITS, PRODUCT_CTA, RATE_LIMITS } from '@/lib/api/constants';
import { EMPTY_CART_RESPONSE, getOrCreateCart, serializeCart } from '@/lib/api/cart';
import { badRequest, ok, notFound, serverError, success } from '@/lib/api/responses';
import {
  createGuestId,
  enforceRateLimit,
  getAuthContext,
  getIntegerField,
  getStringField,
  readJson,
  setGuestCookie,
} from '@/lib/api/request';

function validateQuantity(quantity: number) {
  if (quantity < 1 || quantity > CART_LIMITS.maxQuantityPerItem) {
    return `Quantity must be between 1 and ${CART_LIMITS.maxQuantityPerItem}`;
  }
  return null;
}

export async function GET() {
  try {
    const { userId, guestId } = await getAuthContext();
    const cart = await getOrCreateCart(userId, guestId);
    return ok(cart ? serializeCart(cart) : EMPTY_CART_RESPONSE);
  } catch (error) {
    console.error('Cart GET error:', error);
    return serverError('Failed to get cart');
  }
}

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'cart', RATE_LIMITS.cart.attempts, RATE_LIMITS.cart.windowMs, 'Too many cart updates. Please try again later.');
    if (limited) return limited;

    const body = await readJson(req);
    const productId = getStringField(body, 'productId');
    const quantity = getIntegerField(body, 'quantity', 1);

    if (!productId) return badRequest('Product ID required');
    const quantityError = validateQuantity(quantity);
    if (quantityError) return badRequest(quantityError);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.published || product.ctaType !== PRODUCT_CTA.stripe || product.priceInCents <= 0) {
      return badRequest('Product not available');
    }

    const { userId, guestId: existingGuestId } = await getAuthContext();
    let guestId = existingGuestId;
    const response = success();

    if (!userId && !guestId) {
      guestId = createGuestId();
      setGuestCookie(response, guestId);
    }

    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) return serverError('Failed to create cart');

    const existingItem = cart.items.find((item) => item.productId === productId);
    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > CART_LIMITS.maxQuantityPerItem) {
      return badRequest(`Maximum quantity is ${CART_LIMITS.maxQuantityPerItem}`);
    }
    if (product.stock !== null && product.stock < newQuantity) {
      return badRequest('Not enough stock available');
    }

    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity: newQuantity },
    });

    return response;
  } catch (error) {
    console.error('Cart POST error:', error);
    return serverError('Failed to add to cart');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'cart', RATE_LIMITS.cart.attempts, RATE_LIMITS.cart.windowMs, 'Too many cart updates. Please try again later.');
    if (limited) return limited;

    const body = await readJson(req);
    const itemId = getStringField(body, 'itemId');
    const productId = getStringField(body, 'productId');
    const quantity = getIntegerField(body, 'quantity');

    if ((!itemId && !productId) || !Number.isFinite(quantity)) {
      return badRequest('Item ID/Product ID and quantity required');
    }
    const quantityError = validateQuantity(quantity);
    if (quantityError) return badRequest(quantityError);

    const { userId, guestId } = await getAuthContext();
    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) return notFound('Cart not found');

    const target = itemId
      ? cart.items.find((item) => item.id === itemId)
      : cart.items.find((item) => item.productId === productId);

    if (!target) return notFound('Cart item not found');
    if (target.product.stock !== null && target.product.stock < quantity) {
      return badRequest('Not enough stock available');
    }

    await prisma.cartItem.update({ where: { id: target.id }, data: { quantity } });

    return success();
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return serverError('Failed to update cart');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const productId = searchParams.get('productId');

    if (!itemId && !productId) return badRequest('Item ID or Product ID required');

    const { userId, guestId } = await getAuthContext();
    const cart = await getOrCreateCart(userId, guestId);
    if (!cart) return notFound('Cart not found');

    await prisma.cartItem.deleteMany({
      where: itemId ? { id: itemId, cartId: cart.id } : { productId: productId!, cartId: cart.id },
    });

    return success();
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return serverError('Failed to remove from cart');
  }
}
