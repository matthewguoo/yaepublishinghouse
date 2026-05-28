'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildArc, deriveHome, type SerializedTrip, type SerializedLeg } from '@/lib/trips';
import styles from './TravelMap.module.css';

export type Trip = SerializedTrip;

type Place = {
  key: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  isHome: boolean;
  hasPlanned: boolean;
  hasCompleted: boolean;
};

type DrawableLeg = {
  trip: Trip;
  leg: SerializedLeg;
  branch: 'to' | 'return';
  planned: boolean;
};

function placeKey(code: string, lat: number, lng: number) {
  return `${code}|${lat.toFixed(3)}|${lng.toFixed(3)}`;
}

function isPlanned(dateISO: string, now: Date) {
  return new Date(dateISO) > now;
}

// Per-leg DivIcon factories. Built once on client.
function buildIcons() {
  if (typeof window === 'undefined') return null;
  const make = (variant: 'flight' | 'car' | 'home', planned: boolean) => {
    const glyph = variant === 'flight' ? '✈' : variant === 'car' ? '🚗' : '⌂';
    const cls = [
      'yae-pin-inner',
      `yae-pin-${variant}`,
      planned ? 'yae-pin-planned' : '',
    ].filter(Boolean).join(' ');
    return L.divIcon({
      className: 'yae-pin',
      html: `<div class="${cls}">${glyph}${planned ? '<span class="yae-pin-tag">soon</span>' : ''}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 34],
    });
  };
  return {
    flight: make('flight', false),
    flightPlanned: make('flight', true),
    car: make('car', false),
    carPlanned: make('car', true),
    home: make('home', false),
  };
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds.pad(0.25), { animate: false });
  }, [map, points]);
  return null;
}

export default function TravelMap({ trips }: { trips: Trip[] }) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const icons = useMemo(buildIcons, []);
  const now = useMemo(() => new Date(), []);

  const home = useMemo(() => deriveHome(trips, now), [trips, now]);

  const { drawables, places } = useMemo(() => {
    const drawables: DrawableLeg[] = [];
    const placeMap = new Map<string, Place>();

    const addPlace = (
      code: string,
      name: string,
      lat: number,
      lng: number,
      planned: boolean,
    ) => {
      const key = placeKey(code, lat, lng);
      const existing = placeMap.get(key);
      if (existing) {
        if (planned) existing.hasPlanned = true;
        else existing.hasCompleted = true;
        return;
      }
      placeMap.set(key, {
        key, code, name, lat, lng,
        isHome: false,
        hasPlanned: planned,
        hasCompleted: !planned,
      });
    };

    for (const t of trips) {
      for (const leg of t.toLegs) {
        const planned = isPlanned(leg.date, now);
        drawables.push({ trip: t, leg, branch: 'to', planned });
        addPlace(leg.originCode, leg.originName, leg.originLat, leg.originLng, planned);
        addPlace(leg.destinationCode, leg.destinationName, leg.destinationLat, leg.destinationLng, planned);
      }
      for (const leg of t.returnLegs) {
        const planned = isPlanned(leg.date, now);
        drawables.push({ trip: t, leg, branch: 'return', planned });
        addPlace(leg.originCode, leg.originName, leg.originLat, leg.originLng, planned);
        addPlace(leg.destinationCode, leg.destinationName, leg.destinationLat, leg.destinationLng, planned);
      }
    }

    if (home) {
      const homeKey = placeKey(home.code, home.lat, home.lng);
      const existing = placeMap.get(homeKey);
      if (existing) existing.isHome = true;
      else placeMap.set(homeKey, {
        key: homeKey, code: home.code, name: home.name, lat: home.lat, lng: home.lng,
        isHome: true, hasPlanned: false, hasCompleted: true,
      });
    }

    return { drawables, places: [...placeMap.values()] };
  }, [trips, now, home]);

  const allPoints = useMemo<[number, number][]>(
    () => places.map((p) => [p.lat, p.lng]),
    [places],
  );

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;

  const iconFor = (place: Place) => {
    if (!icons) return undefined;
    if (place.isHome) return icons.home;
    // pick flight/car based on whether any leg touching this place is a flight
    const touchedByFlight = drawables.some(
      (d) =>
        (placeKey(d.leg.originCode, d.leg.originLat, d.leg.originLng) === place.key ||
          placeKey(d.leg.destinationCode, d.leg.destinationLat, d.leg.destinationLng) === place.key) &&
        d.leg.type === 'flight',
    );
    const variant = touchedByFlight ? 'flight' : 'car';
    const allPlanned = place.hasPlanned && !place.hasCompleted;
    return variant === 'flight'
      ? (allPlanned ? icons.flightPlanned : icons.flight)
      : (allPlanned ? icons.carPlanned : icons.car);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.mapHolder}>
        <MapContainer
          center={home ? [home.lat, home.lng] : [37.5, -110]}
          zoom={3}
          scrollWheelZoom
          worldCopyJump
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FitBounds points={allPoints} />

          {drawables.map((d) => {
            const isSelected = selectedTripId === d.trip.id;
            const isFlight = d.leg.type === 'flight';
            const baseColor = d.branch === 'to' ? '#c41e3a' : '#5a8c8b';
            const path = isFlight
              ? buildArc(
                  [d.leg.originLat, d.leg.originLng],
                  [d.leg.destinationLat, d.leg.destinationLng],
                  64,
                  d.branch === 'return' ? -0.22 : 0.22,
                )
              : ([
                  [d.leg.originLat, d.leg.originLng],
                  [d.leg.destinationLat, d.leg.destinationLng],
                ] as [number, number][]);

            const dash = d.planned
              ? '2 8'                      // dotted for planned
              : !isFlight ? '6 8' : undefined; // dashed for cars
            return (
              <Polyline
                key={`${d.trip.id}-${d.branch}-${d.leg.id}`}
                positions={path}
                pathOptions={{
                  color: baseColor,
                  weight: isSelected ? 4 : 2.6,
                  opacity: d.planned ? 0.55 : (isSelected ? 1 : 0.85),
                  dashArray: dash,
                }}
                eventHandlers={{ click: () => setSelectedTripId(d.trip.id) }}
              />
            );
          })}

          {places.map((p) => (
            <Marker
              key={p.key}
              position={[p.lat, p.lng]}
              icon={iconFor(p) as L.DivIcon}
              eventHandlers={{
                click: () => {
                  // pick the most recent trip that touches this place
                  const touching = trips.find((t) =>
                    [...t.toLegs, ...t.returnLegs].some(
                      (leg) =>
                        placeKey(leg.originCode, leg.originLat, leg.originLng) === p.key ||
                        placeKey(leg.destinationCode, leg.destinationLat, leg.destinationLng) === p.key,
                    ),
                  );
                  if (touching) setSelectedTripId(touching.id);
                },
              }}
            />
          ))}
        </MapContainer>
        <div className={styles.washiTopLeft} aria-hidden />
        <div className={styles.washiBottomRight} aria-hidden />
        {home && (
          <div className={styles.homeBadge}>
            <span aria-hidden>⌂</span> home base: <strong>{home.code}</strong>
            <span className={styles.homeSince}> since {new Date(home.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      <aside className={styles.panel} aria-label="Trip details">
        {selectedTrip ? (
          <TripDetails trip={selectedTrip} now={now} onClose={() => setSelectedTripId(null)} />
        ) : (
          <EmptyHint count={trips.length} />
        )}
      </aside>

      <style jsx global>{`
        .yae-pin { background: transparent; border: none; }
        .yae-pin-inner {
          position: relative;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; line-height: 1;
          background: #fffaf3;
          border: 2px dashed #c41e3a;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.08);
          transform: rotate(-4deg);
          transition: transform 120ms ease;
        }
        .yae-pin-inner:hover { transform: rotate(0) scale(1.08); }
        .yae-pin-car { border-color: #5a8c8b; }
        .yae-pin-home {
          border-style: solid;
          border-color: #d4a017;
          background: #fff7d6;
          box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.18), 2px 2px 0 rgba(0,0,0,0.08);
          color: #8a6608;
        }
        .yae-pin-planned {
          background: repeating-linear-gradient(45deg, #fffaf3 0 4px, #f3e5d6 4px 8px);
          opacity: 0.85;
          border-style: dotted;
        }
        .yae-pin-tag {
          position: absolute;
          bottom: -10px; left: 50%;
          transform: translateX(-50%) rotate(2deg);
          background: #c41e3a; color: #fff;
          font-size: 9px; font-weight: 700;
          padding: 1px 6px; border-radius: 8px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          box-shadow: 1px 1px 0 rgba(0,0,0,0.15);
        }
        .leaflet-container { font-family: inherit; }
      `}</style>
    </div>
  );
}

function EmptyHint({ count }: { count: number }) {
  return (
    <div className={styles.empty}>
      <p className={styles.handwritten}>guuji&apos;s travels ✦</p>
      <p className={styles.emptySub}>
        {count > 0 ? 'pick a pin or a line to read the story' : 'no trips logged yet ~ come back soon'}
      </p>
      <div className={styles.legend}>
        <div><span className={styles.swatch} style={{ background: '#c41e3a' }} /> outbound</div>
        <div><span className={styles.swatch} style={{ background: '#5a8c8b' }} /> return</div>
        <div><span className={styles.swatch} style={{ background: 'repeating-linear-gradient(90deg,#888 0 3px,transparent 3px 7px)' }} /> planned</div>
        <div><span className={styles.swatch} style={{ background: '#d4a017' }} /> home base</div>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function TripDetails({ trip, now, onClose }: { trip: Trip; now: Date; onClose: () => void }) {
  const tripPlanned = [...trip.toLegs, ...trip.returnLegs].every((l) => isPlanned(l.date, now));
  const tripDoneSome = [...trip.toLegs, ...trip.returnLegs].some((l) => !isPlanned(l.date, now));

  return (
    <div className={styles.detail}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>
          {trip.tripType === 'roundtrip' ? 'round trip' : trip.tripType === 'relocation' ? 'relocation' : 'one way'}
        </span>
        {tripPlanned && <span className={styles.plannedTag}>planned</span>}
        {!tripPlanned && tripDoneSome && trip.returnLegs.some((l) => isPlanned(l.date, now)) && (
          <span className={styles.plannedTag}>return upcoming</span>
        )}
      </div>
      <h2 className={styles.routeTitle}>
        {trip.title || `${trip.toLegs[0]?.originCode || '?'} → ${trip.toLegs.at(-1)?.destinationCode || '?'}`}
      </h2>
      <p className={styles.routeSub}>
        {fmtDate(trip.date)}
        {trip.tripType === 'relocation' && <em> · new home base ✦</em>}
      </p>
      {trip.description && <p className={styles.tripDesc}>{trip.description}</p>}

      <LegList label="outbound" legs={trip.toLegs} now={now} />
      {trip.returnLegs.length > 0 && <LegList label="return" legs={trip.returnLegs} now={now} />}

      {trip.photos.length > 0 && (
        <div className={styles.photoStrip}>
          {trip.photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={trip.title || 'travel photo'}
              className={styles.polaroid}
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg)` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LegList({ label, legs, now }: { label: string; legs: SerializedLeg[]; now: Date }) {
  return (
    <div className={styles.legGroup}>
      <p className={styles.legGroupLabel}>{label}</p>
      <ol className={styles.legList}>
        {legs.map((leg) => {
          const planned = isPlanned(leg.date, now);
          return (
            <li key={leg.id} className={`${styles.legRow} ${planned ? styles.legPlanned : ''}`}>
              <span className={styles.legGlyph}>{leg.type === 'flight' ? '✈' : '🚗'}</span>
              <span className={styles.legRoute}>
                {leg.originCode} → {leg.destinationCode}
              </span>
              <span className={styles.legMeta}>
                {fmtDate(leg.date)}
                {leg.flightNumber && <> · {leg.flightNumber}</>}
              </span>
              {planned && <span className={styles.plannedDot}>planned</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
