import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/Layout/AppLayout';
import ProductGrid from '@/components/Products/ProductGrid';
import CategoryGrid from '@/components/Categories/CategoryGrid';
import PromotionCarousel from '@/components/Promotion/PromotionCarousel';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
        stock: { gt: 0 }
      },
      include: {
        category: {
          select: { name: true }
        }
      },
      take: 8,
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
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      take: 6,
      orderBy: {
        sortOrder: 'asc'
      }
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Promotion Carousel */}
        <section className="mb-8">
          <PromotionCarousel />
        </section>

        {/* Categories Grid */}
        <section className="mb-12 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <a href="/categories" className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </a>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Featured Products */}
        <section className="mb-12 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <a href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </a>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        {/* New Arrivals */}
        <section className="mb-12 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">New Arrivals</h2>
          <ProductGrid products={featuredProducts.slice(0, 4)} />
        </section>
      </div>
    </AppLayout>
  );
}