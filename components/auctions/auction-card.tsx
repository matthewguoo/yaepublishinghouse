/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { AuctionSummary } from '../../lib/auctions';
import { formatPrice, formatTimeLeft } from '../../lib/auctions';
import styles from '../../app/auctions/auctions.module.css';

export function AuctionCard({ auction }: { auction: AuctionSummary }) {
  const ms = new Date(auction.endsAt).getTime() - Date.now();
  const urgent = ms > 0 && ms < 60 * 60 * 1000;
  const display = auction.currentBid ?? auction.startingBid;
  const priceLabel = auction.currentBid != null ? 'Top bid' : 'Starting at';

  return (
    <Link href={`/auctions/${auction.id}`} className={styles.card}>
      <div className={styles.cardImage}>
        {auction.imageUrl ? (
          <img src={auction.imageUrl} alt={auction.title} />
        ) : (
          <span className={styles.placeholder}>no photo yet</span>
        )}
        <span className={styles.statusBadge} data-urgent={urgent ? 'true' : 'false'}>
          {auction.isOver ? 'ended' : formatTimeLeft(auction.endsAt)}
        </span>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardOwner}>
          <span className={styles.ownerDot}>
            {auction.ownerAvatarUrl ? (
              <img src={auction.ownerAvatarUrl} alt={auction.handle} />
            ) : (
              auction.handle.slice(0, 1).toUpperCase()
            )}
          </span>
          @{auction.handle}
        </span>
        <h3 className={styles.cardTitle}>{auction.title}</h3>
        <div className={styles.cardPriceRow}>
          <div>
            <p className={styles.cardPriceLabel}>{priceLabel}</p>
            <p className={styles.cardPrice}>{formatPrice(display)}</p>
          </div>
          <span style={{ fontFamily: 'var(--font-note), cursive', color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
            {auction.bidCount} bid{auction.bidCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </Link>
  );
}
