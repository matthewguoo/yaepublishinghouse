import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>八</span>
          <div className={styles.brandText}>
            <span className={styles.brandJp}>八重堂書店</span>
            <span className={styles.brandEn}>Yae Publishing House</span>
          </div>
        </div>
        
        <nav className={styles.footerNav}>
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>Shop</span>
            <Link href="/products" className={styles.footerLink}>Products</Link>
            <Link href="/shipping" className={styles.footerLink}>Shipping</Link>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>Resources</span>
            <Link href="/editorial" className={styles.footerLink}>Editorial</Link>
            <Link href="/tools" className={styles.footerLink}>Tools</Link>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>Connect</span>
            <a href="https://twitter.com/pci_yae" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Twitter</a>
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
