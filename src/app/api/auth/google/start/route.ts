import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth not configured.' }, { status: 500 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const state = crypto.randomBytes(24).toString('hex');
  const next = req.nextUrl.searchParams.get('next') || '/';

  const store = await cookies();
  store.set('google_oauth_state', state, {
    httpOnly: true, secure: true, sameSite: 'lax',
    path: '/', maxAge: 600,
  });
  store.set('google_oauth_next', next, {
    httpOnly: true, secure: true, sameSite: 'lax',
    path: '/', maxAge: 600,
  });

  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('prompt', 'select_account');
  url.searchParams.set('access_type', 'online');

  return NextResponse.redirect(url.toString());
}
