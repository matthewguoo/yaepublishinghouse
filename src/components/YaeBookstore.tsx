'use client';

import { useState, useEffect } from 'react';
import { useKBar } from 'kbar';
import styles from './YaeBookstore.module.css';
import { Lang, t } from './translations';
import { LoginModal, RegisterModal } from './AuthModals';
import { useUser } from '@/hooks/useUser';
// HackedOverlay only used within carousel banner, not as full overlay

export default function YaeBookstore() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [sidebarPassword, setSidebarPassword] = useState('');
  const [sidebarError, setSidebarError] = useState('');
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const { user } = useUser();
  const [glitchPhase, setGlitchPhase] = useState<'idle' | 'glitching' | 'seized'>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalSlides = 3;
  const { query } = useKBar();

  const handleSidebarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSidebarError('');
    setSidebarLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sidebarEmail, password: sidebarPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSidebarError(data.error || 'Login failed');
        return;
      }

      window.location.reload();
    } catch {
      setSidebarError('Something went wrong');
    } finally {
      setSidebarLoading(false);
    }
  };

  // Auto-trigger glitching after 10 seconds of idle
  useEffect(() => {
    if (glitchPhase !== 'idle') return;
    const timer = setTimeout(() => {
      setGlitchPhase('glitching');
      // Then auto-seize after 5s
      setTimeout(() => setGlitchPhase('seized'), 5000);
    }, 10000);
    return () => clearTimeout(timer);
  }, [glitchPhase]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banners = [
    {
      image: '/yae-raiden-banner.png',
      badge: t('anniversary', lang),
      title: t('bannerTitle', lang),
      desc: t('bannerDesc', lang),
      href: '/news/anniversary-dialogue',
    },
    {
      image: '/banner-hoyofair.png',
      badge: t('hoyofairBadge', lang),
      title: t('hoyofairTitle', lang),
      desc: t('hoyofairDesc', lang),
      href: '/news/hoyofair-2026',
    },
    {
      image: '/banner-ipc.png',
      badge: t('ipcBadge', lang),
      title: t('ipcTitle', lang),
      desc: t('ipcDesc', lang),
      isIpc: true,
      href: '/products/nameless-pass',
    },
  ];

  return (
    <div className={styles.container} data-lang={lang}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>八</div>
            <div>
              <div className={styles.logoText}>八重堂書店</div>
              <div className={styles.logoSub}>YAE PUBLISHING HOUSE</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            {/* Language selector hidden - defaults to English */}
            <button 
              className={styles.akashaBtn}
              onClick={() => query.toggle()}
            >
              Akasha
            </button>
            <div className={styles.headerLinks}>
              <a href="/products">Products</a>
              <a href="/tools/png-transparency">PNG Tool</a>
              <a href="/sitemap">{t('sitemap', lang)}</a>
              <a href="/contact">{t('contact', lang)}</a>
              {user ? (
                <a href="/account">Account</a>
              ) : (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>{t('register', lang)}</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>{t('login', lang)}</a>
                </>
              )}
            </div>
            <button 
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>



      {/* Main */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Banner Carousel */}
          <div className={styles.carousel}>
            <button 
              className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
              onClick={() => setCurrentSlide(prev => prev === 0 ? banners.length - 1 : prev - 1)}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <div 
              className={styles.carouselTrack} 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <a 
                  key={index} 
                  href={banner.href}
                  className={`${styles.banner} ${banner.isIpc ? styles.ipcBanner : ''}`}
                >
                  <img src={banner.image} alt={banner.title} />
                  <div className={styles.bannerOverlay}>
                    <span className={`${styles.bannerBadge} ${banner.isIpc ? styles.ipcBadge : ''}`}>
                      {banner.badge}
                    </span>
                    <h2 className={styles.bannerTitle}>{banner.title}</h2>
                    <p className={styles.bannerDesc}>{banner.desc}</p>
                  </div>
                </a>
              ))}
            </div>
            <button 
              className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
              onClick={() => setCurrentSlide(prev => prev === banners.length - 1 ? 0 : prev + 1)}
              aria-label="Next slide"
            >
              ›
            </button>
            <div className={styles.carouselDots}>
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Promo strip */}
          <div className={styles.promoStrip}>
            <a href="/news" className={styles.promoCard}>
              <div className={styles.promoIcon}>{lang === 'en' ? 'NEWS' : '報'}</div>
              <div className={styles.promoText}>
                <h4>News & Announcements</h4>
                <p>Latest drops and updates</p>
              </div>
            </a>
            <a href="/products" className={`${styles.promoCard} ${styles.alt}`}>
              <div className={styles.promoIcon}>{lang === 'en' ? 'SHOP' : '店'}</div>
              <div className={styles.promoText}>
                <h4>{t('storeInventory', lang)}</h4>
                <p>{t('storeInventoryDesc', lang)}</p>
              </div>
            </a>
          </div>

          {/* Featured News */}
          <div className={styles.featuredNews}>
            <div className={styles.featuredHeader}>
              <span className={styles.featuredLabel}>Featured</span>
            </div>
            <a href="/news/hiring-writers" className={styles.newsRow}>
              <span className={styles.newsDate}>2026.05.18</span>
              <span className={styles.newsTag}>Hiring</span>
              <span className={styles.newsTitle}>The Guuji seeks editorial staff, reporters, and writers</span>
            </a>
            <a href="/news/nameless-pass-announcement" className={styles.newsRow}>
              <span className={styles.newsDate}>2026.05.17</span>
              <span className={styles.newsTag}>Product</span>
              <span className={styles.newsTitle}>Nameless Honor Pass now available for pre-order</span>
            </a>
            <a href="/news/hoyofair-2026" className={styles.newsRow}>
              <span className={styles.newsDate}>2026.01.15</span>
              <span className={styles.newsTag}>Report</span>
              <span className={styles.newsTitle}>HoYoFair 2026 Los Angeles: A Report from the Front Row</span>
            </a>
          </div>

          {/* Mobile-only hiring box */}
          <div className={styles.hiringBoxMobile}>
            <h3 className={styles.hiringTitle}>The Guuji seeks talented writers</h3>
            <p className={styles.hiringDesc}>Cover HoYoverse news and events. Contributors receive free merchandise and store vouchers.</p>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcW9rmgzqiSqJCJhAYXyIs3fivJOMu0jjDR7-W4V5M_yVexA/viewform" target="_blank" rel="noopener noreferrer" className={styles.hiringBtn}>Apply Now</a>
          </div>

          {/* Book sections container - can be seized */}
          <div 
            className={`${styles.booksContainer} ${glitchPhase === 'glitching' ? styles.glitchingSection : ''} ${glitchPhase === 'seized' ? styles.seizedSection : ''}`}
            onMouseEnter={() => {
              if (glitchPhase === 'idle') {
                setGlitchPhase('glitching');
                // Auto-transition to seized after 5s
                setTimeout(() => setGlitchPhase('seized'), 5000);
              }
            }}
            onClick={() => {
              if (glitchPhase === 'glitching') {
                setGlitchPhase('seized');
              }
            }}
          >
            {/* Glitch overlay - visible during glitching phase */}
            {glitchPhase === 'glitching' && (
              <div className={styles.glitchOverlay}>
                <div className={styles.glitchBar} style={{ top: '15%' }}></div>
                <div className={styles.glitchBar} style={{ top: '35%', animationDelay: '0.2s' }}></div>
                <div className={styles.glitchBar} style={{ top: '55%', animationDelay: '0.5s' }}></div>
                <div className={styles.glitchBar} style={{ top: '75%', animationDelay: '0.8s' }}></div>
                <div className={styles.glitchBar} style={{ top: '90%', animationDelay: '1.1s' }}></div>
              </div>
            )}
            
            {glitchPhase === 'seized' ? (
              <div className={styles.seizedContent}>
                {/* Danmaku comments */}
                <div className={styles.danmaku}>
                  <span style={{ animationDelay: '0s', top: '5%' }}>银狼太酷了！！</span>
                  <span style={{ animationDelay: '0.5s', top: '15%' }}>SILVER WOLF BEST GIRL</span>
                  <span style={{ animationDelay: '1s', top: '25%' }}>ハッキング成功wwww</span>
                  <span style={{ animationDelay: '1.5s', top: '35%' }}>GG EZ</span>
                  <span style={{ animationDelay: '2s', top: '45%' }}>这网站被黑了lol</span>
                  <span style={{ animationDelay: '2.5s', top: '55%' }}>STELLARON HUNTERS SUPREMACY</span>
                  <span style={{ animationDelay: '3s', top: '65%' }}>银狼我老婆！！！</span>
                  <span style={{ animationDelay: '3.5s', top: '75%' }}>GET HACKED LMAO</span>
                  <span style={{ animationDelay: '4s', top: '85%' }}>为了燃料费wwww</span>
                  <span style={{ animationDelay: '0.3s', top: '10%' }}>CYBERPUNK VIBES</span>
                  <span style={{ animationDelay: '1.2s', top: '30%' }}>狼姐带带我</span>
                  <span style={{ animationDelay: '2.2s', top: '50%' }}>AETHER WARS WHEN</span>
                  <span style={{ animationDelay: '3.2s', top: '70%' }}>IPC APPROVED ✓</span>
                  <span style={{ animationDelay: '4.2s', top: '90%' }}>开拓者の敵</span>
                </div>
                
                <div className={styles.seizedHeader}>
                  <span className={styles.seizedIcon}>◈</span>
                  <span className={styles.seizedLabel}>STELLARON HUNTERS × IPC</span>
                </div>
                <div className={styles.seizedTitleRow}>
                  <img src="/silver-wolf-chibi.png" alt="Silver Wolf" className={styles.seizedChibi} />
                  <h2 className={styles.seizedTitle}>This Section Has Been Seized</h2>
                </div>
                <p className={styles.seizedDesc}>
                  The Stellaron Hunters, in collaboration with the Interastral Peace Corporation, 
                  have seized this website in promotion of the 2158th Year of the Trailblaze 
                  and the Nameless' contributions to the situation in Penacony (and to acquire credits for fuel).
                </p>
                <div className={styles.seizedCtaRow}>
                  <a href="/products/nameless-pass" className={styles.seizedCtaPrimary}>
                    View Product
                  </a>
                  <a href="/news/nameless-pass-announcement" className={styles.seizedCtaSecondary}>
                    See Announcement →
                  </a>
                </div>
                <div className={styles.seizedProduct}>
                  <img src="/nameless-pass.png" alt="Nameless Honor Pass" />
                </div>
              </div>
            ) : (
              <>
                {/* Recommended section */}
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t('recommendedNovels', lang)}</h2>
                    <span className={styles.sectionMore}>{t('seeMore', lang)}</span>
                  </div>
                  <div className={styles.bookGrid}>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={`${styles.bookBadge} ${styles.new}`}>{t('new', lang)}</span>
                        <img src="/book-shogun-almighty.png" alt="Shogun Almighty" />
                      </div>
                      <div className={styles.stars}>★★★★★</div>
                      <div className={styles.bookTitle}>{t('shogunAlmighty', lang)}</div>
                      <div className={styles.bookAuthor}>{t('shogunAuthor', lang)}</div>
                      <div className={styles.bookPrice}>$12.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={styles.bookBadge}>{t('limited', lang)}</span>
                        <img src="/book-kitsune-guuji.png" alt="Kitsune Guuji" />
                      </div>
                      <div className={styles.stars}>★★★★★</div>
                      <div className={styles.bookTitle}>{t('kitsuneGuuji', lang)}</div>
                      <div className={styles.bookAuthor}>{t('kitsuneAuthor', lang)}</div>
                      <div className={styles.bookPrice}>$14.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <img src="/book-fischl.png" alt="Fischl" />
                      </div>
                      <div className={styles.stars}>★★★★☆</div>
                      <div className={styles.bookTitle}>{t('fischl', lang)}</div>
                      <div className={styles.bookAuthor}>{t('fischlAuthor', lang)}</div>
                      <div className={styles.bookPrice}>$11.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={styles.bookBadge}>{t('limited', lang)}</span>
                        <img src="/book-shogun-first.png" alt="First Edition" />
                      </div>
                      <div className={styles.stars}>★★★★★</div>
                      <div className={styles.bookTitle}>{t('shogunFirst', lang)}</div>
                      <div className={styles.bookAuthor}>{t('firstEditionBonus', lang)}</div>
                      <div className={styles.bookPrice}>$38.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={`${styles.bookBadge} ${styles.new}`}>{t('new', lang)}</span>
                        <img src="/book-six-kitsune.png" alt="Shrine Daily" />
                      </div>
                      <div className={styles.stars}>★★★★☆</div>
                      <div className={styles.bookTitle}>{t('shrineDaily', lang)}</div>
                      <div className={styles.bookAuthor}>{t('shrineAuthor', lang)}</div>
                      <div className={styles.bookPrice}>$9.99</div>
                    </div>
                  </div>
                </section>

                {/* Limited editions */}
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t('limitedCollectors', lang)}</h2>
                    <span className={styles.sectionMore}>{t('seeMore', lang)}</span>
                  </div>
                  <div className={styles.bookGrid}>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={styles.bookBadge}>{t('limited', lang)}</span>
                        <img src="/book-shogun-almighty.png" alt="Box Set" />
                      </div>
                      <div className={styles.stars}>★★★★★</div>
                      <div className={styles.bookTitle}>{t('boxSet', lang)}</div>
                      <div className={styles.bookAuthor}>{t('boxSetBonus', lang)}</div>
                      <div className={styles.bookPrice}>$149.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={styles.bookBadge}>{t('limited', lang)}</span>
                        <img src="/book-kitsune-guuji.png" alt="Kitsune Deluxe" />
                      </div>
                      <div className={styles.stars}>★★★★★</div>
                      <div className={styles.bookTitle}>{t('kitsuneDeluxe', lang)}</div>
                      <div className={styles.bookAuthor}>{t('signedCopy', lang)}</div>
                      <div className={styles.bookPrice}>$79.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={styles.bookBadge}>{t('limited', lang)}</span>
                        <img src="/book-fischl.png" alt="Fischl Box" />
                      </div>
                      <div className={styles.stars}>★★★★☆</div>
                      <div className={styles.bookTitle}>{t('fischlBox', lang)}</div>
                      <div className={styles.bookAuthor}>{t('bookmarkSet', lang)}</div>
                      <div className={styles.bookPrice}>$109.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <span className={`${styles.bookBadge} ${styles.new}`}>{t('new', lang)}</span>
                        <img src="/book-generic.png" alt="Artbook" />
                      </div>
                      <div className={styles.stars}>★★★★★</div>
                      <div className={styles.bookTitle}>{t('artbook', lang)}</div>
                      <div className={styles.bookAuthor}>{t('officialIllustrator', lang)}</div>
                      <div className={styles.bookPrice}>$49.99</div>
                    </div>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCover}>
                        <img src="/book-generic.png" alt="Rare Book" />
                      </div>
                      <div className={styles.stars}>★★★★☆</div>
                      <div className={styles.bookTitle}>{t('rareBook', lang)}</div>
                      <div className={styles.bookAuthor}>{t('specialPaper', lang)}</div>
                      <div className={styles.bookPrice}>$199.99</div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarBox}>
            {user ? (
              <>
                <h3 className={styles.sidebarTitle}>Welcome Back</h3>
                <div className={styles.accountInfo}>
                  <p className={styles.accountEmail}>{user.email}</p>
                  <a href="/account" className={styles.accountLink}>My Account</a>
                  <button 
                    className={styles.logoutBtn}
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.reload();
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className={styles.sidebarTitle}>{t('memberLogin', lang)}</h3>
                <form className={styles.loginForm} onSubmit={handleSidebarLogin}>
                  {sidebarError && <div className={styles.sidebarError}>{sidebarError}</div>}
                  <input 
                    type="email" 
                    placeholder={t('email', lang)} 
                    value={sidebarEmail}
                    onChange={(e) => setSidebarEmail(e.target.value)}
                    required
                  />
                  <input 
                    type="password" 
                    placeholder={t('password', lang)}
                    value={sidebarPassword}
                    onChange={(e) => setSidebarPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className={styles.loginBtn} disabled={sidebarLoading}>
                    {sidebarLoading ? '...' : t('loginBtn', lang)}
                  </button>
                  <button type="button" className={styles.registerBtn} onClick={() => setShowRegister(true)}>{t('registerFree', lang)}</button>
                </form>
              </>
            )}
          </div>

          <div className={styles.promoBox}>
            <h3>{t('newMemberBenefits', lang)}</h3>
            <p>{t('couponPromo', lang)}</p>
            <div className={styles.promoCode}>YAESPRING</div>
          </div>

          <div className={styles.hiringBox}>
            <h3 className={styles.hiringTitle}>The Guuji seeks talented writers</h3>
            <p className={styles.hiringDesc}>Cover HoYoverse news and events for our publication. Contributors receive free merchandise and store vouchers.</p>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcW9rmgzqiSqJCJhAYXyIs3fivJOMu0jjDR7-W4V5M_yVexA/viewform" target="_blank" rel="noopener noreferrer" className={styles.hiringBtn}>Apply Now</a>
          </div>

          <div className={styles.sidebarBox}>
            <h3 className={styles.sidebarTitle}>{t('yaeNews', lang)}</h3>
            <ul className={styles.newsList}>
              <li>{t('news1', lang)}</li>
              <li>{t('news2', lang)}</li>
              <li>{t('news3', lang)}</li>
              <li>{t('news4', lang)}</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>{t('storeName', lang)} | Yae Publishing House | {t('footerLocation', lang)}</p>
          <p>Illustration: HoYoverse/COGNOSPHERE</p>
          <p className={styles.copyright}>{t('copyright', lang)}</p>
        </div>
      </footer>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>八</div>
            <div className={styles.logoText}>八重堂書店</div>
          </div>
          <button className={styles.mobileMenuClose} onClick={() => setMobileMenuOpen(false)}>×</button>
        </div>
        <nav className={styles.mobileNav}>
          <button 
            className={styles.mobileNavSearch}
            onClick={() => { setMobileMenuOpen(false); query.toggle(); }}
          >
            Search (Akasha)
          </button>
          <a href="/products" onClick={() => setMobileMenuOpen(false)}>Products</a>
          <a href="/tools/png-transparency" onClick={() => setMobileMenuOpen(false)}>PNG Tool</a>
          <a href="/sitemap" onClick={() => setMobileMenuOpen(false)}>{t('sitemap', lang)}</a>
          <a href="/contact" onClick={() => setMobileMenuOpen(false)}>{t('contact', lang)}</a>
          {user ? (
            <a href="/account" onClick={() => setMobileMenuOpen(false)}>Account</a>
          ) : (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowLogin(true); }}>{t('login', lang)}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowRegister(true); }}>{t('register', lang)}</a>
            </>
          )}
        </nav>
        {/* Mobile language selector hidden - defaults to English */}
      </div>
      <div 
        className={`${styles.mobileMenuBackdrop} ${mobileMenuOpen ? styles.mobileMenuBackdropOpen : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} lang={lang} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} lang={lang} />
      

    </div>
  );
}
