'use client';

import styles from './page.module.css';
import Link from 'next/link';
import { getAllProducts, ProductData } from '@/lib/products';

function ProductCard({ product }: { product: ProductData }) {
  return (
    <Link href={`/products/${product.id}`} className={styles.productCardLink}>
      <article className={styles.productCard}>
        <span className={styles.hoverChevron}>→</span>
        <div className={styles.horizontalLineTL} />
        <div className={styles.verticalLineTL} />
        <div className={styles.horizontalLineBR} />
      <div className={styles.productHeader}>
        <span className={styles.sku}>{product.sku}</span>
        <span className={styles.skuDivider}>|</span>
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
      
      {product.specs && (
        <p className={styles.specs}>
          {product.specs.split('|').map((spec, i, arr) => (
            <span key={i}>
              {spec}
              {i < arr.length - 1 && (
                <span className={styles.specDivider}> | </span>
              )}
            </span>
          ))}
        </p>
      )}

      <div className={styles.productShowcase}>
        {product.images[0] && (
          <div className={styles.productImageWrap}>
            <img 
              src={product.images[0]}
              alt={product.name}
              className={styles.productImage}
            />
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

export default function Home() {
  const products = getAllProducts();
  
  return (
    <main className={styles.main}>
      {/* Logo Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logoWrap}>
          <div className={styles.logoMark}>八</div>
          <div className={styles.logoText}>
            <span className={styles.logoJp}>八重堂書店</span>
            <span className={styles.logoEn}>YAE PUBLISHING HOUSE</span>
          </div>
        </Link>
        <div className={styles.navZone}>
          <span className={styles.navTrigger}>Menu ›</span>
          <div className={styles.navExpanded}>
            <div className={styles.navColumn}>
              <span className={styles.navColumnTitle}>Shop</span>
              <Link href="/products" className={styles.navLink}>Products</Link>
              <Link href="/news" className={styles.navLink}>Editorial</Link>
              <Link href="/tools/png-transparency" className={styles.navLink}>Tools</Link>
            </div>
            <div className={styles.navColumn}>
              <span className={styles.navColumnTitle}>Info</span>
              <Link href="/sitemap" className={styles.navLink}>Sitemap</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
            </div>
            <div className={styles.navColumn}>
              <span className={styles.navColumnTitle}>Account</span>
              <Link href="/login" className={styles.navLink}>Login</Link>
              <Link href="/register" className={styles.navLink}>Register</Link>
            </div>
            <div className={styles.navBadges}>
              <span className={styles.badge}>Free US Shipping</span>
              <span className={styles.badge}>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

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
        
        {/* Product Cards */}
        <div className={styles.productsList}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoMark}>八</div>
            <div className={styles.footerBrandText}>
              <span className={styles.footerBrandJp}>八重堂書店</span>
              <span className={styles.footerBrandEn}>Yae Publishing House</span>
            </div>
          </div>
          
          <nav className={styles.footerNav}>
            <div className={styles.footerNavGroup}>
              <span className={styles.footerNavTitle}>Shop</span>
              <Link href="/products" className={styles.footerNavLink}>Products</Link>
              <Link href="/news" className={styles.footerNavLink}>Editorial</Link>
            </div>
            <div className={styles.footerNavGroup}>
              <span className={styles.footerNavTitle}>Resources</span>
              <Link href="/tools/png-transparency" className={styles.footerNavLink}>Tools</Link>
              <Link href="/sitemap" className={styles.footerNavLink}>Sitemap</Link>
            </div>
            <div className={styles.footerNavGroup}>
              <span className={styles.footerNavTitle}>Connect</span>
              <a href="https://twitter.com/pci_yae" target="_blank" rel="noopener noreferrer" className={styles.footerNavLink}>Twitter</a>
              <a href="https://instagram.com/yaepublishing.house" target="_blank" rel="noopener noreferrer" className={styles.footerNavLink}>Instagram</a>
            </div>
          </nav>
        </div>
        
        <div className={styles.footerBottom}>
          <span className={styles.copyright}>© 2026 Yae Publishing House. Fan-made, not affiliated with HoYoverse.</span>
        </div>
      </footer>
    </main>
  );
}
