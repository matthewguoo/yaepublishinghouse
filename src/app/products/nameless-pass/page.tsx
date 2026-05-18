'use client';

import ProductTemplate from '@/components/ProductTemplate';
import { getProduct } from '@/lib/products';

const product = getProduct('nameless-pass')!;

export default function NamelessPassPage() {
  return <ProductTemplate product={product} />;
}
