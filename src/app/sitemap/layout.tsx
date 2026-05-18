import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sitemap - All Pages & Products",
  description: "Navigate Yae Publishing House. Find all products, tools, news articles, and pages. Quick links to everything on our site.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
