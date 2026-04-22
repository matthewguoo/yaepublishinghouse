/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { formatPrice, formatTimeLeft, getAuction } from '../../../lib/auctions';
import { getProfileByUserId } from '../../../lib/data';
import { BidForm } from './bid-form';
import styles from './auction-detail.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const auction = await getAuction(params.id);
  if (!auction) return { title: 'Auction not found' };
  return {
    title: auction.title,
    description: auction.description?.slice(0, 160) || `auction by @${auction.handle}`,
  };
}

export default async function AuctionPage({ params }: { params: { id: string } }) {
  const auction = await getAuction(params.id);
  if (!auction) notFound();

  const session = await getServerSession(authOptions);
  const viewerProfile = session?.user?.id ? await getProfileByUserId(session.user.id) : null;
  const isOwner = viewerProfile?.handle === auction.handle;

  const minBidCents = auction.currentBid != null ? auction.currentBid + 100 : auction.startingBid;
  const ms = new Date(auction.endsAt).getTime() - Date.now();
  const urgent = !auction.isOver && ms > 0 && ms < 60 * 60 * 1000;

  return (
    <main className={styles.page}>
      <p className={styles.crumbs}>
        <Link href="/auctions">auctions</Link> / <span>{auction.title}</span>
      </p>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          {auction.imageUrl ? (
            <img src={auction.imageUrl} alt={auction.title} />
          ) : (
            <span className={styles.galleryEmpty}>no photo yet</span>
          )}
          <span className={styles.statusOverlay} data-urgent={urgent ? 'true' : 'false'}>
            {auction.isOver ? 'ended' : formatTimeLeft(auction.endsAt)}
          </span>
        </div>

        <aside className={styles.bidPanel}>
          <div className={styles.titleBlock}>
            <h1>{auction.title}</h1>
            <Link href={`/@${auction.handle}`} className={styles.ownerLink}>
              <span className={styles.ownerAvatar}>
                {auction.ownerAvatarUrl ? (
                  <img src={auction.ownerAvatarUrl} alt={auction.handle} />
                ) : (
                  auction.handle.slice(0, 1).toUpperCase()
                )}
              </span>
              listed by @{auction.handle}
            </Link>
          </div>

          <div className={styles.priceCard}>
            <div className={styles.priceMain}>
              <div>
                <p className={styles.priceLabel}>{auction.currentBid != null ? 'Top bid' : 'Starting at'}</p>
                <p className={styles.priceValue}>
                  {formatPrice(auction.currentBid ?? auction.startingBid)}
                </p>
              </div>
              <div className={styles.priceMeta}>
                <span>{auction.bidCount} bid{auction.bidCount === 1 ? '' : 's'}</span>
                {auction.reservePrice != null && (
                  <span>{auction.reserveMet ? 'reserve met ✓' : 'reserve not met'}</span>
                )}
                <span>ends {new Date(auction.endsAt).toLocaleString()}</span>
              </div>
            </div>

            <BidForm
              auctionId={auction.id}
              signedIn={!!session?.user?.email}
              isOwner={isOwner}
              isOver={auction.isOver}
              minBidCents={minBidCents}
            />
          </div>

          {auction.isOver && auction.winnerEmail && (
            <div className={styles.endedBanner}>
              winner notified at the email behind this top bid 🎀
            </div>
          )}
        </aside>
      </div>

      {auction.description && (
        <section className={styles.body}>
          <h2>about this listing</h2>
          <p className={styles.bodyText}>{auction.description}</p>
        </section>
      )}

      <section className={styles.bidHistory}>
        <h2>bid history</h2>
        {auction.bids.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-note), cursive', color: 'var(--ink-soft)' }}>
            no bids yet. be first.
          </p>
        ) : (
          <ul className={styles.bidList}>
            {auction.bids.map((bid, idx) => (
              <li key={bid.id} className={styles.bidRow}>
                <span>
                  {bid.bidderName}
                  {idx === 0 && <span className={styles.winner}>top bid</span>}
                </span>
                <span>
                  <span className={styles.bidAmount}>{formatPrice(bid.amount)}</span>
                  <span className={styles.timestamp}>
                    {new Date(bid.createdAt).toLocaleString()}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
