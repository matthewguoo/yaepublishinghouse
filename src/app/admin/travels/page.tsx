import Link from 'next/link';
import { prisma } from '@/lib/db';
import { deriveHome, type SerializedTrip } from '@/lib/trips';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminTravelsPage() {
  const trips = await prisma.trip.findMany({
    orderBy: { date: 'desc' },
    include: {
      toLegs: { orderBy: { order: 'asc' } },
      returnLegs: { orderBy: { order: 'asc' } },
    },
  });

  const serialized: SerializedTrip[] = trips.map((t) => ({
    id: t.id,
    tripType: t.tripType as SerializedTrip['tripType'],
    title: t.title,
    description: t.description,
    photos: t.photos,
    date: t.date.toISOString(),
    toLegs: t.toLegs.map((l) => ({
      id: l.id, type: l.type as 'flight' | 'car',
      originCode: l.originCode, originName: l.originName, originLat: l.originLat, originLng: l.originLng,
      destinationCode: l.destinationCode, destinationName: l.destinationName,
      destinationLat: l.destinationLat, destinationLng: l.destinationLng,
      date: l.date.toISOString(), flightNumber: l.flightNumber, order: l.order,
    })),
    returnLegs: t.returnLegs.map((l) => ({
      id: l.id, type: l.type as 'flight' | 'car',
      originCode: l.originCode, originName: l.originName, originLat: l.originLat, originLng: l.originLng,
      destinationCode: l.destinationCode, destinationName: l.destinationName,
      destinationLat: l.destinationLat, destinationLng: l.destinationLng,
      date: l.date.toISOString(), flightNumber: l.flightNumber, order: l.order,
    })),
  }));

  const home = deriveHome(serialized);
  const now = new Date();

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Webmaster console</p>
            <h1 className={styles.title}>Guuji&apos;s Travels</h1>
            <p className={styles.subtitle}>
              Current home base: <strong>{home ? `${home.code} · ${home.name}` : 'not set (log a relocation trip)'}</strong>
            </p>
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
              <th>Title</th>
              <th>Legs</th>
              <th>Status</th>
              <th>Photos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {serialized.map((trip) => {
              const allLegs = [...trip.toLegs, ...trip.returnLegs];
              const allPlanned = allLegs.every((l) => new Date(l.date) > now);
              const someReturnPlanned = trip.returnLegs.some((l) => new Date(l.date) > now);
              const status = allPlanned
                ? 'planned'
                : someReturnPlanned
                  ? 'return upcoming'
                  : 'completed';
              const route = allLegs.map((l) => `${l.originCode}→${l.destinationCode}`).join(' · ');
              return (
                <tr key={trip.id}>
                  <td>{trip.date.slice(0, 10)}</td>
                  <td>{trip.tripType}</td>
                  <td>{trip.title || <em>—</em>}</td>
                  <td><small>{route}</small></td>
                  <td>
                    <span className={styles.status}>{status}</span>
                    {trip.tripType === 'relocation' && <> <span className={styles.status}>home set</span></>}
                  </td>
                  <td>{trip.photos.length}</td>
                  <td><a className={styles.ghostButton} href={`/admin/travels/${trip.id}/edit`}>Edit</a></td>
                </tr>
              );
            })}
            {serialized.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>No trips yet. Add the first one ✦</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
