'use client';

import styles from './page.module.css';

const links = [
  {
    title: 'Yae Publishing House',
    subtitle: 'Home',
    url: 'https://yaepublishing.house',
    icon: '🏠',
  },
  {
    title: 'Yae Publishing House',
    subtitle: '@yae.trades',
    url: 'https://instagram.com/yae.trades',
    icon: '📸',
  },
  {
    title: 'Cosplay',
    subtitle: '@yuuko.koro',
    url: 'https://instagram.com/yuuko.koro',
    icon: '🦊',
  },
];

export default function LinksPage() {
  return (
    <main className={styles.main}>
      {/* Ambient background */}
      <div className={styles.bgGlow} />
      <div className={styles.bgNoise} />

      <div className={styles.container}>
        {/* Profile section */}
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <span className={styles.avatarEmoji}>🦊</span>
          </div>
          <h1 className={styles.name}>Yae Publishing House</h1>
          <p className={styles.bio}>cosplay · pcb art · mischief</p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className={styles.linkCard}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className={styles.linkIcon}>{link.icon}</span>
              <div className={styles.linkText}>
                <span className={styles.linkTitle}>{link.title}</span>
                <span className={styles.linkSubtitle}>{link.subtitle}</span>
              </div>
              <span className={styles.linkArrow}>→</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <span>© 2158 AE Yae Publishing House</span>
        </footer>
      </div>
    </main>
  );
}
