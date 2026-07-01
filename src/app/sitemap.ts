import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yaepublishing.house').replace(/\/$/, '');

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/news`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/products`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/products/star-rail-pass`,lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/travels`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/tools/png-transparency`,lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${SITE_URL}/sitemap`,               lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [articles, trips] = await Promise.all([
      prisma.article.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.trip.findMany({ select: { id: true, updatedAt: true } }),
    ]);

    dynamicRoutes = [
      ...articles.map((a) => ({
        url: `${SITE_URL}/news/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      // trips don't have their own pages right now, but flagging the /travels
      // route freshness off the most recent trip update is nice for crawlers
    ];

    if (trips.length > 0) {
      const newest = trips.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b));
      const travelsEntry = staticRoutes.find((r) => r.url === `${SITE_URL}/travels`);
      if (travelsEntry) travelsEntry.lastModified = newest.updatedAt;
    }
  } catch {
    // DB may be unreachable at build time; static routes still ship
  }

  return [...staticRoutes, ...dynamicRoutes];
}
