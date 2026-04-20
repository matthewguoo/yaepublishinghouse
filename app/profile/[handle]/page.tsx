/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DoodleArrow, DoodleBow, DoodleHeart, DoodleSakura, DoodleStar } from '../../../components/scrapbook-doodles';
import { formatSocialLinks, getProfileByHandle } from '../../../lib/data';
import { getProfileTheme } from '../../../lib/themes';
import styles from './profile.module.css';

function buildThemeVars(themeKey?: string | null): CSSProperties {
  const theme = getProfileTheme(themeKey);

  return {
    '--profile-accent': theme.accent,
    '--profile-accent-deep': theme.accentDeep,
    '--profile-tint': theme.tint,
    '--profile-tint-strong': theme.tintStrong,
    '--profile-paper': theme.paper,
    '--profile-paper-alt': theme.paperAlt,
    '--profile-tape': theme.tape,
    '--profile-ink': theme.ink,
    '--profile-sticker': theme.sticker,
  } as CSSProperties;
}

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const profile = await getProfileByHandle(params.handle);

  if (!profile) {
    return {
      title: 'Profile not found',
    };
  }

  return {
    title: `@${profile.handle}`,
    description: profile.bio || `${profile.displayName}'s scrapbook page on Yae Publishing House`,
  };
}

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const profile = await getProfileByHandle(params.handle);

  if (!profile) {
    notFound();
  }

  const links = formatSocialLinks(profile);
  const polaroids = Array.from({ length: 5 }, (_, position) => {
    return profile.polaroids?.find((item) => item.position === position) || { position, imageUrl: '', caption: '' };
  });

  return (
    <main className={styles.page} style={buildThemeVars(profile.themeKey)}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>yp</span>
          <span>Yae Publishing House</span>
        </Link>
        <div className={styles.topActions}>
          <span className={styles.themeChip}>{getProfileTheme(profile.themeKey).label}</span>
          <Link href="/signup" className="secondary-button">
            make your own
          </Link>
        </div>
      </header>

      <section className={styles.heroCard}>
        <div className={styles.heroTape} />
        <div className={styles.heroTapeRight} />
        <DoodleArrow className={styles.arrowDoodle} />
        <DoodleStar className={styles.starDoodle} />
        <DoodleBow className={styles.bowDoodle} />

        <div className={styles.heroGrid}>
          <section className={styles.identityCard}>
            <div className={styles.avatarWrap}>
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.displayName} /> : <span>{profile.displayName.slice(0, 1)}</span>}
            </div>
            <div className={styles.identityCopy}>
              <p className={styles.handle}>@{profile.handle}</p>
              <h1 className={styles.name}>{profile.displayName}</h1>
              <p className={styles.bio}>{profile.bio || 'still decorating this page.'}</p>
            </div>
          </section>

          <aside className={styles.sideNotes}>
            <div className={styles.linkCard}>
              <p className={styles.blockTitle}>find me here</p>
              <div className={styles.linkList}>
                {links.length ? (
                  links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.linkChip}>
                      <span>{link.label}</span>
                      <span className={styles.linkArrow}>↗</span>
                    </a>
                  ))
                ) : (
                  <p className={styles.emptyNote}>links are still getting pinned up.</p>
                )}
              </div>
            </div>

            <div className={styles.characterCard}>
              <p className={styles.blockTitle}>current lineup</p>
              <div className={styles.characterList}>
                {profile.characters?.length ? (
                  profile.characters.map((character) => <span key={character}>{character}</span>)
                ) : (
                  <p className={styles.emptyNote}>character list coming soon.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.galleryCard}>
        <div className={styles.galleryHeader}>
          <div>
            <p className={styles.galleryKicker}>photo wall</p>
            <h2>little receipts from con life</h2>
          </div>
          <p className={styles.galleryNote}>hero shots, mirror pics, placeholders, whatever. taped on crooked is part of the charm.</p>
        </div>

        <DoodleHeart className={styles.heartDoodle} />
        <DoodleSakura className={styles.sakuraDoodle} />

        <div className={styles.galleryGrid}>
          {polaroids.map((polaroid, index) => (
            <article key={index} className={styles.polaroid}>
              <div className={styles.tape} />
              <div className={styles.photoFrame}>
                {polaroid.imageUrl ? (
                  <img src={polaroid.imageUrl} alt={polaroid.caption || ''} />
                ) : (
                  <span>{polaroid.caption || 'photo slot waiting'}</span>
                )}
              </div>
              <p>{polaroid.caption || 'upload pending'}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
