import Link from 'next/link';
import { listActiveAuctions } from '../../lib/auctions';
import { AuctionCard } from '../../components/auctions/auction-card';
import styles from './auctions.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Auctions',
  description: 'Bid on cosplay items, commissions, and props from cosplayers across the community.',
};

export default async function AuctionsPage() {
  const auctions = await listActiveAuctions(48);

  const totalBids = auctions.reduce((sum, a) => sum + a.bidCount, 0);
  const top = auctions.reduce((max, a) => Math.max(max, a.currentBid ?? a.startingBid), 0);

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>yp</span>
          <span>Yae Publishing House</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/auctions">auctions</Link>
          <Link href="/@yuuko">demo</Link>
          <Link href="/dashboard">dashboard</Link>
          <Link href="/login">login</Link>
        </nav>
      </header>

      <section className={styles.heroRow}>
        <div className={styles.heroCard}>
          <span className={styles.heroEyebrow}>community auctions ✿</span>
          <h1 className={styles.heroTitle}>cosplay pieces, commissions, & one-of-one props.</h1>
          <p className={styles.heroBody}>
            cosplayers list things they made, wore, or are taking commissions on. you bid. last bid before the timer hits zero wins. five minute anti-snipe, so it doesn&apos;t come down to milliseconds.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/auctions/new" className="primary-button">list an item</Link>
            <Link href="#listings" className="secondary-button">browse all</Link>
          </div>
        </div>

        <aside className={styles.statCard}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>live now</span>
            <span className={styles.statValue}>{auctions.length}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>total bids</span>
            <span className={styles.statValue}>{totalBids}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>top bid</span>
            <span className={styles.statValue}>${top > 0 ? (top / 100).toFixed(0) : '—'}</span>
          </div>
        </aside>
      </section>

      <div id="listings" className={styles.toolbar}>
        <h2>live listings</h2>
        <div className={styles.filterGroup}>
          <span className={styles.filterChip} data-active="true">all</span>
          <span className={styles.filterChip}>ending soon</span>
          <span className={styles.filterChip}>new</span>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className={styles.empty}>
          no active auctions right now. <Link href="/auctions/new" style={{ color: 'var(--berry)', textDecoration: 'underline' }}>be the first to list one</Link>.
        </div>
      ) : (
        <div className={styles.grid}>
          {auctions.map((a) => (
            <AuctionCard key={a.id} auction={a} />
          ))}
        </div>
      )}
    </main>
  );
}
