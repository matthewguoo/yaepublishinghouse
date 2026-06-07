import ProductForm from '../ProductForm';
import { createProduct } from '../../actions';
import styles from '../../admin.module.css';

export default function NewProductPage() {
  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>New product</p>
            <h1 className={styles.title}>Create Product</h1>
            <p className={styles.subtitle}>Goes live immediately if Published is checked.</p>
          </div>
          <a className={styles.ghostButton} href="/admin/products">Back</a>
        </div>
        <ProductForm action={createProduct} />
      </section>
    </main>
  );
}
