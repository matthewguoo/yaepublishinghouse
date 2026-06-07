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
  originalPrice?: string;
  badge?: string;
  badgeType?: 'new' | 'limited' | 'sale';
  images: string[];
  specs: string; // pipe-separated, e.g. ".999 24k Gold Plating|Ceramic anti-fingerprint coat|Light fiberglass base"
  cta: ProductCTA;
  stock?: number;
  stockStatus?: string; // "In Stock", "Pre-order", etc.
  shippingText?: string; // "Ships free from US"
  serialRange?: string;
  featured?: boolean;
  announcementUrl?: string;
  watermarkTop?: string;
  watermarkBottom?: string;
  meta?: Record<string, string>;
  timeline?: TimelineMilestone[];
}

// Product registry
export const products: Record<string, ProductData> = {
  'nameless-pass': {
    id: 'nameless-pass',
    slug: 'nameless-pass',
    sku: 'YPH-0001',
    name: 'Star Rail Special Pass Keychain',
    subtitle: '24k Gold Plated First Edition',
    description: 'Limited edition gold-plated collectible commemorating the 2158th Year of the Trailblaze and the Nameless\' contributions to the situation in Penacony.',
    price: 'US$15.00',
    stockStatus: 'In Stock',
    shippingText: 'Ships free from US',
    images: ['/nameless-pass.png'],
    specs: '.999 24k Gold Plating|Ceramic anti-fingerprint coat|Light fiberglass base',
    cta: { 
      type: 'email', 
      buttonText: 'Join Waitlist',
      successMessage: 'You\'re on the list! We\'ll notify you when orders open.'
    },
    serialRange: '0001-2158',
    featured: true,
    announcementUrl: '/news/nameless-pass-announcement',
    timeline: [
      { label: 'Order Period', date: 'Jun 1 – Jun 15', status: 'upcoming' },
      { label: 'Manufacturing', date: 'Late June', status: 'upcoming' },
      { label: 'Ships from US', date: 'Early July', status: 'upcoming' },
    ],
  },
};

export function getProduct(slug: string): ProductData | undefined {
  return products[slug];
}

export function getAllProducts(): ProductData[] {
  return Object.values(products);
}

export function getFeaturedProducts(): ProductData[] {
  return Object.values(products).filter(p => p.featured);
}
