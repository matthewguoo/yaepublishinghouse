'use client';

import { ProductData } from '@/lib/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ProductData;
  variant?: 'compact' | 'full';
}

export default function ProductCard({ product, variant = 'compact' }: ProductCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.imageWrap}>
        {product.badge && (
          <span className={`${styles.badge} ${styles[product.badgeType || 'default']}`}>
            {product.badge}
          </span>
        )}
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className={styles.noImage}>Coming Soon</div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.subtitle && <p className={styles.subtitle}>{product.subtitle}</p>}
        <p className={styles.description}>{product.description}</p>
        {product.specs.length > 0 && (
          <div className={styles.specs}>
            {product.specs.slice(0, 3).map((spec, i) => (
              <span key={i}>{spec.value}</span>
            ))}
          </div>
        )}
        <div className={styles.footer}>
          <div className={styles.priceCol}>
            <span className={styles.price}>{product.price}</span>
            <span className={styles.shipping}>Free shipping via Komaniya Express</span>
          </div>
          <a href={`/products/${product.slug}`} className={styles.cta}>
            View Product →
          </a>
        </div>
      </div>
    </div>
  );
}
