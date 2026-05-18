import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

const ALLOWED_REWARDS = new Set(['refund', 'voucher']);
const PLATFORM_HOSTS: Array<[string, string[]]> = [
  ['Instagram', ['instagram.com']],
  ['TikTok', ['tiktok.com', 'vm.tiktok.com']],
  ['YouTube', ['youtube.com', 'youtu.be']],
  ['X', ['x.com', 'twitter.com']],
];

function detectPlatform(url: URL) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const match = PLATFORM_HOSTS.find(([, hosts]) => hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`)));
  return match?.[0] ?? 'Other';
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as { mediaUrl?: unknown; rewardType?: unknown } | null;
  const rawUrl = typeof body?.mediaUrl === 'string' ? body.mediaUrl.trim() : '';
  const rewardType = typeof body?.rewardType === 'string' ? body.rewardType : '';

  if (!rawUrl || rawUrl.length > 2048) {
    return NextResponse.json({ error: 'Paste a valid media link.' }, { status: 400 });
  }
  if (!ALLOWED_REWARDS.has(rewardType)) {
    return NextResponse.json({ error: 'Choose refund or voucher.' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'That link is not a valid URL.' }, { status: 400 });
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) {
    return NextResponse.json({ error: 'Only web links are accepted.' }, { status: 400 });
  }

  const submission = await prisma.mediaSubmission.create({
    data: {
      userId: user.id,
      mediaUrl: parsed.toString(),
      platform: detectPlatform(parsed),
      rewardType,
    },
  });

  return NextResponse.json({ submission: { id: submission.id, status: submission.status } }, { status: 201 });
}
