'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auction-detail.module.css';

type Props = {
  auctionId: string;
  signedIn: boolean;
  isOwner: boolean;
  isOver: boolean;
  minBidCents: number;
};

export function BidForm({ auctionId, signedIn, isOwner, isOver, minBidCents }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState((minBidCents / 100).toFixed(2));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (isOver) {
    return <div className={styles.endedBanner}>this auction has ended.</div>;
  }

  if (isOwner) {
    return <div className={styles.signInPrompt}>this is your auction. you can&apos;t bid on it.</div>;
  }

  if (!signedIn) {
    return (
      <div className={styles.signInPrompt}>
        <a href={`/login?callbackUrl=/auctions/${auctionId}`}>sign in</a> to place a bid.
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auctions/${auctionId}/bids`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Bid failed.');
      }
      setSuccess(json.extended ? 'Bid in! Anti-snipe extended the timer 5 minutes.' : 'Bid in! Good luck.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bid failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
      <div className={styles.bidForm}>
        <input
          type="number"
          step="0.01"
          min={(minBidCents / 100).toFixed(2)}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={submitting}
          aria-label="Bid amount"
        />
        <button type="submit" className={styles.bidButton} disabled={submitting}>
          {submitting ? '…' : 'Place bid'}
        </button>
      </div>
      <div className={styles.helperRow}>
        <span>min bid: ${(minBidCents / 100).toFixed(2)}</span>
        <span>5 min anti-snipe</span>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
    </form>
  );
}
