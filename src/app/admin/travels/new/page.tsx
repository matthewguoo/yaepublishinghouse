import TripForm from '../TripForm';
import { createTrip } from '../actions';
import styles from '../../admin.module.css';

export default function NewTripPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>New trip</p>
            <h1 className={styles.title}>Log a flight or road trip</h1>
            <p className={styles.subtitle}>Add lat/lng manually or pick from the suggested airports.</p>
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.ghostButton} href="/admin/travels">Back</a>
          </div>
        </div>
        <TripForm action={createTrip} />
      </section>
    </main>
  );
}
