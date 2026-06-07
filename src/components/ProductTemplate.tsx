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
          <a href="/">Home</a> › <a href="/products">Products</a> › {product.name}
        </div>

        <div className={styles.titleWrap}>
          <span className={styles.titleBreadcrumb}>Product</span>
          <div className={styles.titleLine} />
        </div>

        {/* Free Shipping Banner */}
        <div className={styles.shippingBanner}>
          <img src="/komaniya-logo.png" alt="Komaniya Express" className={styles.komaniyaLogo} />
          <span>All Yae Publishing House products ship for free — courtesy of Komaniya Express</span>
        </div>

        {/* Image Carousel */}
        <div className={styles.carouselSection}>
          {product.images.length > 0 ? (
            <>
              <div className={styles.carouselTrack}>
                <div 
                  className={styles.carouselSlides} 
                  style={{ transform: `translateX(-${currentImage * 100}%)` }}
                >
                  {product.images.map((img, i) => (
                    <div key={i} className={styles.carouselSlide}>
                      {product.badge && i === 0 && (
                        <span className={`${styles.badge} ${styles[product.badgeType || 'default']}`}>
                          {product.badge}
                        </span>
                      )}
                      <img src={img} alt={`${product.name} ${i + 1}`} />
                    </div>
                  ))}
                </div>
                {product.images.length > 1 && (
                  <>
                    <button 
                      className={`${styles.carouselArrow} ${styles.carouselPrev}`}
                      onClick={() => setCurrentImage(i => i === 0 ? product.images.length - 1 : i - 1)}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button 
                      className={`${styles.carouselArrow} ${styles.carouselNext}`}
                      onClick={() => setCurrentImage(i => i === product.images.length - 1 ? 0 : i + 1)}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className={styles.carouselDots}>
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.carouselDot} ${i === currentImage ? styles.active : ''}`}
                      onClick={() => setCurrentImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                    />
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

        <div className={styles.productLayout}>
          {/* Left column - Product info */}
          <div className={styles.infoLeft}>
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

            <p className={styles.description}>{product.description}</p>

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div className={styles.specs}>
                <h3>Specifications</h3>
                <ul>
                  {product.specs.split('|').map((spec, i) => (
                    <li key={i}>{spec.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

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

          {/* Right column - CTA */}
          <div className={styles.infoRight}>
            {/* CTA */}
            <div className={styles.ctaSection}>
              {renderCTA()}
            </div>

            {/* Timeline */}
            {product.timeline && product.timeline.length > 0 && (
              <div className={styles.timeline}>
                <h3>Timeline</h3>
                <div className={styles.timelineTrack}>
                  {product.timeline.map((milestone, i) => (
                    <div key={i} className={`${styles.timelineMilestone} ${styles[milestone.status]}`}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineContent}>
                        <span className={styles.timelineLabel}>{milestone.label}</span>
                        <span className={styles.timelineDate}>{milestone.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
