'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav.module.css';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu automatically whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop & mobile bar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span>Yae Publishing House | Matthew Guo</span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          <li>
            <Link href="/" className={styles.link}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.link}>
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" className={styles.link}>
              Blog
            </Link>
          </li>
        </ul>

        {/* Burger for mobile */}
        <button
          type="button"
          aria-label="Toggle navigation"
          className={styles.burger}
          onClick={() => setOpen(!open)}
        >
          <span />
        </button>
      </nav>

      {/* Slide-down panel for mobile */}
      {open && (
        <ul className={styles.mobileMenu}>
          <li>
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
