import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, checkRateLimit } from '@/lib/auth';
import { ok, badRequest, unauthorized, rateLimited, notFound } from '@/lib/api/responses';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const rl = checkRateLimit(`kc:voucher:${user.id}`, 20, 60_000);
  if (!rl.allowed) return rateLimited();

  const body = await req.json().catch(() => null);
  const raw = typeof body?.code === 'string' ? body.code : '';
  const code = raw.trim().toUpperCase().slice(0, 40);
  if (!code) return badRequest('Enter a code.');

  const promo = await prisma.keychainPromo.findUnique({ where: { code } });
  if (!promo) return notFound('That code is not valid.');
  if (promo.expiresAt && promo.expiresAt < new Date()) return badRequest('That code has expired.');
  if (promo.maxUses != null && promo.timesUsed >= promo.maxUses) return badRequest('That code has been fully redeemed.');

  return ok({
    code: promo.code,
    discountPct: promo.discountPct,
    note: promo.note ?? null,
  });
}
