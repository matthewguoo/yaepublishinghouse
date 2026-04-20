import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { updateProfileForUser } from '../../../lib/data';

export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const profile = await updateProfileForUser({ userId: session.user.id, payload });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update profile.' }, { status: 400 });
  }
}
