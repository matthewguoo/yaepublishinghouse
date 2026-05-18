import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Customer Support & Business Inquiries",
  description: "Get in touch with Yae Publishing House. Customer support for orders and shipping. Business inquiries for wholesale and collaborations. Fast response within 1-2 business days.",
  openGraph: {
    title: "Contact Yae Publishing House",
    description: "Customer support, business inquiries, and wholesale orders. We respond within 1-2 business days.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
