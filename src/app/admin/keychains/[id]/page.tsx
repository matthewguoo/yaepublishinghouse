import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateOrderStatus } from '../actions';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Paid' },
  { value: 'in_production', label: 'In production' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default async function KeychainOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.keychainOrder.findUnique({
    where: { id },
    include: { user: { select: { email: true, name: true } } },
  });
  if (!order) notFound();

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Keychain order</div>
          <h1 className={styles.title}>{order.name}</h1>
          <p className={styles.muted}>{order.email} · {order.createdAt.toLocaleString()}</p>
        </div>
        <Link href="/admin/keychains" className={styles.backLink}>← All orders</Link>
      </div>

      <div className={styles.detailGrid}>
        <div>
          <div className={styles.previewFrame}>
            {order.previewPng ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={order.previewPng} alt="Preview" />
            ) : (
              <div className={styles.previewEmpty}>No preview saved</div>
            )}
          </div>
          <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
            File: {order.fileName || '—'}
          </p>
          {order.previewPng && (
            <a
              href={order.previewPng}
              download={`keychain-${order.id}.png`}
              className={styles.rowLink}
            >
              Download preview →
            </a>
          )}
        </div>

        <div>
          <dl className={styles.dl}>
            <div><dt>Status</dt><dd>{order.status}</dd></div>
            <div><dt>Quantity</dt><dd>{order.quantity}</dd></div>
            <div><dt>Designs</dt><dd>{order.designs}</dd></div>
            <div><dt>Price</dt><dd>${(order.priceInCents / 100).toFixed(2)}</dd></div>
            <div><dt>Handle</dt><dd>{order.handle || '—'}</dd></div>
            <div><dt>Account</dt><dd>{order.user?.email || '(guest)'}</dd></div>
          </dl>

          {order.notes && (
            <div className={styles.notesBlock}>
              <div className={styles.notesLabel}>Customer notes</div>
              <p>{order.notes}</p>
            </div>
          )}

          <form action={updateOrderStatus} className={styles.statusForm}>
            <input type="hidden" name="id" value={order.id} />
            <label>
              <span>Update status</span>
              <select name="status" defaultValue={order.status}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <button className={styles.submitBtn}>Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
