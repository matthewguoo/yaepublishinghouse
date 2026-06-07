'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '3rem',
            color: '#8b4d5c',
            marginBottom: '1rem',
          }}
        >
          something broke
        </div>
        <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
          An unexpected error occurred. Try again, or head back home.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.7rem 1.5rem',
              background: '#8b4d5c',
              color: '#fff',
              border: 'none',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              padding: '0.7rem 1.5rem',
              background: 'transparent',
              color: '#8b4d5c',
              border: '1px solid #8b4d5c',
              textDecoration: 'none',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Home
          </Link>
        </div>
        {error.digest && (
          <p style={{ marginTop: '2rem', color: '#999', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
