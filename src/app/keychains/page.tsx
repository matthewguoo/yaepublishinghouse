import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import SectionHeader from '@/components/SectionHeader';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import KeychainStudio from './KeychainStudio';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Custom Keychains · Yae Publishing House',
  description:
    'Real gold plating on fiberglass. Small-batch custom keychains for artists.',
};

export default async function KeychainsPage() {
  const user = await getCurrentUser();
  const me = user ? { id: user.id, email: user.email } : null;

  // Load one dbUser check to ensure the session is still valid on the profile
  if (user) {
    const exists = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true } });
    if (!exists) {
      // stale session - render as signed out
      return renderPage(null);
    }
  }
  return renderPage(me);
}

function renderPage(me: { id: string; email: string } | null) {
  return (
    <SiteLayout>
      <div className={styles.banner}>
        Launch promo · 50 keychains, 5 designs, US$100 with code &nbsp;<b>LAUNCH50</b>
      </div>

      <KeychainStudio me={me} />

      <section className={styles.section}>
        <SectionHeader title="From the workshop" />
        <p className={styles.sectionIntro}>
          A small run of pieces made for artists at cons this year. Each is fiberglass, plated
          with real gold, printed with the artist&rsquo;s work on top.
        </p>
        <div className={styles.gallery}>
          {[
            { label: 'Yae Miko', sub: '32×48mm · gold + red silkscreen', tone: 'rose' },
            { label: 'March 7th', sub: '40×40mm · gold + cyan silkscreen', tone: 'ice' },
            { label: 'Sakura Crest', sub: '45×45mm · gold heavy', tone: 'gold' },
            { label: 'Shrine Torii', sub: '30×55mm · vermilion + gold', tone: 'crimson' },
          ].map((g) => (
            <figure key={g.label} className={`${styles.galleryCard} ${styles[`tone_${g.tone}`]}`}>
              <div className={styles.galleryArt}><div className={styles.galleryChip} /></div>
              <figcaption>
                <div className={styles.galleryLabel}>{g.label}</div>
                <div className={styles.gallerySub}>{g.sub}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Why this, not acrylic" />
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <div className={styles.whyNum}>01</div>
            <h3 className={styles.whyTitle}>Real gold. Not printed.</h3>
            <p className={styles.whyBody}>
              A thin layer of actual gold is plated onto the exposed metal. It catches light like
              jewelry. It doesn&rsquo;t peel.
            </p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyNum}>02</div>
            <h3 className={styles.whyTitle}>Fiberglass, not plastic.</h3>
            <p className={styles.whyBody}>
              The substrate is the same rigid composite used in aerospace hardware. Thin, unbreakable,
              feels like a coin.
            </p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyNum}>03</div>
            <h3 className={styles.whyTitle}>Sells at your table.</h3>
            <p className={styles.whyBody}>
              A tier of finish acrylic vendors can&rsquo;t reach. Priced to sell at $15–25, next to
              your $5 acrylics.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Pricing" />
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingEyebrow}>Launch Promo · code LAUNCH50</div>
            <div className={styles.pricingPrice}>US$100<span>/run</span></div>
            <ul className={styles.pricingList}>
              <li>50 keychains</li>
              <li>Up to 5 designs (panelized)</li>
              <li>US shipping included</li>
              <li>~2–3 week lead time</li>
            </ul>
            <div className={styles.pricingHint}>First-time customers only.</div>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingEyebrow}>Standard</div>
            <div className={styles.pricingPrice}>US$200<span>/run</span></div>
            <ul className={styles.pricingList}>
              <li>Same 50 pieces / 5 designs base</li>
              <li>Design revisions welcome</li>
              <li>Priority queue after first order</li>
              <li>Volume pricing at 100+</li>
            </ul>
            <div className={styles.pricingHint}>Reorders and future runs.</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="How it works" />
        <ol className={styles.process}>
          <li>
            <span className={styles.processNum}>1</span>
            <div>
              <div className={styles.processTitle}>Prepare your PSD</div>
              <div className={styles.processBody}>
                Three layers named <code>outline</code>, <code>gold</code>, <code>art</code>.{' '}
                <Link href="/keychains/how-to" className={styles.link}>Full guide →</Link>
              </div>
            </div>
          </li>
          <li>
            <span className={styles.processNum}>2</span>
            <div>
              <div className={styles.processTitle}>Preview in the browser</div>
              <div className={styles.processBody}>
                Drop your file into the studio above. See what you&rsquo;ll receive.
              </div>
            </div>
          </li>
          <li>
            <span className={styles.processNum}>3</span>
            <div>
              <div className={styles.processTitle}>Confirm and manufacture</div>
              <div className={styles.processBody}>
                Checkout, and we&rsquo;ll email a proof within 24 hours. 2–3 weeks to your door.
              </div>
            </div>
          </li>
        </ol>
      </section>

      <div className={styles.footNote}>
        Questions? <Link href="/contact" className={styles.link}>Talk to us</Link> or read the{' '}
        <Link href="/keychains/how-to" className={styles.link}>full artwork guide</Link>.
      </div>
    </SiteLayout>
  );
}
