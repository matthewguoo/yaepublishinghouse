'use client';

import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> &gt; Contact
        </div>

        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Contact</h1>
          <div className={styles.titleLine} />
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>General Inquiries</h2>
            <p className={styles.text}>
              Questions about orders, products, shipping, or just want to say hi?
              Email us and we&rsquo;ll get back to you within 1&ndash;2 business
              days.
            </p>
            <div className={styles.links}>
              <a className={styles.link} href="mailto:hello@yaepublishing.house">
                hello@yaepublishing.house
              </a>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Business &amp; Partnerships</h2>
            <p className={styles.text}>
              Wholesale orders, convention booths, collaboration drops, and
              licensing discussions. Include a short proposal and we&rsquo;ll
              route it to the right desk.
            </p>
            <div className={styles.links}>
              <a className={styles.link} href="mailto:business@yaepublishing.house">
                business@yaepublishing.house
              </a>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Press &amp; Media</h2>
            <p className={styles.text}>
              Press kit, product photography, and interview requests are
              available on request.
            </p>
            <div className={styles.links}>
              <a className={styles.link} href="mailto:press@yaepublishing.house">
                press@yaepublishing.house
              </a>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Follow</h2>
            <p className={styles.text}>
              Updates, drops, and behind-the-scenes on Instagram and X.
            </p>
            <div className={styles.links} style={{ display: 'flex', gap: '1.25rem' }}>
              <a
                className={styles.link}
                href="https://instagram.com/yaepublishing.house"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram &rarr;
              </a>
              <a
                className={styles.link}
                href="https://x.com/pci_yae"
                target="_blank"
                rel="noopener noreferrer"
              >
                X / Twitter &rarr;
              </a>
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
