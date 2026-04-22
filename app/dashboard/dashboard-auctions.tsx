/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { AuctionSummary } from '../../lib/auctions';
import { formatPrice, formatTimeLeft } from '../../lib/auctions';

export function DashboardAuctions({ auctions, handle }: { auctions: AuctionSummary[]; handle: string }) {
  const active = auctions.filter((a) => a.status === 'active' && !a.isOver);
  const past = auctions.filter((a) => a.status !== 'active' || a.isOver);

  return (
    <section
      style={{
        maxWidth: 980,
        margin: '0 auto 60px',
        padding: '0 22px',
        display: 'grid',
        gap: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-marker), cursive',
              color: '#b24d78',
              fontSize: '1.6rem',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            your auctions
          </p>
          <p
            style={{
              fontFamily: 'var(--font-note), cursive',
              color: 'var(--ink-soft)',
              margin: '4px 0 0',
            }}
          >
            list cosplay pieces, prop slots, or commissions. shows up on @{handle}.
          </p>
        </div>
        <Link href="/auctions/new" className="primary-button">
          new auction
        </Link>
      </div>

      {active.length === 0 && past.length === 0 ? (
        <div
          style={{
            padding: '34px 22px',
            border: '2px dashed rgba(210, 138, 170, 0.4)',
            borderRadius: 22,
            background: 'rgba(255, 244, 248, 0.6)',
            textAlign: 'center',
            fontFamily: 'var(--font-note), cursive',
            color: 'var(--ink-soft)',
          }}
        >
          no auctions yet. <Link href="/auctions/new" style={{ color: '#b24d78', textDecoration: 'underline' }}>list your first piece</Link>.
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <AuctionList title="live" auctions={active} />
          )}
          {past.length > 0 && (
            <AuctionList title="ended" auctions={past} muted />
          )}
        </>
      )}
    </section>
  );
}

function AuctionList({ title, auctions, muted }: { title: string; auctions: AuctionSummary[]; muted?: boolean }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <p
        style={{
          fontFamily: 'var(--font-note), cursive',
          color: 'var(--berry)',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          margin: 0,
        }}
      >
        {title}
      </p>
      <div style={{ display: 'grid', gap: 12 }}>
        {auctions.map((a) => (
          <Link
            key={a.id}
            href={`/auctions/${a.id}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr auto',
              gap: 14,
              alignItems: 'center',
              padding: '12px 14px',
              borderRadius: 18,
              background: 'white',
              border: '1px solid rgba(202, 98, 139, 0.14)',
              boxShadow: '0 8px 18px rgba(202, 98, 139, 0.06)',
              textDecoration: 'none',
              color: 'inherit',
              opacity: muted ? 0.78 : 1,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #fff5f9, #ffe4ee)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-marker), cursive',
                color: 'rgba(202, 98, 139, 0.45)',
              }}
            >
              {a.imageUrl ? <img src={a.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '—'}
            </div>
            <div style={{ display: 'grid', gap: 2, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body), serif',
                  fontSize: '1.05rem',
                  color: 'var(--ink)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {a.title}
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--font-note), cursive', color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
                {a.bidCount} bid{a.bidCount === 1 ? '' : 's'} · {formatTimeLeft(a.endsAt)}
              </p>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-marker), cursive',
                fontSize: '1.4rem',
                color: 'var(--ink)',
              }}
            >
              {formatPrice(a.currentBid ?? a.startingBid)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
