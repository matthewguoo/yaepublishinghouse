import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { normalizeTrip } from '@/lib/trips';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      toLegs: { orderBy: { order: 'asc' } },
      returnLegs: { orderBy: { order: 'asc' } },
    },
  });
  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ trip });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  try {
    const input = normalizeTrip(body);
    const trip = await prisma.$transaction(async (tx) => {
      await tx.tripLeg.deleteMany({ where: { OR: [{ toTripId: id }, { returnTripId: id }] } });
      return tx.trip.update({
        where: { id },
        data: {
          tripType: input.tripType,
          title: input.title,
          description: input.description,
          photos: input.photos,
          date: input.date,
          toLegs: { create: input.toLegs },
          returnLegs: { create: input.returnLegs },
        },
        include: { toLegs: true, returnLegs: true },
      });
    });
    return NextResponse.json({ trip });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.trip.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
