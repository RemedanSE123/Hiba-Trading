import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/Layout/AppLayout';
import ProductGrid from '@/components/Products/ProductGrid';
import { ProductWithCategory } from '@/types';

async function getCategory(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { 
        slug,
        isActive: true 
      }
    });
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryProducts(categoryId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        stock: { gt: 0 }
      },
      include: {
        category: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products.map(product => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      images: JSON.parse(product.images) as string[],
      features: JSON.parse(product.features) as string[],
    }));
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, products] = await Promise.all([
    getCategory(params.slug),
    getCategoryProducts(params.slug)
  ]);

  if (!category) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>›</span>
          <a href="/categories" className="hover:text-gray-700">Categories</a>
          <span>›</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {category.description}
            </p>
          )}
          <p className="text-gray-500 mt-2">
            {products.length} products available
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No products found in this category
            </h3>
            <p className="text-gray-500 mb-6">
              Check back later for new arrivals in {category.name}
            </p>
            <a
              href="/categories"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse All Categories
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  );
}