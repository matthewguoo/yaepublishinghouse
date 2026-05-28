'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import formStyles from '../admin.module.css';

type Place = { code: string; name: string; lat: number; lng: number };

const PLACES: Place[] = [
  { code: 'SFO', name: 'San Francisco, CA (SFO)', lat: 37.6213, lng: -122.379 },
  { code: 'SJC', name: 'San Jose, CA (SJC)', lat: 37.3639, lng: -121.929 },
  { code: 'OAK', name: 'Oakland, CA (OAK)', lat: 37.7126, lng: -122.2197 },
  { code: 'SEA', name: 'Seattle, WA (SEA)', lat: 47.4502, lng: -122.3088 },
  { code: 'PDX', name: 'Portland, OR (PDX)', lat: 45.5898, lng: -122.5951 },
  { code: 'LAX', name: 'Los Angeles, CA (LAX)', lat: 33.9416, lng: -118.4085 },
  { code: 'SAN', name: 'San Diego, CA (SAN)', lat: 32.7338, lng: -117.1933 },
  { code: 'LAS', name: 'Las Vegas, NV (LAS)', lat: 36.084, lng: -115.1537 },
  { code: 'DEN', name: 'Denver, CO (DEN)', lat: 39.8561, lng: -104.6737 },
  { code: 'ORD', name: 'Chicago, IL (ORD)', lat: 41.9742, lng: -87.9073 },
  { code: 'DFW', name: 'Dallas, TX (DFW)', lat: 32.8998, lng: -97.0403 },
  { code: 'IAH', name: 'Houston, TX (IAH)', lat: 29.9902, lng: -95.3368 },
  { code: 'ATL', name: 'Atlanta, GA (ATL)', lat: 33.6407, lng: -84.4277 },
  { code: 'MIA', name: 'Miami, FL (MIA)', lat: 25.7959, lng: -80.287 },
  { code: 'JFK', name: 'New York, NY (JFK)', lat: 40.6413, lng: -73.7781 },
  { code: 'LGA', name: 'New York, NY (LGA)', lat: 40.7769, lng: -73.874 },
  { code: 'EWR', name: 'Newark, NJ (EWR)', lat: 40.6895, lng: -74.1745 },
  { code: 'BOS', name: 'Boston, MA (BOS)', lat: 42.3656, lng: -71.0096 },
  { code: 'DCA', name: 'Washington, DC (DCA)', lat: 38.8512, lng: -77.0402 },
  { code: 'IAD', name: 'Washington, DC (IAD)', lat: 38.9531, lng: -77.4565 },
  { code: 'RDU', name: 'Raleigh-Durham, NC (RDU)', lat: 35.8801, lng: -78.7880 },
  { code: 'CLT', name: 'Charlotte, NC (CLT)', lat: 35.214, lng: -80.9431 },
  { code: 'HNL', name: 'Honolulu, HI (HNL)', lat: 21.3187, lng: -157.9225 },
  { code: 'YVR', name: 'Vancouver, BC (YVR)', lat: 49.1939, lng: -123.184 },
  { code: 'NRT', name: 'Tokyo Narita (NRT)', lat: 35.7647, lng: 140.3863 },
  { code: 'HND', name: 'Tokyo Haneda (HND)', lat: 35.5494, lng: 139.7798 },
  { code: 'KIX', name: 'Osaka Kansai (KIX)', lat: 34.4348, lng: 135.244 },
  { code: 'ICN', name: 'Seoul Incheon (ICN)', lat: 37.4602, lng: 126.4407 },
  { code: 'TPE', name: 'Taipei Taoyuan (TPE)', lat: 25.0797, lng: 121.2342 },
  { code: 'HKG', name: 'Hong Kong (HKG)', lat: 22.308, lng: 113.9185 },
  { code: 'PVG', name: 'Shanghai Pudong (PVG)', lat: 31.1443, lng: 121.8083 },
  { code: 'PEK', name: 'Beijing Capital (PEK)', lat: 40.0801, lng: 116.5846 },
  { code: 'MV',  name: 'Mountain View, CA', lat: 37.3861, lng: -122.0839 },
  { code: 'SJ',  name: 'San Jose, CA', lat: 37.3382, lng: -121.8863 },
  { code: 'SF',  name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { code: 'BERK', name: 'Berkeley, CA', lat: 37.8716, lng: -122.273 },
  { code: 'PALY', name: 'Palo Alto, CA', lat: 37.4419, lng: -122.143 },
  { code: 'DURM', name: 'Durham, NC', lat: 35.994, lng: -78.8986 },
];

type LegState = {
  type: 'flight' | 'car';
  originCode: string;
  originName: string;
  originLat: string;
  originLng: string;
  destinationCode: string;
  destinationName: string;
  destinationLat: string;
  destinationLng: string;
  date: string;
  flightNumber: string;
};

function emptyLeg(type: 'flight' | 'car' = 'flight'): LegState {
  return {
    type,
    originCode: '', originName: '',
    originLat: '', originLng: '',
    destinationCode: '', destinationName: '',
    destinationLat: '', destinationLng: '',
    date: '',
    flightNumber: '',
  };
}

export type TripDefaults = {
  id?: string;
  tripType?: string;
  title?: string | null;
  description?: string | null;
  photos?: string[];
  date?: string;
  toLegs?: LegDefault[];
  returnLegs?: LegDefault[];
};

type LegDefault = {
  type?: string;
  originCode?: string;
  originName?: string;
  originLat?: number | string;
  originLng?: number | string;
  destinationCode?: string;
  destinationName?: string;
  destinationLat?: number | string;
  destinationLng?: number | string;
  date?: string;
  flightNumber?: string | null;
};

function legFromDefault(d: LegDefault): LegState {
  return {
    type: (d.type === 'car' ? 'car' : 'flight'),
    originCode: String(d.originCode || ''),
    originName: String(d.originName || ''),
    originLat: String(d.originLat ?? ''),
    originLng: String(d.originLng ?? ''),
    destinationCode: String(d.destinationCode || ''),
    destinationName: String(d.destinationName || ''),
    destinationLat: String(d.destinationLat ?? ''),
    destinationLng: String(d.destinationLng ?? ''),
    date: d.date ? new Date(d.date).toISOString().slice(0, 10) : '',
    flightNumber: String(d.flightNumber || ''),
  };
}

type Side = 'origin' | 'destination';

function PlaceFields({
  side,
  leg,
  update,
}: {
  side: Side;
  leg: LegState;
  update: (patch: Partial<LegState>) => void;
}) {
  const codeKey = `${side}Code` as const;
  const nameKey = `${side}Name` as const;
  const latKey = `${side}Lat` as const;
  const lngKey = `${side}Lng` as const;

  function applyPick(value: string) {
    const match = PLACES.find((p) => p.name === value || p.code === value);
    if (match) {
      update({
        [codeKey]: match.code,
        [nameKey]: match.name,
        [latKey]: String(match.lat),
        [lngKey]: String(match.lng),
      } as Partial<LegState>);
    } else {
      update({ [nameKey]: value } as Partial<LegState>);
    }
  }

  const listId = `places-${side}-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div style={{ border: '1px dashed #d6c9aa', padding: 10, borderRadius: 4 }}>
      <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b5a8c', margin: '0 0 6px' }}>
        {side === 'origin' ? 'From' : 'To'}
      </p>
      <label className={formStyles.field}>
        Place
        <input
          list={listId}
          value={leg[nameKey]}
          onChange={(e) => applyPick(e.target.value)}
          placeholder="e.g. San Francisco, CA (SFO)"
        />
        <datalist id={listId}>
          {PLACES.map((p) => <option key={p.code + p.name} value={p.name} />)}
        </datalist>
      </label>
      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Code
          <input value={leg[codeKey]} onChange={(e) => update({ [codeKey]: e.target.value } as Partial<LegState>)} required />
        </label>
        <label className={formStyles.field}>
          Lat
          <input type="number" step="any" value={leg[latKey]} onChange={(e) => update({ [latKey]: e.target.value } as Partial<LegState>)} required />
        </label>
        <label className={formStyles.field}>
          Lng
          <input type="number" step="any" value={leg[lngKey]} onChange={(e) => update({ [lngKey]: e.target.value } as Partial<LegState>)} required />
        </label>
      </div>
    </div>
  );
}

function LegEditor({
  index, leg, onChange, onRemove,
}: { index: number; leg: LegState; onChange: (l: LegState) => void; onRemove: () => void }) {
  const update = (patch: Partial<LegState>) => onChange({ ...leg, ...patch });
  return (
    <div style={{ border: '2px dashed #c9b58a', padding: 12, borderRadius: 6, marginBottom: 12, background: '#fffaf3' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong style={{ color: '#5a3d5a' }}>Leg {index + 1}</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ fontSize: 12 }}>
            <input type="radio" checked={leg.type === 'flight'} onChange={() => update({ type: 'flight' })} /> ✈ flight
          </label>
          <label style={{ fontSize: 12 }}>
            <input type="radio" checked={leg.type === 'car'} onChange={() => update({ type: 'car' })} /> 🚗 car
          </label>
          <button type="button" className={formStyles.dangerButton} onClick={onRemove} style={{ padding: '4px 10px', fontSize: 12 }}>Remove</button>
        </div>
      </div>
      <div className={formStyles.grid}>
        <PlaceFields side="origin" leg={leg} update={update} />
        <PlaceFields side="destination" leg={leg} update={update} />
      </div>
      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Date
          <input type="date" value={leg.date} onChange={(e) => update({ date: e.target.value })} required />
        </label>
        {leg.type === 'flight' && (
          <label className={formStyles.field}>
            Flight # (optional)
            <input value={leg.flightNumber} onChange={(e) => update({ flightNumber: e.target.value })} placeholder="UA 1234" />
          </label>
        )}
      </div>
    </div>
  );
}

type Props = {
  defaults?: TripDefaults;
  mode: 'create' | 'edit';
  tripId?: string;
};

export default function TripForm({ defaults, mode, tripId }: Props) {
  const router = useRouter();
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway' | 'relocation'>(
    (defaults?.tripType as 'roundtrip' | 'oneway' | 'relocation') || 'roundtrip',
  );
  const [title, setTitle] = useState(defaults?.title || '');
  const [description, setDescription] = useState(defaults?.description || '');
  const [photosText, setPhotosText] = useState((defaults?.photos || []).join('\n'));
  const [overallDate, setOverallDate] = useState(
    defaults?.date ? new Date(defaults.date).toISOString().slice(0, 10) : '',
  );
  const [toLegs, setToLegs] = useState<LegState[]>(
    defaults?.toLegs?.length ? defaults.toLegs.map(legFromDefault) : [emptyLeg('flight')],
  );
  const [returnLegs, setReturnLegs] = useState<LegState[]>(
    defaults?.returnLegs?.length ? defaults.returnLegs.map(legFromDefault) : [],
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function updateLegAt(branch: 'to' | 'return', i: number, next: LegState) {
    const setter = branch === 'to' ? setToLegs : setReturnLegs;
    const arr = branch === 'to' ? toLegs : returnLegs;
    setter(arr.map((l, idx) => (idx === i ? next : l)));
  }

  function removeLegAt(branch: 'to' | 'return', i: number) {
    const setter = branch === 'to' ? setToLegs : setReturnLegs;
    const arr = branch === 'to' ? toLegs : returnLegs;
    setter(arr.filter((_, idx) => idx !== i));
  }

  function addLeg(branch: 'to' | 'return') {
    if (branch === 'to') setToLegs([...toLegs, emptyLeg('flight')]);
    else setReturnLegs([...returnLegs, emptyLeg('flight')]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const photos = photosText.split(/[\n,]+/).map((p) => p.trim()).filter(Boolean);
    const body = {
      tripType,
      title: title || null,
      description: description || null,
      photos,
      date: overallDate || (toLegs[0]?.date ?? ''),
      toLegs: toLegs.map((l) => ({
        ...l,
        originLat: Number(l.originLat),
        originLng: Number(l.originLng),
        destinationLat: Number(l.destinationLat),
        destinationLng: Number(l.destinationLng),
      })),
      returnLegs: tripType === 'roundtrip' ? returnLegs.map((l) => ({
        ...l,
        originLat: Number(l.originLat),
        originLng: Number(l.originLng),
        destinationLat: Number(l.destinationLat),
        destinationLng: Number(l.destinationLng),
      })) : [],
    };

    try {
      const url = mode === 'create' ? '/api/travels' : `/api/travels/${tripId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Save failed');
      router.push('/admin/travels');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!tripId) return;
    if (!confirm('Delete this trip and all its legs?')) return;
    setBusy(true);
    const res = await fetch(`/api/travels/${tripId}`, { method: 'DELETE' });
    if (res.ok) { router.push('/admin/travels'); router.refresh(); }
    else { setError('Delete failed'); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className={formStyles.form}>
      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 4 }}>{error}</div>}

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Trip type
          <select value={tripType} onChange={(e) => setTripType(e.target.value as typeof tripType)}>
            <option value="roundtrip">Round trip</option>
            <option value="oneway">One way</option>
            <option value="relocation">Relocation (sets new home)</option>
          </select>
        </label>
        <label className={formStyles.field}>
          Overall date (sort key)
          <input type="date" value={overallDate} onChange={(e) => setOverallDate(e.target.value)} />
        </label>
      </div>

      <label className={formStyles.field}>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="NC family visit" />
      </label>

      <label className={formStyles.field}>
        Description (optional)
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </label>

      <label className={formStyles.field}>
        Photo URLs (one per line)
        <textarea value={photosText} onChange={(e) => setPhotosText(e.target.value)} rows={3} placeholder="https://..." />
      </label>

      <div>
        <h3 style={{ margin: '6px 0 8px', color: '#c41e3a' }}>Outbound legs</h3>
        {toLegs.map((leg, i) => (
          <LegEditor
            key={i}
            index={i}
            leg={leg}
            onChange={(l) => updateLegAt('to', i, l)}
            onRemove={() => removeLegAt('to', i)}
          />
        ))}
        <button type="button" className={formStyles.ghostButton} onClick={() => addLeg('to')}>+ add outbound leg</button>
      </div>

      {tripType === 'roundtrip' && (
        <div>
          <h3 style={{ margin: '6px 0 8px', color: '#5a8c8b' }}>Return legs</h3>
          {returnLegs.length === 0 && (
            <p style={{ fontSize: 12, color: '#888', fontStyle: 'italic', marginBottom: 8 }}>No return legs yet. Add one ↓</p>
          )}
          {returnLegs.map((leg, i) => (
            <LegEditor
              key={i}
              index={i}
              leg={leg}
              onChange={(l) => updateLegAt('return', i, l)}
              onRemove={() => removeLegAt('return', i)}
            />
          ))}
          <button type="button" className={formStyles.ghostButton} onClick={() => addLeg('return')}>+ add return leg</button>
        </div>
      )}

      <div className={formStyles.actions}>
        <button className={formStyles.button} type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save trip'}
        </button>
        <a className={formStyles.ghostButton} href="/admin/travels">Cancel</a>
        {mode === 'edit' && (
          <button type="button" className={formStyles.dangerButton} onClick={handleDelete} disabled={busy}>Delete</button>
        )}
      </div>
    </form>
  );
}
