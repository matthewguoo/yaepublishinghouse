'use client';

import { useEffect } from 'react';

export default function SpaceXOffer() {
  useEffect(() => {
    window.location.replace('/spacex-offer.pdf');
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui' }}>
      <p>Redirecting to offer document...</p>
    </div>
  );
}
