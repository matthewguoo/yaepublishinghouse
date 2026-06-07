'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoWrap}>
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

      {/* Mobile hamburger / close (animates into X when open) */}
      <button
        type="button"
        className={`${styles.mobileTrigger} ${mobileOpen ? styles.mobileTriggerOpen : ''}`}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-overlay-nav"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className={styles.mobileTriggerBar} />
        <span className={styles.mobileTriggerBar} />
        <span className={styles.mobileTriggerBar} />
      </button>

      {/* Mobile full-screen overlay */}
      <div
        id="mobile-overlay-nav"
        className={`${styles.overlay} ${mobileOpen ? styles.overlayOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <nav className={styles.overlayInner}>
          <div className={styles.overlaySection}>
            <span className={styles.overlaySectionTitle}>Shop</span>
            <Link href="/products" className={styles.overlayLink}>Products</Link>
            <Link href="/news" className={styles.overlayLink}>Editorial</Link>
            <Link href="/tools/png-transparency" className={styles.overlayLink}>Tools</Link>
          </div>
          <div className={styles.overlaySection}>
            <span className={styles.overlaySectionTitle}>Info</span>
            <Link href="/sitemap" className={styles.overlayLink}>Sitemap</Link>
            <Link href="/contact" className={styles.overlayLink}>Contact</Link>
          </div>
          <div className={styles.overlaySection}>
            <span className={styles.overlaySectionTitle}>Account</span>
            <Link href="/login" className={styles.overlayLink}>Login</Link>
            <Link href="/register" className={styles.overlayLink}>Register</Link>
          </div>

          <div className={styles.overlayFooter}>
            <span className={styles.overlayBadge}>Free US Shipping</span>
            <span className={styles.overlayBadge}>Secure Checkout</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
