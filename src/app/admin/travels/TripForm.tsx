'use client';

import { useState } from 'react';
import formStyles from '../admin.module.css';

export type TripDefaults = {
  id?: string;
  type?: string;
  originCode?: string;
  originName?: string;
  originLat?: number;
  originLng?: number;
  destinationCode?: string;
  destinationName?: string;
  destinationLat?: number;
  destinationLng?: number;
  date?: string;
  title?: string | null;
  description?: string | null;
  photos?: string[];
};

type Place = { code: string; name: string; lat: number; lng: number };

// Lightweight built-in suggestions. Type to filter; missing places can be entered manually.
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
  { code: 'PIT', name: 'Pittsburgh, PA (PIT)', lat: 40.4915, lng: -80.2329 },
  { code: 'DTW', name: 'Detroit, MI (DTW)', lat: 42.2124, lng: -83.3534 },
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
  { code: 'CAN', name: 'Guangzhou (CAN)', lat: 23.3924, lng: 113.299 },
  { code: 'MV',  name: 'Mountain View, CA', lat: 37.3861, lng: -122.0839 },
  { code: 'SJ',  name: 'San Jose, CA', lat: 37.3382, lng: -121.8863 },
  { code: 'SF',  name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { code: 'BERK', name: 'Berkeley, CA', lat: 37.8716, lng: -122.273 },
  { code: 'PALY', name: 'Palo Alto, CA', lat: 37.4419, lng: -122.143 },
];

function PlacePicker({ prefix, defaults }: { prefix: 'origin' | 'destination'; defaults?: TripDefaults }) {
  const [code, setCode] = useState((prefix === 'origin' ? defaults?.originCode : defaults?.destinationCode) || '');
  const [name, setName] = useState((prefix === 'origin' ? defaults?.originName : defaults?.destinationName) || '');
  const [lat, setLat] = useState(String((prefix === 'origin' ? defaults?.originLat : defaults?.destinationLat) ?? ''));
  const [lng, setLng] = useState(String((prefix === 'origin' ? defaults?.originLng : defaults?.destinationLng) ?? ''));

  const listId = `places-${prefix}`;

  function applyPick(value: string) {
    setName(value);
    const match = PLACES.find((p) => p.name === value || p.code === value);
    if (match) {
      setCode(match.code);
      setName(match.name);
      setLat(String(match.lat));
      setLng(String(match.lng));
    }
  }

  return (
    <fieldset className={formStyles.field} style={{ border: '1px dashed #d6c9aa', padding: 12, borderRadius: 4 }}>
      <legend style={{ padding: '0 6px', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b5a8c' }}>
        {prefix === 'origin' ? 'From' : 'To'}
      </legend>
      <label className={formStyles.field}>
        Search a place (or type manually)
        <input
          list={listId}
          value={name}
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
          <input name={`${prefix}Code`} value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <label className={formStyles.field}>
          Display name
          <input name={`${prefix}Name`} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      </div>
      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Lat
          <input name={`${prefix}Lat`} type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} required />
        </label>
        <label className={formStyles.field}>
          Lng
          <input name={`${prefix}Lng`} type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} required />
        </label>
      </div>
    </fieldset>
  );
}

type Props = {
  defaults?: TripDefaults;
  action: (data: FormData) => void | Promise<void>;
  deleteAction?: () => void | Promise<void>;
};

export default function TripForm({ defaults, action, deleteAction }: Props) {
  const [type, setType] = useState(defaults?.type || 'flight');
  const dateValue = defaults?.date ? new Date(defaults.date).toISOString().slice(0, 10) : '';

  return (
    <form action={action} className={formStyles.form}>
      <label className={formStyles.field}>
        Type
        <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="flight">Flight ✈</option>
          <option value="car">Car / road trip 🚗</option>
        </select>
      </label>

      <div className={formStyles.grid}>
        <PlacePicker prefix="origin" defaults={defaults} />
        <PlacePicker prefix="destination" defaults={defaults} />
      </div>

      <div className={formStyles.grid}>
        <label className={formStyles.field}>
          Date
          <input name="date" type="date" defaultValue={dateValue} required />
        </label>
        <label className={formStyles.field}>
          Title (optional)
          <input name="title" defaultValue={defaults?.title || ''} placeholder="moved to the bay" />
        </label>
      </div>

      <label className={formStyles.field}>
        Description (optional, markdown-ish)
        <textarea name="description" defaultValue={defaults?.description || ''} rows={4} />
      </label>

      <label className={formStyles.field}>
        Photo URLs (one per line or comma-separated)
        <textarea
          name="photos"
          defaultValue={(defaults?.photos || []).join('\n')}
          rows={3}
          placeholder="https://..."
        />
      </label>

      <div className={formStyles.actions}>
        <button className={formStyles.button} type="submit">Save trip</button>
        <a className={formStyles.ghostButton} href="/admin/travels">Cancel</a>
        {deleteAction && (
          <button className={formStyles.dangerButton} type="submit" formAction={deleteAction}>Delete</button>
        )}
      </div>
    </form>
  );
}
