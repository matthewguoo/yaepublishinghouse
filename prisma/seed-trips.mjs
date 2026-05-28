// Seed a few starter trips for /travels.
// Run: node prisma/seed-trips.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRIPS = [
  {
    type: 'flight',
    originCode: 'RDU',
    originName: 'Raleigh-Durham, NC',
    originLat: 35.8801,
    originLng: -78.788,
    destinationCode: 'SFO',
    destinationName: 'San Francisco, CA',
    destinationLat: 37.6213,
    destinationLng: -122.379,
    date: new Date('2025-07-12'),
    title: 'NC to the Bay',
    description: 'Said bye to NC. One-way ticket, two suitcases, no return plan.',
    photos: [],
  },
  {
    type: 'flight',
    originCode: 'SFO',
    originName: 'San Francisco, CA',
    originLat: 37.6213,
    originLng: -122.379,
    destinationCode: 'SEA',
    destinationName: 'Seattle, WA',
    destinationLat: 47.4502,
    destinationLng: -122.3088,
    date: new Date('2025-08-04'),
    title: 'Scouting Bellevue',
    description: 'Quick weekend up to Seattle to scout the Bellevue/Kirkland life.',
    photos: [],
  },
  {
    type: 'car',
    originCode: 'MV',
    originName: 'Mountain View, CA',
    originLat: 37.3861,
    originLng: -122.0839,
    destinationCode: 'SJ',
    destinationName: 'San Jose, CA',
    destinationLat: 37.3382,
    destinationLng: -121.8863,
    date: new Date('2026-05-23'),
    title: 'FanimeCon road trip',
    description: 'Short drive down to FanimeCon. Met Emi Lo, basically peaked.',
    photos: [],
  },
];

async function main() {
  for (const t of TRIPS) {
    await prisma.trip.create({ data: t });
    console.log(`+ ${t.originCode} → ${t.destinationCode}  (${t.date.toISOString().slice(0, 10)})`);
  }
  const count = await prisma.trip.count();
  console.log(`\n${count} total trips in db.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
