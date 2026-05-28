export type TripInput = {
  type: string;
  originCode: string;
  originName: string;
  originLat: number;
  originLng: number;
  destinationCode: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  date: Date;
  title: string | null;
  description: string | null;
  photos: string[];
};

export function normalizeTrip(body: Record<string, unknown>): TripInput {
  const type = String(body.type || 'flight');
  if (!['flight', 'car'].includes(type)) throw new Error('type must be flight or car');
  const date = new Date(String(body.date));
  if (Number.isNaN(date.getTime())) throw new Error('invalid date');
  const num = (k: string) => {
    const n = Number(body[k]);
    if (!Number.isFinite(n)) throw new Error(`${k} must be a number`);
    return n;
  };
  const str = (k: string) => {
    const s = String(body[k] || '').trim();
    if (!s) throw new Error(`${k} is required`);
    return s;
  };
  const photos = Array.isArray(body.photos)
    ? body.photos.map((p) => String(p).trim()).filter(Boolean)
    : typeof body.photos === 'string'
      ? String(body.photos).split(/[\n,]+/).map((p) => p.trim()).filter(Boolean)
      : [];

  return {
    type,
    originCode: str('originCode'),
    originName: str('originName'),
    originLat: num('originLat'),
    originLng: num('originLng'),
    destinationCode: str('destinationCode'),
    destinationName: str('destinationName'),
    destinationLat: num('destinationLat'),
    destinationLng: num('destinationLng'),
    date,
    title: body.title ? String(body.title).trim() || null : null,
    description: body.description ? String(body.description).trim() || null : null,
    photos,
  };
}

// Build a curved arc between two lat/lng points as a polyline of [lat,lng] tuples.
// Uses a quadratic Bezier with a midpoint offset perpendicular to the great-circle line.
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
  // perpendicular offset
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
