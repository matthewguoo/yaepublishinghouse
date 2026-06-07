'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoWrap} onClick={close}>
        <div className={styles.logoMark}>八</div>
        <div className={styles.logoText}>
          <span className={styles.logoJp}>八重堂書店</span>
          <span className={styles.logoEn}>YAE PUBLISHING HOUSE</span>
        </div>
      </Link>

      {/* Desktop hover-expand nav */}
      <div className={styles.navZone} aria-hidden="true">
        <div className={styles.navExpanded}>
          <div className={styles.navColumn}>
            <span className={styles.navColumnTitle}>Shop</span>
            <Link href="/products" className={styles.navLink}>Products</Link>
            <Link href="/news" className={styles.navLink}>Editorial</Link>
            <Link href="/tools/png-transparency" className={styles.navLink}>Tools</Link>
          </div>
          <div className={styles.navColumn}>
            <span className={styles.navColumnTitle}>Info</span>
            <Link href="/sitemap" className={styles.navLink}>Sitemap</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </div>
          <div className={styles.navColumn}>
            <span className={styles.navColumnTitle}>Account</span>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/register" className={styles.navLink}>Register</Link>
          </div>
          <div className={styles.navBadges}>
            <span className={styles.badge}>Free US Shipping</span>
            <span className={styles.badge}>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        className={styles.mobileTrigger}
        aria-label="Open menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <span className={styles.mobileTriggerBar} />
        <span className={styles.mobileTriggerBar} />
        <span className={styles.mobileTriggerBar} />
      </button>

      {/* Mobile drawer */}
      <div
        className={`${styles.backdrop} ${mobileOpen ? styles.backdropOpen : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close menu"
            onClick={close}
          >
            ×
          </button>
        </div>

        <nav className={styles.drawerNav}>
          <div className={styles.drawerSection}>
            <span className={styles.drawerSectionTitle}>Shop</span>
            <Link href="/products" className={styles.drawerLink} onClick={close}>Products</Link>
            <Link href="/news" className={styles.drawerLink} onClick={close}>Editorial</Link>
            <Link href="/tools/png-transparency" className={styles.drawerLink} onClick={close}>Tools</Link>
          </div>
          <div className={styles.drawerSection}>
            <span className={styles.drawerSectionTitle}>Info</span>
            <Link href="/sitemap" className={styles.drawerLink} onClick={close}>Sitemap</Link>
            <Link href="/contact" className={styles.drawerLink} onClick={close}>Contact</Link>
          </div>
          <div className={styles.drawerSection}>
            <span className={styles.drawerSectionTitle}>Account</span>
            <Link href="/login" className={styles.drawerLink} onClick={close}>Login</Link>
            <Link href="/register" className={styles.drawerLink} onClick={close}>Register</Link>
          </div>
        </nav>

        <div className={styles.drawerFooter}>
          <span className={styles.drawerBadge}>Free US Shipping</span>
          <span className={styles.drawerBadge}>Secure Checkout</span>
        </div>
      </aside>
    </header>
  );
}
