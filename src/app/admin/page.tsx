import Link from 'next/link';
import { prisma } from '@/lib/db';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [productCount, articleCount, pendingMedia] = await Promise.all([
    prisma.product.count(),
    prisma.article.count(),
    prisma.mediaSubmission.count({ where: { status: 'pending' } }),
  ]);

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Webmaster console</p>
            <h1 className={styles.title}>Yae Publishing Admin</h1>
            <p className={styles.subtitle}>Edit catalog and editorial without a redeploy. All changes go live instantly.</p>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.ghostButton} href="/">View site</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/admin/products" className={styles.panel} style={{ padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <p className={styles.eyebrow}>Catalog</p>
            <h2 className={styles.title} style={{ fontSize: '1.25rem' }}>Products ({productCount})</h2>
            <p className={styles.subtitle}>Manage product catalog</p>
          </Link>
          <Link href="/admin/articles" className={styles.panel} style={{ padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <p className={styles.eyebrow}>Editorial</p>
            <h2 className={styles.title} style={{ fontSize: '1.25rem' }}>Articles ({articleCount})</h2>
            <p className={styles.subtitle}>News & dispatches</p>
          </Link>
          <Link href="/admin/media-submissions" className={styles.panel} style={{ padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <p className={styles.eyebrow}>Community</p>
            <h2 className={styles.title} style={{ fontSize: '1.25rem' }}>Media ({pendingMedia} pending)</h2>
            <p className={styles.subtitle}>Review user submissions</p>
          </Link>
          <Link href="/admin/travels" className={styles.panel} style={{ padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
            <p className={styles.eyebrow}>Personal</p>
            <h2 className={styles.title} style={{ fontSize: '1.25rem' }}>Travels</h2>
            <p className={styles.subtitle}>Flight & trip logs</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
