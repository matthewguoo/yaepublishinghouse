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

      {/* Who We Are Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutTitleWrap}>
          <h2 className={styles.aboutTitle}>Who We Are</h2>
          <div className={styles.titleLine} />
        </div>
        <div className={styles.aboutContent}>
          <blockquote className={styles.aboutQuote}>
            <span className={styles.quoteMark}>"</span>
            <p className={styles.quoteText}>
              <span className={styles.quoteLight}>The best stories</span>{' '}
              <span className={styles.quoteBold}>deserve to be held.</span>
            </p>
          </blockquote>
          <p className={styles.aboutStory}>
            The Guuji's publishing house has always dealt in tales worth treasuring. 
            Now we bring that same care to the things you carry with you. Small 
            artifacts from worlds that matter to you.
          </p>
          <p className={styles.aboutDisclaimer}>
            A fan project. Not affiliated with HoYoverse.
          </p>
        </div>
      </section>

      {/* Location Section */}
      <section className={styles.locationSection}>
        <div className={styles.locationVisual}>
          <div className={styles.locationIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <span className={styles.locationLabel}>Northern California</span>
        </div>
        <div className={styles.locationContent}>
          <p className={styles.locationText}>
            This branch of the publishing house currently operates quite far from Narukami. 
            But according to the Guuji, the fog rolling over these hills reminds her of home. 
            And the eternal sunshine makes for excellent reading weather.
          </p>
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
