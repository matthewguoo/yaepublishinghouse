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

      {/* What We Do Section */}
      <section className={styles.whatWeDoSection}>
        <div className={styles.whatWeDoTitleWrap}>
          <h2 className={styles.whatWeDoTitle}>What We Do</h2>
          <div className={styles.titleLine} />
        </div>
        <div className={styles.missionGrid}>
          <div className={styles.missionItem}>
            <span className={styles.missionNumber}>01</span>
            <div className={styles.missionContent}>
              <p className={styles.missionText}>
                We design original goods with manufacturing processes you won't find elsewhere. Real gold plating, aerospace-grade materials, details that reward a closer look.
              </p>
              <div className={styles.missionPoints}>
                <div className={styles.missionPoint}>
                  <span className={styles.pointLetter}>a.</span>
                  <p>A product should be of sufficient quality to obsess over. A surface that scratches is a finish that needs to be redesigned.</p>
                </div>
                <div className={styles.missionPoint}>
                  <span className={styles.pointLetter}>b.</span>
                  <p>High technology, high connection. Even when our products are milled with precision instruments finer than Yae's silky tail-fur, necessary finishing touches are meticulously done by hand.</p>
                </div>
                <div className={styles.missionPoint}>
                  <span className={styles.pointLetter}>c.</span>
                  <p>A good product is a piece of art. True art is human. The publishing house will never use matrix multiplication to create artwork. That said, the Guuji is seeking talented designers and artists for new wares. <a href="mailto:hello@yaepublishing.house" className={styles.aboutLink}>Get in touch</a>.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.missionItem}>
            <span className={styles.missionNumber}>02</span>
            <div className={styles.missionContent}>
              <p className={styles.missionText}>
                The publishing house handles logistics for overseas creators bringing goods to the US. Our network lets us bring wares from afar and still profit while undercutting dropshippers run by Zagreus.
              </p>
              <div className={styles.emailSignup}>
                <span className={styles.emailLabel}>Be first to join bulk imports</span>
                <form className={styles.emailForm}>
                  <input type="email" placeholder="your@email.com" className={styles.emailInput} />
                  <button type="submit" className={styles.emailButton}>Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
