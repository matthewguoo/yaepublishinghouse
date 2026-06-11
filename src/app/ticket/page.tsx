import SiteLayout from '@/components/SiteLayout';
import styles from './page.module.css';

export const metadata = {
  title: 'Giveaway | Yae Publishing House',
  description: 'Win a $250 Honkai: Star Rail merch bundle',
};

export default function TicketPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>Limited Time Giveaway</p>
          <h1 className={styles.title}>Win Big</h1>
          <p className={styles.subtitle}>a curated collection of official merch</p>
          
          <div className={styles.prize}>
            <p className={styles.prizeValue}>$250 HSR Bundle</p>
            <p className={styles.prizeDetails}>
              Official Honkai: Star Rail merchandise including plushies, keyboard, keychain, and figures
            </p>
          </div>

          <div className={styles.divider} />

          <p className={styles.instructions}>
            Follow and share on Instagram for a chance to win
          </p>

          <a 
            href="https://instagram.com/yaepublishing.house" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.cta}
          >
            @yaepublishing.house
          </a>

          <p className={styles.footer}>
            Winner announced on Instagram
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
