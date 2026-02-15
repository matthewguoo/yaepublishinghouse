import '../styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

const SITE_NAME = 'Yae Publishing House';
const SITE_TAGLINE = 'Grand Narukami Shrine';
const SITE_DESC = 'Welcome to Yae Publishing House — the domain of the Guuji of the Grand Narukami Shrine.';
const PROD_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yaepublishing.house';

export const metadata = {
  metadataBase: new URL(PROD_URL),
  title: `${SITE_NAME}`,
  description: SITE_DESC,
  applicationName: SITE_NAME,
  creator: 'Yae Miko',
  publisher: 'Yae Publishing House',
  category: 'personal',
  keywords: ['Yae Miko', 'Yae Publishing House', 'Narukami', 'kitsune', 'shrine'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    url: PROD_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESC,
    creator: '@pci_yae',
  },
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: PROD_URL,
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
