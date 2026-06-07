import styles from './page.module.css';
import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import { getAllProducts, ProductData } from '@/lib/products';

export const dynamic = 'force-dynamic';

function ProductCard({ product }: { product: ProductData }) {
  return (
    <Link href={`/products/${product.slug}`} className={styles.productCardLink}>
      <article className={styles.productCard}>
        <span className={styles.hoverChevron}>→</span>
        <div className={styles.horizontalLineTL} />
        <div className={styles.verticalLineTL} />
        <div className={styles.horizontalLineBR} />
        
        {/* Desktop layout: SKU | Title · Subtitle (all inline) */}
        <div className={styles.productHeaderDesktop}>
          {product.sku && <span className={styles.sku}>{product.sku}</span>}
          {product.sku && <span className={styles.skuDivider}>|</span>}
          <h2 className={styles.productTitle}>
            {product.name}
            {product.subtitle && (
              <>
                <span className={styles.titleDot}>·</span>
                <span className={styles.productSubtitle}>{product.subtitle}</span>
              </>
            )}
          </h2>
        </div>
        
        {/* Mobile layout: SKU | Subtitle on line 1, Title on line 2 */}
        <div className={styles.productHeaderMobile}>
          <span className={styles.metaLine}>
            {product.sku && <span className={styles.sku}>{product.sku}</span>}
            {product.sku && product.subtitle && (
              <span className={styles.skuDivider}>|</span>
            )}
            {product.subtitle && (
              <span className={styles.productSubtitle}>{product.subtitle}</span>
            )}
          </span>
          <h2 className={styles.productTitle}>{product.name}</h2>
        </div>

        {product.specs && (
          <p className={styles.specs}>
            {product.specs.split('|').map((spec, i, arr) => (
              <span key={i}>
                {spec}
                {i < arr.length - 1 && <span className={styles.specDivider}> | </span>}
              </span>
            ))}
          </p>
        )}

        <div className={styles.productShowcase}>
          {product.images[0] && (
            <div className={styles.productImageWrap}>
              <img src={product.images[0]} alt={product.name} className={styles.productImage} />
            </div>
          )}
        </div>

        <div className={styles.productFooter}>
          {product.cta.type === 'comingsoon' ? (
            <span>{product.stockStatus || 'COMING SOON'}</span>
          ) : (
            <>
              {product.stockStatus && <span>{product.stockStatus}</span>}
              {product.shippingText && (
                <>
                  <span className={styles.footerDivider}>|</span>
                  <span>{product.shippingText}</span>
                </>
              )}
              {product.price && (
                <>
                  <span className={styles.footerDivider}>|</span>
                  <span className={styles.price}>{product.price}</span>
                </>
              )}
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

export default async function Home() {
  const products = await getAllProducts();

  return (
    <SiteLayout>
      {/* Hero */}
      <section className={styles.hero}>
        <img src="/hero-sketch.png" alt="" className={styles.heroSketch} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Yae Publishing House</h1>
          <p className={styles.heroTagline}>Collector goods for worlds worth keeping close</p>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.productsTitleWrap}>
          <h1 className={styles.productsTitle}>Products</h1>
          <div className={styles.titleLine} />
        </div>

        <div className={styles.productsList}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
