import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [vouchers, mediaSubmissions] = await Promise.all([
    prisma.voucher.findMany({
      where: { userId: user.id },
      orderBy: [{ usedAt: 'asc' }, { expiresAt: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.mediaSubmission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 25,
    }),
  ]);

  return NextResponse.json({
    vouchers: vouchers.map((voucher) => ({
      id: voucher.id,
      code: voucher.code,
      value: voucher.value.toString(),
      expiresAt: voucher.expiresAt.toISOString(),
      usedAt: voucher.usedAt?.toISOString() ?? null,
      createdAt: voucher.createdAt.toISOString(),
    })),
    mediaSubmissions: mediaSubmissions.map((submission) => ({
      id: submission.id,
      mediaUrl: submission.mediaUrl,
      platform: submission.platform,
      status: submission.status,
      rewardType: submission.rewardType,
      createdAt: submission.createdAt.toISOString(),
      reviewedAt: submission.reviewedAt?.toISOString() ?? null,
    })),
  });
}
