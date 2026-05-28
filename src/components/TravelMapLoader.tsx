'use client';

import dynamic from 'next/dynamic';
import type { Trip } from './TravelMap';

const TravelMap = dynamic(() => import('./TravelMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5a8c' }}>
      loading map ~
    </div>
  ),
});

export default function TravelMapLoader({ trips }: { trips: Trip[] }) {
  return <TravelMap trips={trips} />;
}
