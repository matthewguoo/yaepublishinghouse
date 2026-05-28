// Seed starter trips for /travels.
// Run: node prisma/seed-trips.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRIPS = [
  {
    tripType: 'relocation',
    title: 'NC to the Bay',
    description: 'Said bye to NC. One-way ticket, two suitcases, no return plan. New home base unlocked.',
    photos: [],
    date: new Date('2025-07-12'),
    toLegs: {
      create: [
        {
          type: 'flight',
          originCode: 'RDU', originName: 'Raleigh-Durham, NC',
          originLat: 35.8801, originLng: -78.788,
          destinationCode: 'SFO', destinationName: 'San Francisco, CA',
          destinationLat: 37.6213, destinationLng: -122.379,
          date: new Date('2025-07-12'),
          flightNumber: null,
          order: 0,
        },
      ],
    },
  },
  {
    tripType: 'roundtrip',
    title: 'Scouting Bellevue',
    description: 'Quick weekend up to Seattle to scout the Bellevue/Kirkland life.',
    photos: [],
    date: new Date('2025-08-04'),
    toLegs: {
      create: [{
        type: 'flight',
        originCode: 'SFO', originName: 'San Francisco, CA',
        originLat: 37.6213, originLng: -122.379,
        destinationCode: 'SEA', destinationName: 'Seattle, WA',
        destinationLat: 47.4502, destinationLng: -122.3088,
        date: new Date('2025-08-04'), flightNumber: null, order: 0,
      }],
    },
    returnLegs: {
      create: [{
        type: 'flight',
        originCode: 'SEA', originName: 'Seattle, WA',
        originLat: 47.4502, originLng: -122.3088,
        destinationCode: 'SFO', destinationName: 'San Francisco, CA',
        destinationLat: 37.6213, destinationLng: -122.379,
        date: new Date('2025-08-06'), flightNumber: null, order: 0,
      }],
    },
  },
  {
    tripType: 'roundtrip',
    title: 'FanimeCon',
    description: 'Short drive down to FanimeCon. Met Emi Lo, basically peaked.',
    photos: [],
    date: new Date('2026-05-23'),
    toLegs: {
      create: [{
        type: 'car',
        originCode: 'MV', originName: 'Mountain View, CA',
        originLat: 37.3861, originLng: -122.0839,
        destinationCode: 'SJ', destinationName: 'San Jose, CA',
        destinationLat: 37.3382, destinationLng: -121.8863,
        date: new Date('2026-05-23'), flightNumber: null, order: 0,
      }],
    },
    returnLegs: {
      create: [{
        type: 'car',
        originCode: 'SJ', originName: 'San Jose, CA',
        originLat: 37.3382, originLng: -121.8863,
        destinationCode: 'MV', destinationName: 'Mountain View, CA',
        destinationLat: 37.3861, destinationLng: -122.0839,
        date: new Date('2026-05-25'), flightNumber: null, order: 0,
      }],
    },
  },
  {
    tripType: 'roundtrip',
    title: 'AX 2026',
    description: 'Anime Expo with Yoko Takahashi at Crypto.com Arena. Planned.',
    photos: [],
    date: new Date('2026-07-02'),
    toLegs: {
      create: [{
        type: 'flight',
        originCode: 'SFO', originName: 'San Francisco, CA',
        originLat: 37.6213, originLng: -122.379,
        destinationCode: 'LAX', destinationName: 'Los Angeles, CA',
        destinationLat: 33.9416, destinationLng: -118.4085,
        date: new Date('2026-07-02'), flightNumber: null, order: 0,
      }],
    },
    returnLegs: {
      create: [{
        type: 'flight',
        originCode: 'LAX', originName: 'Los Angeles, CA',
        originLat: 33.9416, originLng: -118.4085,
        destinationCode: 'SFO', destinationName: 'San Francisco, CA',
        destinationLat: 37.6213, destinationLng: -122.379,
        date: new Date('2026-07-06'), flightNumber: null, order: 0,
      }],
    },
  },
  {
    tripType: 'roundtrip',
    title: 'NC family visit (layover example)',
    description: 'SFO → IAH → RDU with a Houston layover, straight flight back.',
    photos: [],
    date: new Date('2026-06-13'),
    toLegs: {
      create: [
        {
          type: 'flight',
          originCode: 'SFO', originName: 'San Francisco, CA',
          originLat: 37.6213, originLng: -122.379,
          destinationCode: 'IAH', destinationName: 'Houston, TX',
          destinationLat: 29.9902, destinationLng: -95.3368,
          date: new Date('2026-06-13'), flightNumber: 'UA 1234', order: 0,
        },
        {
          type: 'flight',
          originCode: 'IAH', originName: 'Houston, TX',
          originLat: 29.9902, originLng: -95.3368,
          destinationCode: 'RDU', destinationName: 'Raleigh-Durham, NC',
          destinationLat: 35.8801, destinationLng: -78.788,
          date: new Date('2026-06-13'), flightNumber: 'UA 5678', order: 1,
        },
      ],
    },
    returnLegs: {
      create: [{
        type: 'flight',
        originCode: 'RDU', originName: 'Raleigh-Durham, NC',
        originLat: 35.8801, originLng: -78.788,
        destinationCode: 'SFO', destinationName: 'San Francisco, CA',
        destinationLat: 37.6213, destinationLng: -122.379,
        date: new Date('2026-06-22'), flightNumber: 'UA 9012', order: 0,
      }],
    },
  },
];

async function main() {
  for (const t of TRIPS) {
    await prisma.trip.create({ data: t });
    console.log(`+ ${t.title}  (${t.date.toISOString().slice(0, 10)}, ${t.tripType})`);
  }
  const count = await prisma.trip.count();
  console.log(`\n${count} total trips in db.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
