import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import TripForm from '../../TripForm';
import { deleteTrip, updateTrip } from '../../actions';
import styles from '../../../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) notFound();

  const update = updateTrip.bind(null, trip.id);
  const remove = deleteTrip.bind(null, trip.id);

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Editing trip</p>
            <h1 className={styles.title}>{trip.originCode} → {trip.destinationCode}</h1>
            <p className={styles.subtitle}>{trip.date.toISOString().slice(0, 10)} · {trip.type}</p>
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.ghostButton} href="/travels">View map</a>
            <a className={styles.ghostButton} href="/admin/travels">Back</a>
          </div>
        </div>
        <TripForm
          defaults={{
            ...trip,
            date: trip.date.toISOString(),
            title: trip.title,
            description: trip.description,
          }}
          action={update}
          deleteAction={remove}
        />
      </section>
    </main>
  );
}
