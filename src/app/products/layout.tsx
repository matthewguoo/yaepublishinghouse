import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shop Anime Collectibles - Limited Edition PCB Keychains & Merch",
  description: "Browse limited edition collectibles from Yae Publishing House. Serialized and numbered pieces commemorating moments across the stars.",
  keywords: [
    "anime collectibles shop",
    "pcb keychain",
    "star rail merchandise",
    "genshin merch",
    "limited edition anime",
    "serialized collectibles",
    "honkai merch",
    "anime keychains",
    "otaku gifts",
    "hoyo merchandise"
  ],
  openGraph: {
    title: "Shop Limited Edition Anime Collectibles",
    description: "Limited edition collectibles from Yae Publishing House. Serialized pieces commemorating moments across the stars.",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
