'use client';

import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SectionHeader from '@/components/SectionHeader';
import styles from './page.module.css';

export default function SitemapPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]} />
        <SectionHeader title="Sitemap" as="h1" marginBottom="2.5rem" />
        
        <div className={styles.columns}>
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Shop</h2>
            <ul className={styles.linkList}>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/products/nameless-pass">Nameless Honor Pass</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Content</h2>
            <ul className={styles.linkList}>
              <li><Link href="/news">Editorial</Link></li>
              <li><Link href="/tools/png-transparency">PNG Tool</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Account</h2>
            <ul className={styles.linkList}>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/account">My Account</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Info</h2>
            <ul className={styles.linkList}>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/sitemap">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
