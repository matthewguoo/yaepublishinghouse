/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { DoodleArrow, DoodleBow, DoodleHeart, DoodleSakura, DoodleStar } from '../components/scrapbook-doodles';
import { getProfileByHandle } from '../lib/data';
import { getProfileTheme } from '../lib/themes';
import styles from './page.module.css';

function buildThemeVars(themeKey?: string | null): CSSProperties {
  const theme = getProfileTheme(themeKey);

  return {
    '--theme-accent': theme.accent,
    '--theme-accent-deep': theme.accentDeep,
    '--theme-tint': theme.tint,
    '--theme-tint-strong': theme.tintStrong,
    '--theme-paper': theme.paper,
    '--theme-paper-alt': theme.paperAlt,
    '--theme-tape': theme.tape,
    '--theme-ink': theme.ink,
    '--theme-sticker': theme.sticker,
  } as CSSProperties;
}

export default async function HomePage() {
  const demo = await getProfileByHandle('yuuko');
  const polaroids = (demo?.polaroids || []).slice(0, 4);

  return (
    <main className={styles.page}>
      <section className={styles.heroShell} style={buildThemeVars(demo?.themeKey)}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>yp</span>
            <span>Yae Publishing House</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/@yuuko">peek at yuuko</Link>
            <Link href="/signup">claim a page</Link>
            <Link href="/login">login</Link>
          </nav>
        </header>

        <div className={styles.heroGrid}>
          <div className={styles.copyPaper}>
            <div className={styles.tapeTop} />
            <div className="pill">little cosplay scrapbook page</div>
            <p className={styles.kicker}>not a linktree. not a portfolio. just your stuff.</p>
            <h1 className={styles.heroTitle}>
              a tiny page for <span className="marker-swipe">photos</span>, handles, and whatever else you want pinned up.
            </h1>
            <p className={styles.heroBody}>
              think taped polaroids, doodles in the margins, soft stickers, and a page color that actually feels like you.
              it is supposed to look homemade.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/signup" className="primary-button">
                make my page
              </Link>
              <Link href="/@yuuko" className="secondary-button">
                see the demo
              </Link>
            </div>

            <div className={styles.marginNotes}>
              <span>magic link only</span>
              <span>5 photo slots</span>
              <span>pick a pastel theme</span>
            </div>

            <DoodleArrow className={styles.arrowDoodle} />
            <DoodleStar className={styles.starDoodle} />
          </div>

          <div className={styles.collageBoard}>
            <div className={`${styles.sticker} ${styles.stickerTop}`}>cute & messy</div>
            <div className={`${styles.sticker} ${styles.stickerBottom}`}>made with love</div>
            <DoodleBow className={styles.bowDoodle} />
            <DoodleHeart className={styles.heartDoodle} />

            <article className={styles.previewCard}>
              <div className={styles.previewTapeLeft} />
              <div className={styles.previewTapeRight} />
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

              <div className={styles.previewThemeRow}>
                <span className={styles.previewThemeLabel}>page color</span>
                <div className={styles.swatchRow}>
                  {['#f29bc0', '#baa5f7', '#87d4b4', '#e8c96b', '#8fc7f8'].map((color) => (
                    <span key={color} className={styles.swatch} style={{ background: color }} />
                  ))}
                </div>
              </div>

              <div className={styles.previewPolaroids}>
                {polaroids.map((polaroid, index) => (
                  <article key={index} className={styles.polaroid}>
                    <div className={styles.polaroidTape} />
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
            </article>
          </div>
        </div>
      </section>

      <section className={styles.notesGrid}>
        <article className={styles.noteCard}>
          <div className={styles.noteTape} />
          <p className={styles.noteTitle}>what goes on it</p>
          <p className={styles.noteBody}>your name, bio, handles, character list, and a little wall for con photos or placeholders.</p>
        </article>
        <article className={`${styles.noteCard} ${styles.noteCardTilt}`}>
          <div className={styles.noteTape} />
          <p className={styles.noteTitle}>theme colors</p>
          <p className={styles.noteBody}>pink, lavender, mint, butter yellow, peach, sky blue, matcha, rose. pick one and the whole page shifts with it.</p>
        </article>
        <article className={styles.noteCardWide}>
          <DoodleSakura className={styles.sakuraDoodle} />
          <p className={styles.noteTitle}>the point</p>
          <p className={styles.noteBody}>
            it should feel like an old tumblr page and a scrapbook had a baby. if it starts looking like startup software, the design failed.
          </p>
        </article>
      </section>

      <section className={styles.footerCard}>
        <div>
          <p className={styles.footerKicker}>okay, enough talking</p>
          <h2>go claim a handle and make your page way cuter than it needs to be.</h2>
        </div>
        <div className={styles.footerActions}>
          <Link href="/signup" className="primary-button">
            start with email
          </Link>
          <Link href="/typography" className="ghost-button">
            old typography page still exists
          </Link>
        </div>
      </section>
    </main>
  );
}
