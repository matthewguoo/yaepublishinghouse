import TripForm from '../TripForm';
import styles from '../../admin.module.css';

export default function NewTripPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>New trip</p>
            <h1 className={styles.title}>Log a journey</h1>
            <p className={styles.subtitle}>Round trips, one-ways, and relocations. Stack as many legs as you need for layovers.</p>
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.ghostButton} href="/admin/travels">Back</a>
          </div>
        </div>
        <TripForm mode="create" />
      </section>
    </main>
  );
}
