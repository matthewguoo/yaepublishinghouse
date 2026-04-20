import { SpeedInsights } from '@vercel/speed-insights/next';
import { Dela_Gothic_One, Yomogi, Zen_Kaku_Gothic_New } from 'next/font/google';
import '../styles/globals.css';

const display = Dela_Gothic_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const body = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

const scribble = Yomogi({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-scribble',
});

const SITE_NAME = 'Yae Publishing House';
const SITE_DESC = 'Cute profile pages for cosplayers. Claim your cute page, drop your socials, and show off the characters you love.';
const PROD_URL = process.env.NEXTAUTH_URL || 'https://yaepublishing.house';

export const metadata = {
  metadataBase: new URL(PROD_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ['cosplayer profile', 'link in bio', 'anime cosplay', 'Yae Publishing House'],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    url: PROD_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESC,
    url: PROD_URL,
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${scribble.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
