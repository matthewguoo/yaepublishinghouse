'use client';

import { useState } from 'react';
import { useKBar } from 'kbar';
import { Lang, t } from './translations';
import styles from './SiteLayout.module.css';
import { useUser } from '@/hooks/useUser';

interface SiteHeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export default function SiteHeader({ lang, setLang }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { query } = useKBar();
  const { user } = useUser();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>八</div>
            <div>
              <div className={styles.logoText}>八重堂書店</div>
              <div className={styles.logoSub}>YAE PUBLISHING HOUSE</div>
            </div>
          </a>
          <div className={styles.headerRight}>
            <div className={styles.langSelector}>
              <button 
                className={`${styles.langBtn} ${lang === 'ja' ? styles.active : ''}`}
                onClick={() => setLang('ja')}
              >
                JP
              </button>
              <button 
                className={`${styles.langBtn} ${lang === 'zh' ? styles.active : ''}`}
                onClick={() => setLang('zh')}
              >
                CN
              </button>
              <button 
                className={`${styles.langBtn} ${lang === 'en' ? styles.active : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
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
                  <a href="#">{t('register', lang)}</a>
                  <a href="#">{t('login', lang)}</a>
                </>
              )}
            </div>
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <nav className={styles.mobileMenu}>
            <button 
              className={styles.mobileMenuSearch}
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
                <a href="#" onClick={() => setMobileMenuOpen(false)}>{t('register', lang)}</a>
                <a href="#" onClick={() => setMobileMenuOpen(false)}>{t('login', lang)}</a>
              </>
            )}
          </nav>
        )}
      </header>


    </>
  );
}
