import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import TripForm from '../../TripForm';
import styles from '../../../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      toLegs: { orderBy: { order: 'asc' } },
      returnLegs: { orderBy: { order: 'asc' } },
    },
  });
  if (!trip) notFound();

  const defaults = {
    id: trip.id,
    tripType: trip.tripType,
    title: trip.title,
    description: trip.description,
    photos: trip.photos,
    date: trip.date.toISOString(),
    toLegs: trip.toLegs.map((l) => ({
      type: (l.type === 'car' ? 'car' : 'flight') as 'flight' | 'car',
      originCode: l.originCode, originName: l.originName,
      originLat: l.originLat, originLng: l.originLng,
      destinationCode: l.destinationCode, destinationName: l.destinationName,
      destinationLat: l.destinationLat, destinationLng: l.destinationLng,
      date: l.date.toISOString(), flightNumber: l.flightNumber || '',
    })),
    returnLegs: trip.returnLegs.map((l) => ({
      type: (l.type === 'car' ? 'car' : 'flight') as 'flight' | 'car',
      originCode: l.originCode, originName: l.originName,
      originLat: l.originLat, originLng: l.originLng,
      destinationCode: l.destinationCode, destinationName: l.destinationName,
      destinationLat: l.destinationLat, destinationLng: l.destinationLng,
      date: l.date.toISOString(), flightNumber: l.flightNumber || '',
    })),
  };

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Editing trip</p>
            <h1 className={styles.title}>{trip.title || `${trip.toLegs[0]?.originCode || '?'} → ${trip.toLegs.at(-1)?.destinationCode || '?'}`}</h1>
            <p className={styles.subtitle}>{trip.date.toISOString().slice(0, 10)} · {trip.tripType}</p>
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.ghostButton} href="/travels">View map</a>
            <a className={styles.ghostButton} href="/admin/travels">Back</a>
          </div>
        </div>
        <TripForm mode="edit" tripId={trip.id} defaults={defaults} />
      </section>
    </main>
  );
}
