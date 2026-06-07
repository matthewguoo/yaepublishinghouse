import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { verifySessionToken, checkRateLimit } from '@/lib/auth';
import { COOKIE_NAMES, CART_LIMITS } from './constants';
import { rateLimited } from './responses';

export type AuthContext = {
  userId: string | null;
  guestId: string | null;
};

export function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function readJson<T extends Record<string, unknown>>(request: Request): Promise<T | null> {
  const body = await request.json().catch(() => null);
  return body && typeof body === 'object' && !Array.isArray(body) ? body as T : null;
}

export async function getAuthContext(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.session)?.value;
  const guestId = cookieStore.get(COOKIE_NAMES.guestId)?.value;

  let userId: string | null = null;
  if (token) userId = await verifySessionToken(token);

  return { userId, guestId: guestId || null };
}

export function createGuestId() {
  return randomBytes(16).toString('hex');
}

export function setGuestCookie(response: Response, guestId: string) {
  if ('cookies' in response && response.cookies && typeof response.cookies === 'object' && 'set' in response.cookies) {
    (response.cookies as { set: (name: string, value: string, opts: Record<string, unknown>) => void }).set(COOKIE_NAMES.guestId, guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: CART_LIMITS.guestCookieMaxAgeSeconds,
      path: '/',
    });
  }
}

export function enforceRateLimit(request: NextRequest, keyPrefix: string, attempts: number, windowMs: number, message?: string) {
  const ip = getClientIp(request);
  const result = checkRateLimit(`${keyPrefix}:${ip}`, attempts, windowMs);
  return result.allowed ? null : rateLimited(message);
}

export function getStringField(body: Record<string, unknown> | null, key: string) {
  const value = body?.[key];
  return typeof value === 'string' ? value : '';
}

export function getIntegerField(body: Record<string, unknown> | null, key: string, fallback = NaN) {
  const value = body?.[key];
  return typeof value === 'number' && Number.isInteger(value) ? value : fallback;
}
