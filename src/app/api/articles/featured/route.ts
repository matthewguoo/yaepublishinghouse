import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { published: true, featured: true },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    take: 3,
    select: { slug: true, title: true, date: true, category: true },
  });

  if (articles.length < 3) {
    const recent = await prisma.article.findMany({
      where: { published: true, slug: { notIn: articles.map((article) => article.slug) } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 3 - articles.length,
      select: { slug: true, title: true, date: true, category: true },
    });
    articles.push(...recent);
  }

  return NextResponse.json({ articles });
}
