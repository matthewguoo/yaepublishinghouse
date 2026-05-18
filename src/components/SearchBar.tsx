'use client';

import { useKBar } from 'kbar';
import { Lang, t } from './translations';
import styles from './YaeBookstore.module.css';

interface SearchBarProps {
  lang: Lang;
}

export default function SearchBar({ lang }: SearchBarProps) {
  const { query } = useKBar();

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInner}>
        <select className={styles.searchSelect}>
          <option>{t('allProducts', lang)}</option>
          <option>{t('lightNovels', lang)}</option>
          <option>{t('limitedEdition', lang)}</option>
          <option>{t('goods', lang)}</option>
        </select>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder={t('searchPlaceholder', lang)}
          onFocus={() => query.toggle()}
          readOnly
          style={{ cursor: 'pointer' }}
        />
        <button 
          className={styles.searchBtn}
          onClick={() => query.toggle()}
        >
          {t('search', lang)}
        </button>
      </div>
    </div>
  );
}
