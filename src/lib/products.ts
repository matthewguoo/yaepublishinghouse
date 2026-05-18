export type ProductCTA = 
  | { type: 'email'; buttonText?: string; successMessage?: string }
  | { type: 'stripe'; priceId?: string; buttonText?: string }
  | { type: 'soldout'; message?: string }
  | { type: 'comingsoon'; message?: string };

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  badgeType?: 'new' | 'limited' | 'sale';
  images: string[];
  specs: ProductSpec[];
  cta: ProductCTA;
  stock?: number;
  serialRange?: string;
  featured?: boolean;
  announcementUrl?: string;
  meta?: Record<string, string>; // arbitrary key-value pairs
}

// Product registry
export const products: Record<string, ProductData> = {
  'nameless-pass': {
    id: 'nameless-pass',
    slug: 'nameless-pass',
    name: 'Nameless Honor Pass',
    subtitle: 'Amber Era Commemorative Edition',
    description: 'Limited edition gold-plated PCB collectible commemorating the 2158th Year of the Trailblaze and the Nameless\' contributions to the situation in Penacony.',
    price: '$15.00',
    images: ['/nameless-pass.png'],
    specs: [
      { label: 'Dimensions', value: '100 × 42 mm' },
      { label: 'Thickness', value: '1.0 mm' },
      { label: 'Material & Finish', value: 'ENIG (Real Gold)' },
      { label: 'Print', value: 'UV Silkscreen' },
      { label: 'Units', value: '2,158 (Serialized)' },
    ],
    cta: { 
      type: 'email', 
      buttonText: 'Join Waitlist',
      successMessage: 'You\'re on the list! We\'ll notify you when orders open.'
    },
    serialRange: '0001-2158',
    featured: true,
    announcementUrl: '/news/nameless-pass-announcement',
  },
  'pompom-pass': {
    id: 'pompom-pass',
    slug: 'pompom-pass',
    name: 'Pom-Pom Express Pass',
    subtitle: 'Astral Express Crew ID',
    description: 'Fan-made crew member identification for the Astral Express. Features Pom-Pom design and holographic elements.',
    price: 'TBA',
    badge: 'COMING SOON',
    badgeType: 'new',
    images: [],
    specs: [],
    cta: { 
      type: 'comingsoon', 
      message: 'Sign up to be notified when this product launches.' 
    },
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
