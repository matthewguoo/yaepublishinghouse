'use client';

import { Lang, t } from './translations';
import styles from './SiteLayout.module.css';

interface SiteFooterProps {
  lang: Lang;
}

export default function SiteFooter({ lang }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>{t('storeName', lang)} | Yae Publishing House | {t('footerLocation', lang)}</p>
        <p>Illustration: HoYoverse/COGNOSPHERE</p>
        <p className={styles.copyright}>{t('copyright', lang)}</p>
      </div>
    </footer>
  );
}
