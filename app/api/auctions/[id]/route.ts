import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { cancelAuction, getAuction } from '../../../../lib/auctions';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const auction = await getAuction(params.id);
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found.' }, { status: 404 });
    }
    return NextResponse.json({ auction });
  } catch (err) {
    return NextResponse.json({ error: 'Could not load auction.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  }

  try {
    await cancelAuction(params.id, session.user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not cancel.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
