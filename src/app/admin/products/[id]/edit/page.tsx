import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductForm from '../../ProductForm';
import { deleteProduct, updateProduct } from '../../../actions';
import styles from '../../../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>Editing /products/{product.slug}</p>
            <h1 className={styles.title}>Revise Product</h1>
            <p className={styles.subtitle}>Changes are live as soon as you save.</p>
          </div>
          <div className={styles.buttonRow}>
            <a className={styles.ghostButton} href={`/products/${product.slug}`}>View</a>
            <a className={styles.ghostButton} href="/admin/products">Back</a>
          </div>
        </div>
        <ProductForm
          defaults={product as any}
          action={updateProduct.bind(null, product.id)}
          deleteAction={deleteProduct.bind(null, product.id)}
        />
      </section>
    </main>
  );
}
