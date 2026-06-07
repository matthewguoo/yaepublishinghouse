import { prisma } from './db';
import type { Product as DbProduct } from '@prisma/client';

export type ProductCTA =
  | { type: 'email'; buttonText?: string; successMessage?: string }
  | { type: 'stripe'; priceId?: string; buttonText?: string }
  | { type: 'soldout'; message?: string }
  | { type: 'comingsoon'; message?: string };

export interface TimelineMilestone {
  label: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface ProductData {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  subtitle?: string;
  description: string;
  price: string;
  priceInCents: number;
  originalPrice?: string;
  badge?: string;
  badgeType?: 'new' | 'limited' | 'sale';
  images: string[];
  specs: string;
  isLive: boolean; // false = email waitlist, true = checkout
  cta: ProductCTA;
  stock?: number;
  stockStatus?: string;
  shippingText?: string;
  serialRange?: string;
  featured?: boolean;
  announcementUrl?: string;
  watermarkTop?: string;
  watermarkBottom?: string;
  meta?: Record<string, string>;
  timeline?: TimelineMilestone[];
}

function ctaFromDb(p: DbProduct): ProductCTA {
  switch (p.ctaType) {
    case 'stripe':
      return { type: 'stripe', priceId: p.ctaPriceId || undefined, buttonText: p.ctaButtonText || undefined };
    case 'soldout':
      return { type: 'soldout', message: p.ctaMessage || undefined };
    case 'comingsoon':
      return { type: 'comingsoon', message: p.ctaMessage || undefined };
    case 'email':
    default:
      return {
        type: 'email',
        buttonText: p.ctaButtonText || undefined,
        successMessage: p.ctaSuccessText || undefined,
      };
  }
}

export function fromDb(p: DbProduct): ProductData {
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku || undefined,
    name: p.name,
    subtitle: p.subtitle || undefined,
    description: p.description,
    price: p.price,
    priceInCents: p.priceInCents,
    originalPrice: p.originalPrice || undefined,
    badge: p.badge || undefined,
    badgeType: (p.badgeType as ProductData['badgeType']) || undefined,
    images: p.images,
    specs: p.specs,
    isLive: p.isLive,
    cta: ctaFromDb(p),
    stock: p.stock ?? undefined,
    stockStatus: p.stockStatus || undefined,
    shippingText: p.shippingText || undefined,
    serialRange: p.serialRange || undefined,
    featured: p.featured,
    announcementUrl: p.announcementUrl || undefined,
    watermarkTop: p.watermarkTop || undefined,
    watermarkBottom: p.watermarkBottom || undefined,
    timeline: (p.timeline as TimelineMilestone[] | null) || undefined,
    meta: (p.meta as Record<string, string> | null) || undefined,
  };
}

export async function getProduct(slug: string): Promise<ProductData | undefined> {
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p || !p.published) return undefined;
  return fromDb(p);
}

export async function getAllProducts(): Promise<ProductData[]> {
  const rows = await prisma.product.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map(fromDb);
}

export async function getFeaturedProducts(): Promise<ProductData[]> {
  const rows = await prisma.product.findMany({
    where: { published: true, featured: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map(fromDb);
}
