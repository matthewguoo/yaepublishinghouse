'use client';

import SiteLayout from '@/components/SiteLayout';
import styles from '@/components/SiteLayout.module.css';

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className={styles.pageContainer}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; Contact
        </div>
        
        <article>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>Contact Us</h1>
            <div className={styles.articleMeta}>
              Inquiries regarding products, orders, and general questions
            </div>
          </header>

          <div className={styles.articleContent}>
            <h2>Customer Support</h2>
            <p>
              For inquiries regarding orders, shipping, returns, or product availability, 
              please contact our customer support team. We aim to respond within 1-2 business days.
            </p>

            <p><strong>Email:</strong> support@yaepublishing.house</p>
            <p><strong>Hours:</strong> Monday - Friday, 9:00 - 18:00 (Inazuma Standard Time)</p>

            <h2>Business Inquiries</h2>
            <p>
              For wholesale orders, collaboration proposals, or media inquiries, 
              please contact our business development team.
            </p>
            <p><strong>Email:</strong> business@yaepublishing.house</p>

            <h2>Main Store Location</h2>
            <p>
              Yae Publishing House Main Store<br />
              Narukami Island, Inazuma City<br />
              Near the Grand Narukami Shrine<br />
              Open daily from 10:00 - 20:00
            </p>

            <h2>Interastral Peace Corporation (IPC) Matters</h2>
            <p>
              For inquiries related to IPC-authorized products, including the Nameless Honor Pass 
              and other Astral Express commemorative items, please direct your communications 
              to our Earth operations division.
            </p>
            <p><strong>Email:</strong> ipc@xingjitech.corp</p>

            <blockquote>
              Please note that the Grand Narukami Shrine and Yae Publishing House are separate entities. 
              For shrine-related matters, please visit the shrine directly during business hours.
            </blockquote>

            <h2>Feedback</h2>
            <p>
              We value your feedback on our products and services. 
              If you have suggestions for new titles, merchandise, or improvements to our store, 
              please let us know. Lady Yae Miko personally reviews select customer feedback.
            </p>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
