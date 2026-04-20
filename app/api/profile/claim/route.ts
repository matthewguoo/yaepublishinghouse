import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';
import { claimHandleForUser } from '../../../../lib/data';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 });
  }

  try {
    const { handle = '' } = await request.json();
    const profile = await claimHandleForUser({
      userId: session.user.id,
      email: session.user.email,
      rawHandle: handle,
    });

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not claim handle.' }, { status: 400 });
  }
}
