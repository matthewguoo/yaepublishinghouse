'use client';

import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import styles from './SiteLayout.module.css';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <SiteHeader />
      <main className={styles.main}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
