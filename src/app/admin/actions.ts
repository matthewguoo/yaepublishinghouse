'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect('/login?next=/admin');
  return user;
}

function boolFromForm(data: FormData, key: string) {
  return data.get(key) === 'on';
}

function requiredString(data: FormData, key: string) {
  const value = String(data.get(key) || '').trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createArticle(data: FormData) {
  await requireAdmin();
  const title = requiredString(data, 'title');
  const slug = slugify(String(data.get('slug') || title));

  await prisma.article.create({
    data: {
      title,
      slug,
      date: requiredString(data, 'date'),
      category: requiredString(data, 'category'),
      excerpt: requiredString(data, 'excerpt'),
      content: requiredString(data, 'content'),
      published: boolFromForm(data, 'published'),
      featured: boolFromForm(data, 'featured'),
    },
  });

  redirect('/admin/articles');
}

export async function updateArticle(id: string, data: FormData) {
  await requireAdmin();
  const title = requiredString(data, 'title');
  const slug = slugify(String(data.get('slug') || title));

  await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      date: requiredString(data, 'date'),
      category: requiredString(data, 'category'),
      excerpt: requiredString(data, 'excerpt'),
      content: requiredString(data, 'content'),
      published: boolFromForm(data, 'published'),
      featured: boolFromForm(data, 'featured'),
    },
  });

  redirect('/admin/articles');
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  redirect('/admin/articles');
}

function voucherCode() {
  const chunk = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `YAE-${chunk()}-${chunk()}`;
}

export async function approveMediaSubmission(id: string) {
  await requireAdmin();

  const submission = await prisma.mediaSubmission.findUnique({ where: { id } });
  if (!submission || submission.status !== 'pending') {
    revalidatePath('/admin/media-submissions');
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.mediaSubmission.update({
      where: { id },
      data: { status: 'approved', reviewedAt: new Date() },
    });

    if (submission.rewardType === 'voucher') {
      await tx.voucher.create({
        data: {
          code: voucherCode(),
          value: '5.00',
          userId: submission.userId,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
    }
  });

  revalidatePath('/admin/media-submissions');
}

export async function rejectMediaSubmission(id: string) {
  await requireAdmin();
  await prisma.mediaSubmission.update({
    where: { id },
    data: { status: 'rejected', reviewedAt: new Date() },
  });
  revalidatePath('/admin/media-submissions');
}

// ===== Products =====

function optionalString(data: FormData, key: string): string | null {
  const v = String(data.get(key) || '').trim();
  return v || null;
}

function optionalInt(data: FormData, key: string): number | null {
  const v = String(data.get(key) || '').trim();
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

function parseTimeline(raw: string): { label: string; date: string; status: string }[] | null {
  const text = raw.trim();
  if (!text) return null;
  try {
    const j = JSON.parse(text);
    if (Array.isArray(j)) return j;
  } catch {}
  // pipe-line format: label | date | status (one per line)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const out: { label: string; date: string; status: string }[] = [];
  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length >= 2) {
      out.push({
        label: parts[0],
        date: parts[1],
        status: (parts[2] as string) || 'upcoming',
      });
    }
  }
  return out.length ? out : null;
}

function parseImages(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function productPayloadFromForm(data: FormData) {
  const name = requiredString(data, 'name');
  const slug = slugify(String(data.get('slug') || name));
  return {
    slug,
    name,
    sku: optionalString(data, 'sku'),
    subtitle: optionalString(data, 'subtitle'),
    description: requiredString(data, 'description'),
    price: requiredString(data, 'price'),
    originalPrice: optionalString(data, 'originalPrice'),
    badge: optionalString(data, 'badge'),
    badgeType: optionalString(data, 'badgeType'),
    images: parseImages(String(data.get('images') || '')),
    specs: String(data.get('specs') || '').trim(),
    ctaType: String(data.get('ctaType') || 'email'),
    ctaButtonText: optionalString(data, 'ctaButtonText'),
    ctaSuccessText: optionalString(data, 'ctaSuccessText'),
    ctaPriceId: optionalString(data, 'ctaPriceId'),
    ctaMessage: optionalString(data, 'ctaMessage'),
    stock: optionalInt(data, 'stock'),
    stockStatus: optionalString(data, 'stockStatus'),
    shippingText: optionalString(data, 'shippingText'),
    serialRange: optionalString(data, 'serialRange'),
    featured: boolFromForm(data, 'featured'),
    published: boolFromForm(data, 'published'),
    announcementUrl: optionalString(data, 'announcementUrl'),
    watermarkTop: optionalString(data, 'watermarkTop'),
    watermarkBottom: optionalString(data, 'watermarkBottom'),
    timeline: parseTimeline(String(data.get('timeline') || '')) || undefined,
    sortOrder: optionalInt(data, 'sortOrder') ?? 0,
  };
}

export async function createProduct(data: FormData) {
  await requireAdmin();
  const payload = productPayloadFromForm(data);
  await prisma.product.create({ data: payload as any });
  revalidatePath('/');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, data: FormData) {
  await requireAdmin();
  const payload = productPayloadFromForm(data);
  await prisma.product.update({ where: { id }, data: payload as any });
  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath(`/products/${payload.slug}`);
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/products');
  redirect('/admin/products');
}
