import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Announcing the Nameless Honor Pass - Star Rail Limited Edition Drop",
  description: "The Nameless Honor Pass is here. Limited to 2,158 serialized units with real gold ENIG finish. Commemorating the Penacony incident and Year 2158 of the Trailblaze. Pre-order now.",
  keywords: [
    "nameless honor pass announcement",
    "star rail new merch",
    "honkai star rail drop",
    "limited edition release",
    "collectible drop",
    "trailblazer collectible",
    "penacony merch"
  ],
  openGraph: {
    title: "Nameless Honor Pass - Limited Drop Announcement",
    description: "2,158 serialized units. Real gold finish. Pre-order the Nameless Honor Pass now.",
    images: ["/banner-ipc.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nameless Honor Pass - Limited Drop",
    description: "2,158 units. Real gold ENIG. Pre-order now.",
    images: ["/banner-ipc.png"],
  },
};

export default function AnnouncementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
