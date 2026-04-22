import prisma from './prisma';
import { isDatabaseConfigured } from './data';

export type AuctionSummary = {
  id: string;
  profileId: string;
  handle: string;
  displayName: string;
  ownerAvatarUrl: string | null;
  ownerThemeKey: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  startingBid: number;
  reservePrice: number | null;
  currentBid: number | null;
  bidCount: number;
  endsAt: string;
  status: 'active' | 'ended' | 'cancelled';
  winnerEmail: string | null;
  reserveMet: boolean;
  isOver: boolean;
  createdAt: string;
};

export type AuctionBid = {
  id: string;
  bidderName: string;
  bidderEmail: string;
  amount: number;
  createdAt: string;
};

export type AuctionDetail = AuctionSummary & {
  bids: AuctionBid[];
};

const MIN_INCREMENT_CENTS = 100;

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${'•'.repeat(Math.max(2, user.length - visible.length))}@${domain}`;
}

function pickName(name: string | null | undefined, email: string): string {
  if (name && name.trim()) return name.trim();
  return maskEmail(email);
}

function serializeAuction(record: any): AuctionSummary {
  const endsAt = record.endsAt instanceof Date ? record.endsAt : new Date(record.endsAt);
  const isOver = record.status !== 'active' || endsAt.getTime() <= Date.now();
  const reserveMet =
    record.reservePrice == null || (record.currentBid ?? 0) >= record.reservePrice;
  return {
    id: record.id,
    profileId: record.profileId,
    handle: record.profile?.handle ?? '',
    displayName: record.profile?.displayName ?? '',
    ownerAvatarUrl: record.profile?.avatarUrl ?? null,
    ownerThemeKey: record.profile?.themeKey ?? 'blush',
    title: record.title,
    description: record.description ?? '',
    imageUrl: record.imageUrl ?? null,
    category: record.category ?? null,
    startingBid: record.startingBid,
    reservePrice: record.reservePrice ?? null,
    currentBid: record.currentBid ?? null,
    bidCount: record.bidCount ?? 0,
    endsAt: endsAt.toISOString(),
    status: record.status as AuctionSummary['status'],
    winnerEmail: record.winnerEmail ?? null,
    reserveMet,
    isOver,
    createdAt: (record.createdAt instanceof Date ? record.createdAt : new Date(record.createdAt)).toISOString(),
  };
}

function serializeBid(bid: any): AuctionBid {
  return {
    id: bid.id,
    bidderName: pickName(bid.bidderName, bid.bidderEmail),
    bidderEmail: maskEmail(bid.bidderEmail),
    amount: bid.amount,
    createdAt: (bid.createdAt instanceof Date ? bid.createdAt : new Date(bid.createdAt)).toISOString(),
  };
}

async function maybeFinalize(record: any) {
  if (!record) return record;
  if (record.status !== 'active') return record;
  const endsAt = record.endsAt instanceof Date ? record.endsAt : new Date(record.endsAt);
  if (endsAt.getTime() > Date.now()) return record;

  const topBid = await prisma.bid.findFirst({
    where: { auctionId: record.id },
    orderBy: { amount: 'desc' },
  });

  const winnerEmail = topBid && (record.reservePrice == null || topBid.amount >= record.reservePrice)
    ? topBid.bidderEmail
    : null;

  const updated = await prisma.auction.update({
    where: { id: record.id },
    data: {
      status: 'ended',
      winnerEmail,
    },
    include: { profile: true },
  });

  // best-effort winner notification
  if (winnerEmail && process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Yae Publishing House <onboarding@resend.dev>',
          to: [winnerEmail],
          subject: `you won "${record.title}" on Yae Publishing House`,
          html: `<div style="font-family:Helvetica,Arial,sans-serif;color:#3f2b36;">
            <h2 style="color:#c9678f;">you won! 🎀</h2>
            <p>Your bid of <strong>$${(topBid!.amount / 100).toFixed(2)}</strong> on <strong>${record.title}</strong> was the highest.</p>
            <p>Reach out to <a href="https://yaepublishing.house/@${updated.profile.handle}">@${updated.profile.handle}</a> to settle up.</p>
          </div>`,
          text: `You won "${record.title}" with a bid of $${(topBid!.amount / 100).toFixed(2)}. Contact @${updated.profile.handle} on Yae Publishing House.`,
        }),
      });
      await prisma.auction.update({
        where: { id: record.id },
        data: { notifiedAt: new Date() },
      });
    } catch (err) {
      console.error('winner notification failed', err);
    }
  }

  return { ...updated };
}

export function isAuctionsConfigured() {
  return isDatabaseConfigured();
}

export async function listActiveAuctions(limit = 24): Promise<AuctionSummary[]> {
  if (!isAuctionsConfigured()) return [];
  const records = await prisma.auction.findMany({
    where: { status: 'active', endsAt: { gt: new Date() } },
    include: { profile: true },
    orderBy: { endsAt: 'asc' },
    take: limit,
  });
  return records.map(serializeAuction);
}

export async function listAuctionsByProfile(profileId: string): Promise<AuctionSummary[]> {
  if (!isAuctionsConfigured()) return [];
  const records = await prisma.auction.findMany({
    where: { profileId },
    include: { profile: true },
    orderBy: [{ status: 'asc' }, { endsAt: 'asc' }],
  });
  return records.map(serializeAuction);
}

export async function getAuction(id: string): Promise<AuctionDetail | null> {
  if (!isAuctionsConfigured()) return null;
  let record = await prisma.auction.findUnique({
    where: { id },
    include: { profile: true },
  });
  if (!record) return null;
  record = await maybeFinalize(record) as any;
  const bids = await prisma.bid.findMany({
    where: { auctionId: id },
    orderBy: { amount: 'desc' },
    take: 50,
  });
  return {
    ...serializeAuction(record),
    bids: bids.map(serializeBid),
  };
}

export type CreateAuctionInput = {
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  startingBidCents: number;
  reservePriceCents?: number | null;
  endsAt: Date;
};

export async function createAuction(profileId: string, input: CreateAuctionInput) {
  const title = (input.title || '').trim().slice(0, 80);
  if (!title) throw new Error('Give your auction a title.');
  if (!Number.isFinite(input.startingBidCents) || input.startingBidCents < 100) {
    throw new Error('Starting bid must be at least $1.00.');
  }
  if (input.reservePriceCents != null && input.reservePriceCents < input.startingBidCents) {
    throw new Error('Reserve price has to be at least the starting bid.');
  }
  const endsAt = input.endsAt;
  const minutesOut = (endsAt.getTime() - Date.now()) / 60000;
  if (!(endsAt instanceof Date) || Number.isNaN(endsAt.getTime())) {
    throw new Error('Pick a valid end time.');
  }
  if (minutesOut < 30) throw new Error('Auctions need to run for at least 30 minutes.');
  if (minutesOut > 60 * 24 * 30) throw new Error('Auctions can run for at most 30 days.');

  return prisma.auction.create({
    data: {
      profileId,
      title,
      description: (input.description || '').trim().slice(0, 1000),
      imageUrl: input.imageUrl?.trim() || null,
      category: input.category?.trim().slice(0, 40) || null,
      startingBid: Math.round(input.startingBidCents),
      reservePrice: input.reservePriceCents == null ? null : Math.round(input.reservePriceCents),
      currentBid: null,
      endsAt,
    },
  });
}

export type PlaceBidInput = {
  auctionId: string;
  bidderEmail: string;
  bidderName?: string | null;
  bidderId?: string | null;
  amountCents: number;
};

export async function placeBid(input: PlaceBidInput) {
  if (!Number.isFinite(input.amountCents) || input.amountCents <= 0) {
    throw new Error('Enter a real bid amount.');
  }
  return prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({ where: { id: input.auctionId } });
    if (!auction) throw new Error('Auction not found.');
    if (auction.status !== 'active') throw new Error('This auction is closed.');
    if (auction.endsAt.getTime() <= Date.now()) throw new Error('This auction just ended.');

    const minBid = auction.currentBid != null
      ? auction.currentBid + MIN_INCREMENT_CENTS
      : auction.startingBid;
    if (input.amountCents < minBid) {
      throw new Error(`Bid must be at least $${(minBid / 100).toFixed(2)}.`);
    }

    const lastBid = await tx.bid.findFirst({
      where: { auctionId: input.auctionId },
      orderBy: { amount: 'desc' },
    });
    if (lastBid && lastBid.bidderEmail.toLowerCase() === input.bidderEmail.toLowerCase()) {
      throw new Error("You're already the top bidder.");
    }

    const bid = await tx.bid.create({
      data: {
        auctionId: input.auctionId,
        bidderEmail: input.bidderEmail.toLowerCase(),
        bidderName: input.bidderName || null,
        bidderId: input.bidderId || null,
        amount: Math.round(input.amountCents),
      },
    });

    // anti-snipe: extend by 5 minutes if bid placed in last 5 minutes
    const remainingMs = auction.endsAt.getTime() - Date.now();
    const extend = remainingMs < 5 * 60 * 1000;
    const newEnd = extend ? new Date(Date.now() + 5 * 60 * 1000) : auction.endsAt;

    await tx.auction.update({
      where: { id: auction.id },
      data: {
        currentBid: bid.amount,
        bidCount: { increment: 1 },
        endsAt: newEnd,
      },
    });

    return { bid, extended: extend };
  });
}

export async function cancelAuction(auctionId: string, userId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { profile: true },
  });
  if (!auction) throw new Error('Auction not found.');
  if (auction.profile.userId !== userId) throw new Error('Not your auction.');
  if (auction.bidCount > 0) throw new Error("Can't cancel an auction that already has bids.");
  await prisma.auction.update({
    where: { id: auctionId },
    data: { status: 'cancelled' },
  });
}

export function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return '—';
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatTimeLeft(endsAt: string | Date): string {
  const end = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
  const ms = end.getTime() - Date.now();
  if (ms <= 0) return 'ended';
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}
