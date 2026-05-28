import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { normalizeTrip } from '@/lib/trips';

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { date: 'desc' },
    include: {
      toLegs: { orderBy: { order: 'asc' } },
      returnLegs: { orderBy: { order: 'asc' } },
    },
  });
  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  try {
    const input = normalizeTrip(body);
    const trip = await prisma.trip.create({
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
    return NextResponse.json({ trip }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
