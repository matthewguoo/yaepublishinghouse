import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free PNG Background Remover - No Signup Required",
  description: "Remove backgrounds from PNG images instantly. Free online tool, no watermarks, no signup, no upload limits. Client-side processing - your images never leave your device. Make any color transparent in seconds.",
  keywords: [
    "png transparent",
    "remove background",
    "free background remover", 
    "png transparency maker",
    "make background transparent",
    "remove white background",
    "transparent png maker",
    "free image tool",
    "no watermark",
    "online png editor",
    "background eraser",
    "color to transparent",
    "instant background removal",
    "privacy-friendly",
    "client-side processing"
  ],
  openGraph: {
    title: "Free PNG Background Remover",
    description: "Remove backgrounds instantly. No signup, no watermarks, no limits. 100% free.",
  },
};

export default function PngToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
