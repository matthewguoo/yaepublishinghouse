import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

export default function CheckoutSuccessPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.title}>Order Confirmed</h1>
          <p className={styles.message}>
            Thank you for your purchase! You will receive an email confirmation shortly.
          </p>
          <p className={styles.note}>
            All Yae Publishing House products ship for free within the US and Canada.
          </p>
          <div className={styles.actions}>
            <Link href="/products" className={styles.button}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
