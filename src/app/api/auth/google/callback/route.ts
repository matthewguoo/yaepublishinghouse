import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

function isSafeNext(next: string | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/';
  return next;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=oauth_not_configured', req.url));
  }

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const err = req.nextUrl.searchParams.get('error');
  if (err || !code || !state) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', req.url));
  }

  const store = await cookies();
  const savedState = store.get('google_oauth_state')?.value;
  const savedNext = store.get('google_oauth_next')?.value;
  store.delete('google_oauth_state');
  store.delete('google_oauth_next');

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(new URL('/login?error=state_mismatch', req.url));
  }

  const baseUrl = process.env.NEXTAUTH_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/login?error=token_exchange', req.url));
  }
  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) {
    return NextResponse.redirect(new URL('/login?error=no_token', req.url));
  }

  // Fetch userinfo
  const uiRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!uiRes.ok) {
    return NextResponse.redirect(new URL('/login?error=userinfo', req.url));
  }
  const info = (await uiRes.json()) as {
    sub: string; email?: string; email_verified?: boolean;
    name?: string; picture?: string;
  };

  if (!info.email) {
    return NextResponse.redirect(new URL('/login?error=no_email', req.url));
  }
  const email = info.email.toLowerCase();

  // Find or create user (link by googleId first, then email)
  let user = await prisma.user.findUnique({ where: { googleId: info.sub } });
  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      // Link existing account to Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: info.sub,
          emailVerified: user.emailVerified || !!info.email_verified,
          name: user.name || info.name || null,
          avatarUrl: user.avatarUrl || info.picture || null,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          googleId: info.sub,
          emailVerified: !!info.email_verified,
          name: info.name || null,
          avatarUrl: info.picture || null,
          passwordHash: null,
        },
      });
    }
  }

  const token = await createSessionToken(user.id);
  await setSessionCookie(token);

  return NextResponse.redirect(new URL(isSafeNext(savedNext), req.url));
}
