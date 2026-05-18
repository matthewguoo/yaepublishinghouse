import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shop Anime Collectibles - Limited Edition PCB Keychains & Merch",
  description: "Browse exclusive anime collectibles and serialized PCB keychains. Star Rail Nameless Honor Pass, Genshin accessories, and more. Each piece numbered and limited. Free worldwide shipping.",
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
    description: "Exclusive serialized PCB keychains and anime merch. Nameless Honor Pass available now. Free shipping.",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
