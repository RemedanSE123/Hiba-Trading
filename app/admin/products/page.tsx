import { prisma } from '@/lib/prisma';
import AdminProductsTable from '@/components/Admin/Products/AdminProductsTable';
import ProductStats from '@/components/Admin/Products/ProductStats';
import ProductFilters from '@/components/Admin/Products/ProductFilters';

async function getProducts(filters?: { category?: string; status?: string; search?: string }) {
  try {
    const whereClause: any = {
      isActive: filters?.status !== 'inactive'
    };

    if (filters?.category && filters.category !== 'all') {
      whereClause.categoryId = filters.category;
    }

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map(product => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      images: JSON.parse(product.images) as string[],
      features: JSON.parse(product.features) as string[],
      salesCount: product._count.orderItems,
      reviewsCount: product._count.reviews,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getProductStats() {
  try {
    const [
      totalProducts,
      outOfStock,
      lowStock,
      totalRevenue
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, stock: 0 } }),
      prisma.product.count({ where: { isActive: true, stock: { lte: 5, gt: 0 } } }),
      prisma.orderItem.aggregate({
        _sum: { total: true }
      })
    ]);

    return {
      totalProducts,
      outOfStock,
      lowStock,
      totalRevenue: totalRevenue._sum.total || 0
    };
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return {
      totalProducts: 0,
      outOfStock: 0,
      lowStock: 0,
      totalRevenue: 0
    };
  }
}

interface AdminProductsPageProps {
  searchParams: {
    category?: string;
    status?: string;
    search?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const [products, categories, stats] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
    getProductStats()
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Products
          </button>
          <button 
            onClick={() => window.location.href = '/admin/products/new'}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Product Statistics */}
      <ProductStats stats={stats} />

      {/* Filters */}
      <ProductFilters categories={categories} />

      {/* Products Table */}
      <AdminProductsTable products={products} categories={categories} />
    </div>
  );
}