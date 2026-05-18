import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Ma_Shan_Zheng } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Yae Publishing House | 八重堂書店 - Anime Collectibles & Free Tools",
    template: "%s | Yae Publishing House",
  },
  description: "Shop limited edition anime collectibles, serialized PCB keychains, and use free creator tools. Star Rail Nameless Honor Pass now available. Free shipping on all orders.",
  keywords: [
    "star rail merch",
    "genshin impact merch", 
    "honkai merch",
    "anime collectibles",
    "pcb keychain",
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
    title: "Yae Publishing House | 八重堂書店",
    description: "Limited edition anime collectibles, serialized PCB keychains, and free creator tools. Star Rail Nameless Pass available now. Free shipping.",
    siteName: "Yae Publishing House",
    type: "website",
    locale: "en_US",
    url: "https://yaepublishing.house",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yae Publishing House | 八重堂書店",
    description: "Limited edition anime collectibles & free tools. Star Rail Nameless Pass available. Free shipping.",
    creator: "@pci_yae",
    site: "@pci_yae",
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
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable} ${maShanZheng.variable}`}>
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
