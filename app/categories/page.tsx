import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/Layout/AppLayout';
import CategoryGrid from '@/components/Categories/CategoryGrid';

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        products: {
          where: {
            isActive: true,
            stock: { gt: 0 }
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return categories.map(category => ({
      ...category,
      productCount: category.products.length
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <CategoryGrid categories={categories} />

        {/* Stats */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                100%
              </div>
              <div className="text-gray-600">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}