import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { getProfileByUserId } from '../../../lib/data';
import { createAuction, listActiveAuctions } from '../../../lib/auctions';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const auctions = await listActiveAuctions();
    return NextResponse.json({ auctions });
  } catch (err) {
    return NextResponse.json({ error: 'Could not load auctions.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to list an auction.' }, { status: 401 });
  }

  try {
    const profile = await getProfileByUserId(session.user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Claim a handle before listing an auction.' }, { status: 400 });
    }
    const profileRecord = await prisma.profile.findUnique({ where: { userId: session.user.id } });
    if (!profileRecord) {
      return NextResponse.json({ error: 'Profile missing.' }, { status: 400 });
    }

    const body = await request.json();
    const startingBidCents = Math.round(Number(body.startingBid) * 100);
    const reservePriceCents = body.reservePrice
      ? Math.round(Number(body.reservePrice) * 100)
      : null;
    const endsAt = new Date(body.endsAt);

    const auction = await createAuction(profileRecord.id, {
      title: String(body.title || ''),
      description: String(body.description || ''),
      imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
      category: body.category ? String(body.category) : undefined,
      startingBidCents,
      reservePriceCents,
      endsAt,
    });
    return NextResponse.json({ auction: { id: auction.id } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not create auction.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
