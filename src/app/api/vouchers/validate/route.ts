import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as { code?: unknown } | null;
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!code) return NextResponse.json({ error: 'Voucher code is required.' }, { status: 400 });

  const voucher = await prisma.voucher.findUnique({ where: { code } });
  if (!voucher || voucher.userId !== user.id) {
    return NextResponse.json({ error: 'Voucher not found.' }, { status: 404 });
  }
  if (voucher.usedAt) {
    return NextResponse.json({ error: 'Voucher already used.' }, { status: 400 });
  }
  if (voucher.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Voucher expired.' }, { status: 400 });
  }

  return NextResponse.json({
    voucher: {
      id: voucher.id,
      code: voucher.code,
      value: voucher.value.toString(),
      expiresAt: voucher.expiresAt.toISOString(),
    },
  });
}
