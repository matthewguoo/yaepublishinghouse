'use client';

import SiteLayout from '@/components/SiteLayout';
import { getAllProducts } from '@/lib/products';
import styles from './page.module.css';

const allProducts = getAllProducts();
const availableProducts = allProducts.filter(p => p.cta.type !== 'comingsoon');
const upcomingProducts = allProducts.filter(p => p.cta.type === 'comingsoon');

export default function ProductsPage() {
  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; Products
        </div>

        <header className={styles.header}>
          <h1>Products</h1>
          <p>Limited edition collectibles and merchandise from across the stars</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Now</h2>
          <div className={styles.productGrid}>
            {availableProducts.map((product) => (
              <a key={product.id} href={`/products/${product.slug}`} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.badge && (
                    <span className={`${styles.badge} ${styles[product.badgeType || 'default']}`}>
                      {product.badge}
                    </span>
                  )}
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className={styles.noImage}>Image Coming Soon</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p className={styles.subtitle}>{product.subtitle}</p>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.specs}>
                    {product.specs.slice(0, 3).map((spec, i) => (
                      <span key={i}>{spec.value}</span>
                    ))}
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{product.price}</span>
                    {product.announcementUrl && (
                      <span className={styles.newsLink}>Read announcement →</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {upcomingProducts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Coming Soon</h2>
            <div className={styles.upcomingGrid}>
              {upcomingProducts.map((product) => (
                <div key={product.id} className={styles.upcomingCard}>
                  <span className={styles.upcomingBadge}>{product.badge || 'SOON'}</span>
                  <h3>{product.name}</h3>
                  <p className={styles.subtitle}>{product.subtitle}</p>
                  <p className={styles.description}>{product.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
