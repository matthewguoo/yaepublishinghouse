import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <SiteLayout>
      <div
        style={{
          maxWidth: 780,
          margin: '0 auto',
          padding: '6rem 1.5rem 8rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '6rem',
            lineHeight: 1,
            color: '#8b4d5c',
            marginBottom: '1rem',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.75rem',
            fontWeight: 500,
            marginBottom: '0.75rem',
            color: '#1a1a1a',
          }}
        >
          This page wandered off
        </h1>
        <p
          style={{
            color: '#666',
            fontSize: '0.95rem',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist, or maybe it&rsquo;s
          waiting for the next Trailblaze. Try one of the routes below.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              padding: '0.7rem 1.5rem',
              background: '#8b4d5c',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'background 0.2s ease',
            }}
          >
            Home
          </Link>
          <Link
            href="/products"
            style={{
              padding: '0.7rem 1.5rem',
              background: 'transparent',
              color: '#8b4d5c',
              textDecoration: 'none',
              border: '1px solid #8b4d5c',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
