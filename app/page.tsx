/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { getProfileByHandle } from '../lib/data';
import styles from './page.module.css';

export default async function HomePage() {
  const demo = await getProfileByHandle('yuuko');

  return (
    <main className={styles.page}>
      <section className={styles.heroShell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>✿</span>
            <span>Yae Publishing House</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/@yuuko">Demo</Link>
            <Link href="/signup">Claim a page</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>

        <div className={styles.heroGrid}>
          <div className={styles.copyStack}>
            <div className="pill">cute cosplayer pages, not boring link farms</div>
            <p className={styles.scribble}>claim your cute cosplayer page</p>
            <h1 className={styles.heroTitle}>
              One soft little home for your socials, your photo drops, and the characters you love.
            </h1>
            <p className={styles.heroBody}>
              Built for cosplay people with taste. Show your handle, your current lineup, and a tiny polaroid wall without looking like a beige startup landing page.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/signup" className="primary-button">
                Claim your page
              </Link>
              <Link href="/@yuuko" className="secondary-button">
                Peek at @yuuko
              </Link>
            </div>
            <div className={styles.miniNotes}>
              <span>magic link login</span>
              <span>custom @handles</span>
              <span>polaroid uploads</span>
            </div>
          </div>

          <div className={styles.previewWrap}>
            <div className={styles.stickerA}>new</div>
            <div className={styles.stickerB}>cute</div>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.previewAvatar}>
                  {demo?.avatarUrl ? <img src={demo.avatarUrl} alt={demo.displayName} /> : <span>Y</span>}
                </div>
                <div>
                  <p className={styles.previewName}>{demo?.displayName || 'Yuuko'}</p>
                  <p className={styles.previewHandle}>@{demo?.handle || 'yuuko'}</p>
                </div>
              </div>

              <p className={styles.previewBio}>{demo?.bio}</p>

              <div className={styles.previewLinks}>
                <span>Twitter</span>
                <span>Instagram</span>
                <span>Website</span>
              </div>

              <div className={styles.previewPolaroids}>
                {(demo?.polaroids || []).slice(0, 4).map((polaroid, index) => (
                  <article key={index} className={styles.polaroid}>
                    <div className={styles.polaroidPhoto}>
                      {polaroid.imageUrl ? (
                        <img src={polaroid.imageUrl} alt={polaroid.caption || ''} />
                      ) : (
                        <span>{polaroid.caption || 'photo soon'}</span>
                      )}
                    </div>
                    <p>{polaroid.caption || 'coming soon'}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featureGrid}>
        <article className={styles.featureCard}>
          <h2>Actually made for cosplay people</h2>
          <p>
            Drop characters, socials, and photo placeholders in one profile instead of stitching together six random cards.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h2>Magic link only</h2>
          <p>
            No password soup. You sign in with email, click once, and land in your dashboard.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h2>Polaroid wall energy</h2>
          <p>
            Your page gets a tiny scrapbook grid for hero shots, con weekends, or placeholders while the pro photos cook.
          </p>
        </article>
      </section>

      <section className={styles.band}>
        <div>
          <p className={styles.bandLabel}>Why it feels different</p>
          <h2>This is supposed to look like a little shrine to your cosplay life, not a SaaS pricing page.</h2>
        </div>
        <div className={styles.bandTags}>
          <span>soft pink</span>
          <span>rounded</span>
          <span>sakura</span>
          <span>scrapbook-ish</span>
          <span>cute but still clean</span>
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.scribbleBottom}>your page should be prettier than your form stack</p>
        <h2>Reserve a handle and make it yours.</h2>
        <div className={styles.ctaRow}>
          <Link href="/signup" className="primary-button">
            Start with email
          </Link>
          <Link href="/typography" className="ghost-button">
            Keep the old typography page
          </Link>
        </div>
      </section>
    </main>
  );
}
