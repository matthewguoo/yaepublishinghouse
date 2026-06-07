import { notFound } from 'next/navigation';
import ProductTemplate from '@/components/ProductTemplate';
import { getProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductTemplate product={product} />;
}
