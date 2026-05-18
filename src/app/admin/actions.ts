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
