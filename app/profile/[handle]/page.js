/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatSocialLinks, getProfileByHandle } from '../../../lib/data';
import styles from './profile.module.css';

export async function generateMetadata({ params }) {
  const profile = await getProfileByHandle(params.handle);

  if (!profile) {
    return {
      title: 'Profile not found',
    };
  }

  return {
    title: `@${profile.handle}`,
    description: profile.bio || `${profile.displayName} on Yae Publishing House`,
  };
}

export default async function ProfilePage({ params }) {
  const profile = await getProfileByHandle(params.handle);

  if (!profile) {
    notFound();
  }

  const links = formatSocialLinks(profile);
  const polaroids = Array.from({ length: 5 }, (_, position) => {
    return profile.polaroids?.find((item) => item.position === position) || { position, imageUrl: '', caption: '' };
  });

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>✿</span>
          <span>Yae Publishing House</span>
        </Link>
        <Link href="/signup" className="secondary-button">
          Claim a page
        </Link>
      </header>

      <section className={styles.heroCard}>
        <div className={styles.heroRibbon}>public profile</div>
        <div className={styles.heroGrid}>
          <div className={styles.identity}>
            <div className={styles.avatarWrap}>
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.displayName} /> : <span>{profile.displayName.slice(0, 1)}</span>}
            </div>
            <div>
              <p className={styles.handle}>@{profile.handle}</p>
              <h1 className={styles.name}>{profile.displayName}</h1>
              <p className={styles.bio}>{profile.bio || 'No bio yet. Give it a minute.'}</p>
            </div>
          </div>

          <div className={styles.sideStack}>
            <div className={styles.linkBlock}>
              <p className={styles.blockTitle}>Links</p>
              <div className={styles.linkList}>
                {links.length ? (
                  links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={styles.linkChip}>
                      <span>{link.label}</span>
                      <span>↗</span>
                    </a>
                  ))
                ) : (
                  <p className={styles.emptyNote}>Links are still being filled in.</p>
                )}
              </div>
            </div>

            <div className={styles.characterBlock}>
              <p className={styles.blockTitle}>Characters</p>
              <div className={styles.characterList}>
                {profile.characters?.length ? (
                  profile.characters.map((character) => <span key={character}>{character}</span>)
                ) : (
                  <p className={styles.emptyNote}>Character list coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.galleryCard}>
        <div className={styles.galleryHeader}>
          <div>
            <p className={styles.galleryKicker}>polaroid wall</p>
            <h2>Recent drops and placeholders</h2>
          </div>
          <p className={styles.galleryNote}>A tiny scrapbook corner for con weekends, hero shots, and stuff that isn’t uploaded yet.</p>
        </div>
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
