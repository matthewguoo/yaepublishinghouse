import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { updateProfileForUser } from '../../../lib/data';
import type { EditableProfilePayload } from '../../../lib/types';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as EditableProfilePayload;
    const profile = await updateProfileForUser({ userId: session.user.id, payload });
    return NextResponse.json({ profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update profile.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
