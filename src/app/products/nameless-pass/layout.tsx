import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nameless Honor Pass - Star Rail Collectible | Limited to 2,158 Units",
  description: "Own a piece of Trailblaze history. Real gold ENIG finish commemorating the Nameless. Serialized 0001-2158. Only 2,158 will ever exist.",
  keywords: [
    "nameless honor pass",
    "star rail keychain",
    "star rail merch",
    "honkai star rail collectible",
    "star rail keychain",
    "limited edition keychain",
    "trailblazer merch",
    "astral express",
    "serialized collectible",
    "gold collectible",
    "anime keychain"
  ],
  openGraph: {
    title: "Nameless Honor Pass - Limited Edition Star Rail Collectible",
    description: "Own a piece of Trailblaze history. Serialized 0001-2158. Only 2,158 will ever exist.",
    images: ["/nameless-pass.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nameless Honor Pass - Star Rail Collectible",
    description: "Limited to 2,158 units. Real gold ENIG finish. Serialized. Free shipping.",
    images: ["/nameless-pass.png"],
  },
};

export default function NamelessPassLayout({ children }: { children: React.ReactNode }) {
  return children;
}
