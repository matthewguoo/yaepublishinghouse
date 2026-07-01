'use client';

import Image from 'next/image';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

const links = [
  {
    title: 'Shop',
    url: 'https://yaepublishing.house',
  },
  {
    title: 'Instagram',
    subtitle: '@yaepublishing.house',
    url: 'https://instagram.com/yaepublishing.house',
  },
  {
    title: 'Cosplay',
    subtitle: '@yuuko.koro',
    url: 'https://instagram.com/yuuko.koro',
  },
];

export default function LinksPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.sketch}>
          <Image
            src="/hero-sketch.png"
            alt=""
            width={600}
            height={400}
            priority
          />
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>八重堂書店</h1>
            <p className={styles.subtitle}>follow for giveaways</p>
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
      </div>
    </SiteLayout>
  );
}
