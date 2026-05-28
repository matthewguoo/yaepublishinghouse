import Link from 'next/link';
import { prisma } from '@/lib/db';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminTravelsPage() {
  const trips = await prisma.trip.findMany({ orderBy: { date: 'desc' } });

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Webmaster console</p>
            <h1 className={styles.title}>Guuji&apos;s Travels</h1>
            <p className={styles.subtitle}>Log flights and road trips. They appear on /travels instantly.</p>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.ghostButton} href="/travels">View map</Link>
            <Link className={styles.ghostButton} href="/admin/articles">Articles</Link>
            <Link className={styles.button} href="/admin/travels/new">New trip</Link>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Route</th>
              <th>Title</th>
              <th>Photos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.date.toISOString().slice(0, 10)}</td>
                <td>{trip.type === 'flight' ? '✈ flight' : '🚗 car'}</td>
                <td>
                  <strong>{trip.originCode} → {trip.destinationCode}</strong><br />
                  <small>{trip.originName} to {trip.destinationName}</small>
                </td>
                <td>{trip.title || <em>—</em>}</td>
                <td>{trip.photos.length}</td>
                <td><a className={styles.ghostButton} href={`/admin/travels/${trip.id}/edit`}>Edit</a></td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>No trips yet. Add the first one ✦</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
