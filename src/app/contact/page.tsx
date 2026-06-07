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
              For questions about orders, products, or general support, reach out via email.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Business & Partnerships</h2>
            <p className={styles.text}>
              For collaboration, wholesale, or partnership inquiries, please include details about your proposal.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Press & Media</h2>
            <p className={styles.text}>
              Media kit and press materials available upon request.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
