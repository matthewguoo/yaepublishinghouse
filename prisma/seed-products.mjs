import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'nameless-pass',
    sku: 'YPH-0001',
    name: 'Star Rail Special Pass Keychain',
    subtitle: '24k Gold Plated First Edition',
    description: '100x40x1mm',
    price: 'US$15.00',
    priceInCents: 1500,
    isLive: false, // set to true when ready to sell
    stockStatus: 'In Stock',
    shippingText: 'Ships free from US',
    images: ['/nameless-pass.png'],
    specs: '.999 24k Gold Plating|Ceramic anti-fingerprint coat|Light fiberglass base',
    ctaType: 'email',
    ctaButtonText: 'Join Waitlist',
    ctaSuccessText: "You're on the list! We'll notify you when orders open.",
    serialRange: '0001-2158',
    featured: true,
    published: true,
    announcementUrl: '/news/star-rail-pass-announcement',
    timeline: [
      { label: 'Order Period', date: 'Jun 1 – Jun 15', status: 'upcoming' },
      { label: 'Manufacturing', date: 'Late June', status: 'upcoming' },
      { label: 'Ships from US', date: 'Early July', status: 'upcoming' },
    ],
    sortOrder: 0,
  },
];

for (const p of products) {
  await prisma.product.upsert({
    where: { slug: p.slug },
    create: p,
    update: p,
  });
  console.log(`seeded ${p.slug}`);
}

await prisma.$disconnect();
