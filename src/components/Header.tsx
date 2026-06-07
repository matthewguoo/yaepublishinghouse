'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoWrap}>
        <div className={styles.logoMark}>八</div>
        <div className={styles.logoText}>
          <span className={styles.logoJp}>八重堂書店</span>
          <span className={styles.logoEn}>YAE PUBLISHING HOUSE</span>
        </div>
      </Link>
      <nav className={styles.nav}>
        <Link href="/products" className={styles.navLink}>Products</Link>
        <Link href="/editorial" className={styles.navLink}>Editorial</Link>
        <Link href="/tools" className={styles.navLink}>Tools</Link>
      </nav>
    </header>
  );
}
