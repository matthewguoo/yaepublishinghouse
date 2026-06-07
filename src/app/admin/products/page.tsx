import Link from 'next/link';
import { prisma } from '@/lib/db';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Webmaster console</p>
            <h1 className={styles.title}>Product Catalog</h1>
            <p className={styles.subtitle}>Create, hide, and revise products. Changes go live instantly, no redeploy.</p>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.ghostButton} href="/admin/articles">Editorial</Link>
            <Link className={styles.ghostButton} href="/">View site</Link>
            <Link className={styles.button} href="/admin/products/new">New product</Link>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong><br />
                  <small>/products/{product.slug}</small>
                </td>
                <td>{product.sku || '—'}</td>
                <td>{product.price}</td>
                <td>
                  <span className={styles.status}>{product.published ? 'Published' : 'Draft'}</span>{' '}
                  {product.featured && <span className={styles.status}>Featured</span>}
                </td>
                <td><a className={styles.ghostButton} href={`/admin/products/${product.id}/edit`}>Edit</a></td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '2rem', opacity: 0.6 }}>No products yet. Create the first one.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
