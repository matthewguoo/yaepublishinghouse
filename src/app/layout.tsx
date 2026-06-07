import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Ma_Shan_Zheng, Inter } from "next/font/google";
import SearchProvider from "@/components/SearchProvider";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  weight: ["400", "600", "700"],
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  variable: "--font-ma-shan-zheng",
  weight: "400",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yae Publishing House",
    template: "%s | Yae Publishing House",
  },
  description: "The official storefront of Yae Publishing House. Limited edition collectibles, editorial coverage of HoYoverse events, and tools for creators.",
  keywords: [
    "star rail merch",
    "genshin impact merch", 
    "honkai merch",
    "anime collectibles",
    "anime keychain",
    "limited edition anime",
    "hoyo merch",
    "nameless honor pass",
    "anime accessories",
    "otaku collectibles",
    "free png tool",
    "background remover",
    "anime gifts",
    "weeb merch",
    "gacha merch"
  ],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL("https://yaepublishing.house"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yae Publishing House",
    description: "The official storefront of Yae Publishing House. Limited edition collectibles, editorial coverage, and tools for creators.",
    siteName: "Yae Publishing House",
    type: "website",
    locale: "en_US",
    url: "https://yaepublishing.house",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 640,
        alt: "八重書店 - Yae Publishing House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yae Publishing House",
    description: "Limited edition anime collectibles & free tools. Star Rail Nameless Pass available. Free shipping.",
    creator: "@pci_yae",
    site: "@pci_yae",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google": "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" translate="no">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable} ${maShanZheng.variable} ${inter.variable}`}>
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
