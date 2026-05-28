'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildArc } from '@/lib/trips';
import styles from './TravelMap.module.css';

export type Trip = {
  id: string;
  type: string;
  originCode: string;
  originName: string;
  originLat: number;
  originLng: number;
  destinationCode: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  date: string;
  title: string | null;
  description: string | null;
  photos: string[];
};

type Place = {
  key: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  type: 'flight' | 'car';
};

type Route = {
  key: string;
  type: 'flight' | 'car';
  from: Place;
  to: Place;
  trips: Trip[];
};

function placeKey(code: string, lat: number, lng: number) {
  return `${code}|${lat.toFixed(3)}|${lng.toFixed(3)}`;
}

function routeKey(a: string, b: string, type: string) {
  return [a, b].sort().join('↔') + '|' + type;
}

const FLIGHT_ICON = typeof window === 'undefined' ? null : L.divIcon({
  className: 'yae-pin',
  html: '<div class="yae-pin-inner yae-pin-flight">✈</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
});

const CAR_ICON = typeof window === 'undefined' ? null : L.divIcon({
  className: 'yae-pin',
  html: '<div class="yae-pin-inner yae-pin-car">🚗</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
});

function FitBounds({ places }: { places: Place[] }) {
  const map = useMap();
  useEffect(() => {
    if (!places.length) return;
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.25), { animate: false });
  }, [map, places]);
  return null;
}

export default function TravelMap({ trips }: { trips: Trip[] }) {
  const [selected, setSelected] = useState<Route | null>(null);

  const { places, routes } = useMemo(() => {
    const placeMap = new Map<string, Place>();
    const routeMap = new Map<string, Route>();
    for (const t of trips) {
      const type = (t.type === 'car' ? 'car' : 'flight') as 'flight' | 'car';
      const from: Place = {
        key: placeKey(t.originCode, t.originLat, t.originLng),
        code: t.originCode,
        name: t.originName,
        lat: t.originLat,
        lng: t.originLng,
        type,
      };
      const to: Place = {
        key: placeKey(t.destinationCode, t.destinationLat, t.destinationLng),
        code: t.destinationCode,
        name: t.destinationName,
        lat: t.destinationLat,
        lng: t.destinationLng,
        type,
      };
      if (!placeMap.has(from.key)) placeMap.set(from.key, from);
      if (!placeMap.has(to.key)) placeMap.set(to.key, to);
      const rk = routeKey(from.key, to.key, type);
      const existing = routeMap.get(rk);
      if (existing) existing.trips.push(t);
      else routeMap.set(rk, { key: rk, type, from, to, trips: [t] });
    }
    return { places: [...placeMap.values()], routes: [...routeMap.values()] };
  }, [trips]);

  return (
    <div className={styles.wrap}>
      <div className={styles.mapHolder}>
        <MapContainer
          center={[37.5, -110]}
          zoom={3}
          scrollWheelZoom
          worldCopyJump
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FitBounds places={places} />
          {routes.map((r) => {
            const isSelected = selected?.key === r.key;
            const path = r.type === 'flight'
              ? buildArc([r.from.lat, r.from.lng], [r.to.lat, r.to.lng], 64, 0.22)
              : [[r.from.lat, r.from.lng], [r.to.lat, r.to.lng]] as [number, number][];
            return (
              <Polyline
                key={r.key}
                positions={path}
                pathOptions={{
                  color: r.type === 'flight' ? '#c41e3a' : '#8b5a8c',
                  weight: isSelected ? 4 : 2.5,
                  opacity: isSelected ? 1 : 0.75,
                  dashArray: r.type === 'car' ? '6 8' : undefined,
                }}
                eventHandlers={{ click: () => setSelected(r) }}
              />
            );
          })}
          {places.map((p) => (
            <Marker
              key={p.key}
              position={[p.lat, p.lng]}
              icon={(p.type === 'flight' ? FLIGHT_ICON : CAR_ICON) as L.DivIcon}
              eventHandlers={{
                click: () => {
                  const r = routes.find((rr) => rr.from.key === p.key || rr.to.key === p.key);
                  if (r) setSelected(r);
                },
              }}
            />
          ))}
        </MapContainer>
        <div className={styles.washiTopLeft} aria-hidden />
        <div className={styles.washiBottomRight} aria-hidden />
      </div>

      <aside className={styles.panel} aria-label="Trip details">
        {selected ? (
          <RouteDetails route={selected} onClose={() => setSelected(null)} />
        ) : (
          <EmptyHint count={trips.length} />
        )}
      </aside>

      <style jsx global>{`
        .yae-pin { background: transparent; border: none; }
        .yae-pin-inner {
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
        .yae-pin-car { border-color: #8b5a8c; }
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
        {count > 0
          ? 'pick a pin or a line to read the story'
          : 'no trips logged yet ~ come back soon'}
      </p>
      <div className={styles.legend}>
        <span className={styles.legendFlight}>✈ flights</span>
        <span className={styles.legendCar}>🚗 road trips</span>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function RouteDetails({ route, onClose }: { route: Route; onClose: () => void }) {
  const sorted = [...route.trips].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <div className={styles.detail}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
      <p className={styles.eyebrow}>{route.type === 'flight' ? 'flight' : 'road trip'}</p>
      <h2 className={styles.routeTitle}>
        <span>{route.from.code}</span>
        <span className={styles.routeArrow}>{route.type === 'flight' ? '✈' : '↝'}</span>
        <span>{route.to.code}</span>
      </h2>
      <p className={styles.routeSub}>
        {route.from.name} <em>to</em> {route.to.name}
      </p>
      <ul className={styles.tripList}>
        {sorted.map((t) => (
          <li key={t.id} className={styles.tripCard}>
            <div className={styles.tripDate}>{fmtDate(t.date)}</div>
            {t.title && <div className={styles.tripTitle}>{t.title}</div>}
            {t.description && <p className={styles.tripDesc}>{t.description}</p>}
            {t.photos.length > 0 && (
              <div className={styles.photoStrip}>
                {t.photos.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={t.title || 'travel photo'}
                    className={styles.polaroid}
                    style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg)` }}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
