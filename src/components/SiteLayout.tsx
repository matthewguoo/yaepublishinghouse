'use client';

import { useState, createContext, useContext } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { Lang } from './translations';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({ lang: 'ja', setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div style={{ 
        fontFamily: "'Noto Sans JP', sans-serif",
        background: '#f5f5f0',
        color: '#333',
        fontSize: '14px',
        lineHeight: 1.6,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <SiteHeader lang={lang} setLang={setLang} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <SiteFooter lang={lang} />
      </div>
    </LangContext.Provider>
  );
}
