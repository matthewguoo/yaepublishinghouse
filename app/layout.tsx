import { SpeedInsights } from '@vercel/speed-insights/next';
import { Caveat, Kalam, Newsreader, Patrick_Hand } from 'next/font/google';
import '../styles/globals.css';

const body = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

const note = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-note',
});

const scribble = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-scribble',
});

const marker = Caveat({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-marker',
});

const SITE_NAME = 'Yae Publishing House';
const SITE_DESC = 'handmade little profile pages for cosplay photos, handles, and whatever else you want to pin up.';
const PROD_URL = process.env.NEXTAUTH_URL || 'https://yaepublishing.house';

export const metadata = {
  metadataBase: new URL(PROD_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ['cosplay page', 'scrapbook profile', 'anime cosplay', 'Yae Publishing House'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESC,
    url: PROD_URL,
  };

  return (
    <html lang="en" className={`${body.variable} ${note.variable} ${scribble.variable} ${marker.variable}`}>
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
