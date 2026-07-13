import Link from 'next/link';
import { prisma } from '@/lib/db';
import styles from './admin.module.css';
import { createPromo, deletePromo } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  new: 'New',
  confirmed: 'Paid',
  in_production: 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function fmt(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminKeychainsPage() {
  const [orders, promos] = await Promise.all([
    prisma.keychainOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { email: true } } },
    }),
    prisma.keychainPromo.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Custom keychain orders</div>
          <h1 className={styles.title}>Keychains</h1>
        </div>
        <Link href="/admin" className={styles.backLink}>← Admin</Link>
      </div>

      {/* Orders */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Orders</h2>
        {orders.length === 0 ? (
          <p className={styles.empty}>No orders yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Qty × Designs</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{fmt(o.createdAt)}</td>
                  <td>
                    <div>{o.name}</div>
                    <div className={styles.muted}>{o.email}</div>
                  </td>
                  <td>{o.quantity} × {o.designs}</td>
                  <td>${(o.priceInCents / 100).toFixed(2)}</td>
                  <td><span className={`${styles.chip} ${styles[`chip_${o.status}`] ?? ''}`}>{STATUS_LABEL[o.status] ?? o.status}</span></td>
                  <td><Link href={`/admin/keychains/${o.id}`} className={styles.rowLink}>Open →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Promo codes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Promo codes</h2>
        {promos.length === 0 ? (
          <p className={styles.empty}>No promo codes yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr><th>Code</th><th>Discount</th><th>Used / Max</th><th>Expires</th><th>Note</th><th></th></tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.code}>
                  <td className={styles.mono}>{p.code}</td>
                  <td>{p.discountPct}%</td>
                  <td>{p.timesUsed} / {p.maxUses ?? '∞'}</td>
                  <td>{p.expiresAt ? fmt(p.expiresAt) : '—'}</td>
                  <td className={styles.muted}>{p.note ?? ''}</td>
                  <td>
                    <form action={deletePromo}>
                      <input type="hidden" name="code" value={p.code} />
                      <button className={styles.dangerBtn}>Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form action={createPromo} className={styles.promoForm}>
          <h3 className={styles.formTitle}>New / update promo code</h3>
          <div className={styles.formGrid}>
            <label>
              <span>Code</span>
              <input name="code" placeholder="LAUNCH50" required />
            </label>
            <label>
              <span>Discount %</span>
              <input name="discountPct" type="number" min={1} max={100} defaultValue={50} required />
            </label>
            <label>
              <span>Max uses</span>
              <input name="maxUses" type="number" min={1} placeholder="unlimited" />
            </label>
            <label>
              <span>Expires</span>
              <input name="expiresAt" type="date" />
            </label>
            <label className={styles.formFull}>
              <span>Note</span>
              <input name="note" placeholder="Launch promo, first-time customers" />
            </label>
          </div>
          <button className={styles.submitBtn}>Save code</button>
        </form>
      </section>
    </div>
  );
}
