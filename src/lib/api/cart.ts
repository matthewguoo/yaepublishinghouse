import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export const cartWithItemsArgs = {
  include: {
    items: {
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    },
  },
} satisfies Prisma.CartDefaultArgs;

export type CartWithItems = Prisma.CartGetPayload<typeof cartWithItemsArgs>;

export type CartApiItem = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    price: string;
    priceInCents: number;
    images: string[];
  };
};

export type CartApiResponse = {
  items: CartApiItem[];
  total: number;
  cartId?: string;
};

export async function getOrCreateCart(userId: string | null, guestId: string | null): Promise<CartWithItems | null> {
  if (userId) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      ...cartWithItemsArgs,
    });
  }

  if (guestId) {
    const existing = await prisma.cart.findFirst({
      where: { guestId, userId: null },
      ...cartWithItemsArgs,
    });

    if (existing) return existing;

    return prisma.cart.create({
      data: { guestId },
      ...cartWithItemsArgs,
    });
  }

  return null;
}

export function serializeCart(cart: CartWithItems): CartApiResponse {
  const items = cart.items.map((item): CartApiItem => ({
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

export const EMPTY_CART_RESPONSE: CartApiResponse = { items: [], total: 0 };
