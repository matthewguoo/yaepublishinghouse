'use client';

import Link from 'next/link';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>八</div>
          <div className={styles.brandText}>
            <span className={styles.brandJp}>八重堂書店</span>
            <span className={styles.brandEn}>Yae Publishing House</span>
          </div>
        </div>
        
        <nav className={styles.footerNav}>
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>Shop</span>
            <Link href="/products" className={styles.footerLink}>Products</Link>
            <Link href="/news" className={styles.footerLink}>Editorial</Link>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>Resources</span>
            <Link href="/tools/png-transparency" className={styles.footerLink}>Tools</Link>
            <Link href="/sitemap" className={styles.footerLink}>Sitemap</Link>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>Connect</span>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <a href="https://instagram.com/yaepublishing.house" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Instagram</a>
          </div>
        </nav>
      </div>
      
      <div className={styles.footerBottom}>
        <span className={styles.copyright}>© 2026 Yae Publishing House. Fan-made, not affiliated with HoYoverse.</span>
      </div>
    </footer>
  );
}
