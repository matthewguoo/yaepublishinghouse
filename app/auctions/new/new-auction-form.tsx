'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './new-auction.module.css';

const DURATION_OPTIONS: { label: string; hours: number }[] = [
  { label: '1 hour', hours: 1 },
  { label: '6 hours', hours: 6 },
  { label: '24 hours', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '7 days', hours: 168 },
];

export function NewAuctionForm({ handle }: { handle: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('cosplay');
  const [startingBid, setStartingBid] = useState('5');
  const [reservePrice, setReservePrice] = useState('');
  const [hours, setHours] = useState(72);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const endsAt = useMemo(() => new Date(Date.now() + hours * 3600 * 1000), [hours]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed.');
      setImageUrl(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/auctions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl: imageUrl || undefined,
          category,
          startingBid: Number(startingBid),
          reservePrice: reservePrice ? Number(reservePrice) : null,
          endsAt: endsAt.toISOString(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not list.');
      router.push(`/auctions/${json.auction.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not list.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/auctions" className={styles.back}>← back to auctions</Link>
        <span className={styles.handleChip}>listing as @{handle}</span>
      </header>

      <h1 className={styles.title}>list a new auction</h1>
      <p className={styles.subtitle}>cosplay pieces, props, commissions, fan art. anything you made or wore.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.col}>
          <label className={styles.field}>
            <span>title</span>
            <input
              type="text"
              value={title}
              maxLength={80}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="hand-sewn sailor jupiter top, M"
            />
          </label>

          <label className={styles.field}>
            <span>description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="materials, condition, sizing, notes for the buyer..."
            />
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="cosplay">cosplay piece</option>
                <option value="commission">commission slot</option>
                <option value="prop">prop</option>
                <option value="wig">wig</option>
                <option value="art">art / print</option>
                <option value="other">other</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>duration</span>
              <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.hours} value={opt.hours}>{opt.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>starting bid (USD)</span>
              <input
                type="number"
                step="1"
                min="1"
                value={startingBid}
                required
                onChange={(e) => setStartingBid(e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>reserve (optional)</span>
              <input
                type="number"
                step="1"
                min="0"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="hidden minimum"
              />
            </label>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.imageDrop}>
            {imageUrl ? (
              <img src={imageUrl} alt="auction preview" />
            ) : (
              <span>upload a hero photo</span>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            {uploading && <p className={styles.helper}>uploading...</p>}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>ends</span>
              <strong>{endsAt.toLocaleString()}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>min bid</span>
              <strong>${startingBid || '0'}.00</strong>
            </div>
            {reservePrice && (
              <div className={styles.summaryRow}>
                <span>reserve</span>
                <strong>${reservePrice}.00</strong>
              </div>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={submitting || uploading} className={styles.submit}>
            {submitting ? 'listing...' : 'go live'}
          </button>
          <p className={styles.helper}>5 min anti-snipe. 30 day max duration. you can cancel only if no bids.</p>
        </aside>
      </form>
    </main>
  );
}
