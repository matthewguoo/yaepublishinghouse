export type LegInput = {
  type: 'flight' | 'car';
  originCode: string;
  originName: string;
  originLat: number;
  originLng: number;
  destinationCode: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  date: Date;
  flightNumber: string | null;
  order: number;
};

export type TripInput = {
  tripType: 'roundtrip' | 'oneway' | 'relocation';
  title: string | null;
  description: string | null;
  photos: string[];
  date: Date;
  toLegs: LegInput[];
  returnLegs: LegInput[];
};

function num(value: unknown, key: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`${key} must be a number`);
  return n;
}

function str(value: unknown, key: string): string {
  const s = String(value ?? '').trim();
  if (!s) throw new Error(`${key} is required`);
  return s;
}

function parseDate(value: unknown, key: string): Date {
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) throw new Error(`invalid ${key}`);
  return d;
}

export function normalizeLeg(raw: unknown, order: number): LegInput {
  const body = (raw ?? {}) as Record<string, unknown>;
  const type = String(body.type || 'flight');
  if (!['flight', 'car'].includes(type)) throw new Error('leg type must be flight or car');
  return {
    type: type as 'flight' | 'car',
    originCode: str(body.originCode, 'originCode'),
    originName: str(body.originName, 'originName'),
    originLat: num(body.originLat, 'originLat'),
    originLng: num(body.originLng, 'originLng'),
    destinationCode: str(body.destinationCode, 'destinationCode'),
    destinationName: str(body.destinationName, 'destinationName'),
    destinationLat: num(body.destinationLat, 'destinationLat'),
    destinationLng: num(body.destinationLng, 'destinationLng'),
    date: parseDate(body.date, 'leg date'),
    flightNumber: body.flightNumber ? String(body.flightNumber).trim() || null : null,
    order,
  };
}

export function normalizeTrip(body: Record<string, unknown>): TripInput {
  const tripType = String(body.tripType || 'roundtrip');
  if (!['roundtrip', 'oneway', 'relocation'].includes(tripType)) {
    throw new Error('tripType must be roundtrip, oneway, or relocation');
  }

  const toLegsRaw = Array.isArray(body.toLegs) ? body.toLegs : [];
  const returnLegsRaw = Array.isArray(body.returnLegs) ? body.returnLegs : [];
  const toLegs = toLegsRaw.map((leg, i) => normalizeLeg(leg, i));
  const returnLegs = returnLegsRaw.map((leg, i) => normalizeLeg(leg, i));

  if (toLegs.length === 0) throw new Error('trip needs at least one outbound leg');
  if (tripType === 'roundtrip' && returnLegs.length === 0) {
    throw new Error('roundtrip needs at least one return leg');
  }
  if ((tripType === 'oneway' || tripType === 'relocation') && returnLegs.length > 0) {
    throw new Error(`${tripType} cannot have return legs`);
  }

  const photos = Array.isArray(body.photos)
    ? body.photos.map((p) => String(p).trim()).filter(Boolean)
    : typeof body.photos === 'string'
      ? String(body.photos).split(/[\n,]+/).map((p) => p.trim()).filter(Boolean)
      : [];

  // overall trip date: explicit field, else earliest outbound leg
  let date: Date;
  if (body.date) {
    date = parseDate(body.date, 'date');
  } else {
    date = toLegs.reduce<Date>((min, leg) => (leg.date < min ? leg.date : min), toLegs[0].date);
  }

  return {
    tripType: tripType as TripInput['tripType'],
    title: body.title ? String(body.title).trim() || null : null,
    description: body.description ? String(body.description).trim() || null : null,
    photos,
    date,
    toLegs,
    returnLegs,
  };
}

// Build a curved arc between two lat/lng points as a polyline of [lat,lng] tuples.
export function buildArc(
  a: [number, number],
  b: [number, number],
  segments = 64,
  curvature = 0.25,
): [number, number][] {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const dx = lng2 - lng1;
  const dy = lat2 - lat1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const offset = len * curvature;
  const cLat = midLat + py * offset;
  const cLng = midLng + px * offset;
  const out: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const u = 1 - t;
    const lat = u * u * lat1 + 2 * u * t * cLat + t * t * lat2;
    const lng = u * u * lng1 + 2 * u * t * cLng + t * t * lng2;
    out.push([lat, lng]);
  }
  return out;
}

// Public-facing serialized shapes
export type SerializedLeg = Omit<LegInput, 'date'> & { id: string; date: string };
export type SerializedTrip = {
  id: string;
  tripType: TripInput['tripType'];
  title: string | null;
  description: string | null;
  photos: string[];
  date: string;
  toLegs: SerializedLeg[];
  returnLegs: SerializedLeg[];
};

// Derive current "home" by replaying relocation trips chronologically.
// Returns home as of `asOf` (default now). Falls back to null if no relocations exist.
export type HomePlace = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  since: string; // ISO
};

export function deriveHome(trips: SerializedTrip[], asOf: Date = new Date()): HomePlace | null {
  const relocations = trips
    .filter((t) => t.tripType === 'relocation' && t.toLegs.length > 0)
    .filter((t) => new Date(t.date) <= asOf)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  if (relocations.length === 0) return null;
  const last = relocations[relocations.length - 1];
  const finalLeg = last.toLegs[last.toLegs.length - 1];
  return {
    code: finalLeg.destinationCode,
    name: finalLeg.destinationName,
    lat: finalLeg.destinationLat,
    lng: finalLeg.destinationLng,
    since: last.date,
  };
}
