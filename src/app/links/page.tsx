'use client';

import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

const links = [
  {
    title: 'Shop',
    url: 'https://yaepublishing.house',
  },
  {
    title: 'Instagram',
    subtitle: '@yae.trades',
    url: 'https://instagram.com/yae.trades',
  },
  {
    title: 'Cosplay',
    subtitle: '@yuuko.koro',
    url: 'https://instagram.com/yuuko.koro',
  },
  {
    title: 'Twitter',
    subtitle: '@pci_yae',
    url: 'https://twitter.com/pci_yae',
  },
];

export default function LinksPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Links</h1>
          <p className={styles.subtitle}>Find us elsewhere</p>
        </header>

        <div className={styles.links}>
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.linkTitle}>{link.title}</span>
              {link.subtitle && (
                <span className={styles.linkSubtitle}>{link.subtitle}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
