'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { normalizeTrip } from '@/lib/trips';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) redirect('/login?next=/admin/travels');
  return user;
}

function fromForm(data: FormData) {
  return {
    type: String(data.get('type') || 'flight'),
    originCode: data.get('originCode'),
    originName: data.get('originName'),
    originLat: data.get('originLat'),
    originLng: data.get('originLng'),
    destinationCode: data.get('destinationCode'),
    destinationName: data.get('destinationName'),
    destinationLat: data.get('destinationLat'),
    destinationLng: data.get('destinationLng'),
    date: data.get('date'),
    title: data.get('title'),
    description: data.get('description'),
    photos: data.get('photos'),
  };
}

export async function createTrip(data: FormData) {
  await requireAdmin();
  await prisma.trip.create({ data: normalizeTrip(fromForm(data) as Record<string, unknown>) });
  revalidatePath('/travels');
  revalidatePath('/admin/travels');
  redirect('/admin/travels');
}

export async function updateTrip(id: string, data: FormData) {
  await requireAdmin();
  await prisma.trip.update({
    where: { id },
    data: normalizeTrip(fromForm(data) as Record<string, unknown>),
  });
  revalidatePath('/travels');
  revalidatePath('/admin/travels');
  redirect('/admin/travels');
}

export async function deleteTrip(id: string) {
  await requireAdmin();
  await prisma.trip.delete({ where: { id } }).catch(() => null);
  revalidatePath('/travels');
  revalidatePath('/admin/travels');
  redirect('/admin/travels');
}
