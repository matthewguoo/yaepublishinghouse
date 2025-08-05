'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav.module.css';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Yae Publishing House | Matthew Guo
        </Link>
        <ul className={styles.links}>
          <li>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className={pathname === '/about' ? styles.active : ''}>
              About
            </Link>
          </li>
          {/* <li>
            <Link
              href="/blog"
              className={pathname.startsWith('/blog') ? styles.active : ''}
            >
              Blog
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
