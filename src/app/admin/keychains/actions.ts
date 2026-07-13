'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

const ALLOWED_STATUSES = ['new', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect('/login?next=/admin/keychains');
  return user;
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  if (!id || !ALLOWED_STATUSES.includes(status)) return;
  await prisma.keychainOrder.update({ where: { id }, data: { status } });
  revalidatePath('/admin/keychains');
  revalidatePath(`/admin/keychains/${id}`);
}

export async function createPromo(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get('code') || '').trim().toUpperCase().slice(0, 40);
  const discountPct = Math.max(1, Math.min(100, Number(formData.get('discountPct')) || 0));
  const maxUsesRaw = String(formData.get('maxUses') || '').trim();
  const maxUses = maxUsesRaw ? Math.max(1, Number(maxUsesRaw)) : null;
  const note = String(formData.get('note') || '').trim().slice(0, 200) || null;
  const expiresAtRaw = String(formData.get('expiresAt') || '').trim();
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (!code || !discountPct) return;
  await prisma.keychainPromo.upsert({
    where: { code },
    create: { code, discountPct, maxUses, note, expiresAt },
    update: { discountPct, maxUses, note, expiresAt },
  });
  revalidatePath('/admin/keychains');
}

export async function deletePromo(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get('code') || '').trim().toUpperCase();
  if (!code) return;
  await prisma.keychainPromo.delete({ where: { code } }).catch(() => {});
  revalidatePath('/admin/keychains');
}
