import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth';
import { placeBid } from '../../../../../lib/auctions';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Sign in to place a bid.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const amountCents = Math.round(Number(body.amount) * 100);
    const result = await placeBid({
      auctionId: params.id,
      bidderEmail: session.user.email,
      bidderName: session.user.name || null,
      bidderId: session.user.id || null,
      amountCents,
    });
    return NextResponse.json({ ok: true, extended: result.extended });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not place bid.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
