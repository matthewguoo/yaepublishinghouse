import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import Breadcrumb from '@/components/Breadcrumb';
import SectionHeader from '@/components/SectionHeader';
import { getAllProducts, ProductData } from '@/lib/products';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

function ProductCard({ product }: { product: ProductData }) {
  const isComingSoon = product.cta.type === 'comingsoon';

  return (
    <Link href={`/products/${product.slug}`} className={styles.productCard}>
      <div className={styles.productImage}>
        {isComingSoon && <span className={styles.comingSoonBadge}>Coming Soon</span>}
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className={styles.noImage}>Image Coming Soon</div>
        )}
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.name}</h3>
        {product.subtitle && <p className={styles.productSubtitle}>{product.subtitle}</p>}
        <p className={styles.productDescription}>{product.description}</p>

        {product.specs && (
          <div className={styles.productSpecs}>
            {product.specs.split('|').map((spec, i) => (
              <span key={i} className={styles.spec}>{spec.trim()}</span>
            ))}
          </div>
        )}

        <div className={styles.productFooter}>
          {!isComingSoon && <span className={styles.price}>{product.price}</span>}
          <span className={styles.readMore}>Read announcement →</span>
        </div>
      </div>
    </Link>
  );
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  const availableProducts = products.filter((p) => p.cta.type !== 'comingsoon');
  const comingSoonProducts = products.filter((p) => p.cta.type === 'comingsoon');

  return (
    <SiteLayout>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
        <SectionHeader title="Products" as="h1" />

        <p className={styles.subtitle}>Limited edition collectibles and merchandise from across the stars</p>

        {availableProducts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Available Now</h2>
            <div className={styles.productsList}>
              {availableProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {comingSoonProducts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Coming Soon</h2>
            <div className={styles.productsList}>
              {comingSoonProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {products.length === 0 && (
          <p className={styles.subtitle}>No products yet. Stay tuned.</p>
        )}
      </div>
    </SiteLayout>
  );
}
