import type { Metadata } from 'next';
import SiteLayout from '@/components/SiteLayout';
import siteStyles from '@/components/SiteLayout.module.css';
import TravelMapLoader from '@/components/TravelMapLoader';
import { prisma } from '@/lib/db';
import styles from './travels.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Guuji's Travels",
  description: "An illustrated map of every flight and road trip the Guuji has taken.",
};

export default async function TravelsPage() {
  const trips = await prisma.trip.findMany({ orderBy: { date: 'desc' } });

  const serialized = trips.map((t) => ({
    ...t,
    date: t.date.toISOString(),
  }));

  return (
    <SiteLayout>
      <div className={siteStyles.pageContainer}>
        <div className={siteStyles.breadcrumb}>
          <a href="/">Home</a> &gt; Guuji&apos;s Travels
        </div>

        <header className={styles.header}>
          <span className={styles.tape} aria-hidden />
          <p className={styles.eyebrow}>field notes &amp; flight maps</p>
          <h1 className={styles.title}>guuji&apos;s travels</h1>
          <p className={styles.sub}>
            every flight, every road trip, scribbled onto one map. tap a pin or a line to peek into the story.
          </p>
        </header>

        <section className={styles.mapSection}>
          <TravelMapLoader trips={serialized} />
        </section>

        <footer className={styles.foot}>
          <span>{serialized.length} trip{serialized.length === 1 ? '' : 's'} logged so far ✦</span>
        </footer>
      </div>
    </SiteLayout>
  );
}
