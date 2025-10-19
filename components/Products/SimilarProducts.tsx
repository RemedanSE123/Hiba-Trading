import { ProductWithCategory } from '@/types';
import ProductCard from './ProductCard';

interface SimilarProductsProps {
  products: ProductWithCategory[];
  currentProduct: ProductWithCategory;
}

export default function SimilarProducts({ products, currentProduct }: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}