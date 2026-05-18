'use client';

import { useState, useEffect } from 'react';
import { ProductData } from '@/lib/products';
import SiteLayout from './SiteLayout';
import styles from './ProductTemplate.module.css';

interface ProductTemplateProps {
  product: ProductData;
}

interface User {
  email: string;
}

export default function ProductTemplate({ product }: ProductTemplateProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          setEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId: product.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    // TODO: integrate with Stripe
    console.log('Stripe checkout for:', product.id);
  };

  const renderCTA = () => {
    switch (product.cta.type) {
      case 'email':
        if (submitted) {
          return (
            <div className={styles.successMessage}>
              {product.cta.successMessage || 'Thanks! Check your email for confirmation.'}
            </div>
          );
        }
        if (user) {
          return (
            <>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <button 
                onClick={() => handleEmailSubmit()} 
                className={styles.ctaButtonFull} 
                disabled={loading}
              >
                {loading ? 'Submitting...' : (product.cta.buttonText || 'Notify Me')}
              </button>
            </>
          );
        }
        return (
          <>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className={styles.emailInput}
              />
              <button type="submit" className={styles.ctaButton} disabled={loading}>
                {loading ? 'Submitting...' : (product.cta.buttonText || 'Notify Me')}
              </button>
            </form>
          </>
        );

      case 'stripe':
        return (
          <button onClick={handleStripeCheckout} className={styles.ctaButton}>
            {product.cta.buttonText || 'Buy Now'} — {product.price}
          </button>
        );

      case 'soldout':
        return (
          <div className={styles.soldout}>
            {product.cta.message || 'Sold Out'}
          </div>
        );

      case 'comingsoon':
        if (submitted) {
          return (
            <div className={styles.successMessage}>
              Thanks! Check your email for confirmation.
            </div>
          );
        }
        return (
          <div className={styles.comingsoon}>
            <p>{product.cta.message || 'Coming Soon'}</p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="notify me at..."
                required
                disabled={loading}
                className={styles.emailInput}
              />
              <button type="submit" className={styles.ctaButtonSecondary} disabled={loading}>
                {loading ? 'Submitting...' : 'Notify Me'}
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <SiteLayout>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> &gt; <a href="/products">Products</a> &gt; {product.name}
        </div>

        <div className={styles.productLayout}>
          {/* Image gallery */}
          <div className={styles.gallery}>
            {product.images.length > 0 ? (
              <>
                <div className={styles.mainImage}>
                  {product.badge && (
                    <span className={`${styles.badge} ${styles[product.badgeType || 'default']}`}>
                      {product.badge}
                    </span>
                  )}
                  <img src={product.images[currentImage]} alt={product.name} />
                </div>
                {product.images.length > 1 && (
                  <div className={styles.thumbnails}>
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        className={`${styles.thumbnail} ${i === currentImage ? styles.active : ''}`}
                        onClick={() => setCurrentImage(i)}
                      >
                        <img src={img} alt={`${product.name} ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noImage}>
                <span>Image Coming Soon</span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className={styles.info}>
            <h1 className={styles.title}>{product.name}</h1>
            {product.subtitle && (
              <p className={styles.subtitle}>{product.subtitle}</p>
            )}
            
            <div className={styles.priceRow}>
              <span className={styles.price}>{product.price}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>{product.originalPrice}</span>
              )}
            </div>
            <div className={styles.shippingNote}>
              <img src="/komaniya-logo.png" alt="Komaniya Express" className={styles.komaniyaLogo} />
              <span>All Yae Publishing House products ship for free — courtesy of Komaniya Express</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Specs table */}
            {product.specs.length > 0 && (
              <div className={styles.specs}>
                <h3>Specifications</h3>
                <table>
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={i}>
                        <td className={styles.specLabel}>{spec.label}</td>
                        <td className={styles.specValue}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CTA */}
            <div className={styles.ctaSection}>
              {renderCTA()}
            </div>

            {product.serialRange && (
              <p className={styles.serialNote}>
                Serial numbers {product.serialRange}
              </p>
            )}

            {product.announcementUrl && (
              <a href={product.announcementUrl} className={styles.announcementLink}>
                Read the full announcement →
              </a>
            )}
          </div>
        </div>

        {/* Product images gallery */}
        {product.images.length > 1 && (
          <div className={styles.imageGallery}>
            <h3>Product Images</h3>
            <div className={styles.imageRow}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.galleryThumb} ${i === currentImage ? styles.active : ''}`}
                  onClick={() => setCurrentImage(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
