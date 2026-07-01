'use client';

import { useState } from 'react';
import Image from 'next/image';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

export default function TicketPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong');
        setLoading(false);
      }
    } catch {
      setError('Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className={styles.banner}>
        <Image src="/komaniya-logo.png" alt="" width={24} height={24} />
        <span>All Yae Publishing House products ship for free — courtesy of Komaniya Express</span>
      </div>

      <div className={styles.container}>
        <div className={styles.imageWrap}>
          <Image
            src="/nameless-pass-fixed.png"
            alt="Star Rail Special Pass Keychain"
            width={600}
            height={400}
            priority
            className={styles.productImage}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.left}>
            <h1 className={styles.title}>Star Rail Special Pass Keychain</h1>
            <p className={styles.subtitle}>24k Gold Plated First Edition</p>
            <p className={styles.price}>US$15.00</p>
            <p className={styles.description}>Limited edition gold-plated collectible</p>

            <div className={styles.specs}>
              <p className={styles.specsTitle}>SPECIFICATIONS</p>
              <p className={styles.spec}>.999 24k Gold Plating</p>
              <p className={styles.spec}>Ceramic anti-fingerprint coat</p>
              <p className={styles.spec}>Light fiberglass base</p>
            </div>

            <p className={styles.serial}>Serial numbers 0001-2158</p>
          </div>

          <div className={styles.right}>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={styles.buyButton}
            >
              {loading ? '...' : 'Buy Now'}
            </button>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.timeline}>
              <p className={styles.timelineTitle}>TIMELINE</p>
              
              <div className={styles.timelineItem}>
                <span className={`${styles.dot} ${styles.dotActive}`} />
                <div>
                  <p className={styles.timelineLabel}>Order Period</p>
                  <p className={styles.timelineValue}>Jun 1 – Jun 15</p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <span className={styles.dot} />
                <div>
                  <p className={styles.timelineLabel}>Manufacturing</p>
                  <p className={styles.timelineValue}>Late June</p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <span className={styles.dot} />
                <div>
                  <p className={styles.timelineLabel}>Ships from US</p>
                  <p className={styles.timelineValue}>Early July</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
