import '../styles/globals.css';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import Nav from '../components/nav';
import styles from '../styles/layout.module.css';

const inter = Inter({ subsets: ['latin'] });

const SITE_NAME = 'Yae Publishing House';
const SITE_TAGLINE = 'Matthew Guo Portfolio Page';
const SITE_DESC = 'Portfolio and personal site of Matthew Guo — hardware engineer, entrepreneur, and creative technologist.';
const SITE_KEYWORDS = [
  'Matthew Guo',
  'Yae Publishing House',
  'portfolio',
  'hardware engineer',
  'electronics',
  'PCB design',
  'embedded systems',
  'entrepreneur',
  'technology',
];
const PROD_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yaepublishing.house';
const DEFAULT_LOCALE = 'en-US';

export const metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: 'Matthew Guo', url: `${PROD_URL}/about` }],
  creator: 'Matthew Guo',
  publisher: 'Matthew Guo',
  category: 'personal',
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#e23a3a',
      },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matthew Guo',
    url: PROD_URL,
    sameAs: [
      'https://x.com/matthewguoo',
      'https://github.com/matthewguoo',
    ],
    description: SITE_DESC,
    jobTitle: 'Hardware Engineer',
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: PROD_URL,
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script
          id="jsonld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Nav />
        <main>{children}</main>
        <footer className={styles.footer}>
          <span>
            © Matthew Guo
            <br />
            {currentYear}
          </span>
          <span className={styles.powered}>
            · powered by vibe coding and some free AWS credits on a wrapper service
          </span>
        </footer>
      </body>
    </html>
  );
}
