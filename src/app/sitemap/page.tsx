'use client';

import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

export default function SitemapPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; Sitemap
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>Sitemap</h1>
            <div className={styles.articleMeta}>
              Navigation guide for Yae Publishing House
            </div>
          </header>

          <div className={styles.articleContent}>
            <h2>Main Pages</h2>
            <p><a href="/">Home</a> — Return to the main storefront</p>
            <p><a href="/sitemap">Sitemap</a> — You are here</p>
            <p><a href="/contact">Contact Us</a> — Inquiries and support</p>

            <h2>News & Announcements</h2>
            <p><a href="/news/anniversary-dialogue">500th Anniversary Special Dialogue</a> — Interview with Lady Yae Miko and the Raiden Shogun</p>
            <p><a href="/news/hoyofair-2026">HoYoFair 2026 Report</a> — Coverage from our Los Angeles event attendance</p>

            <h2>Products</h2>
            <p><a href="/products">All Products</a> — Browse all available merchandise</p>
            <p><a href="/products/nameless-pass">Nameless Honor Pass</a> — Limited edition gold ENIG PCB collectible (IPC Authorized)</p>

            <h2>Tools</h2>
            <p><a href="/tools/png-transparency">PNG Transparency Maker</a> — Free background removal tool</p>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
