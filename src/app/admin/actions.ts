'use server';

import { redirect } from 'next/navigation';
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
