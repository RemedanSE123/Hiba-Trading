import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/Layout/AppLayout';
import ProductImages from '@/components/Products/ProductImages';
import ProductInfo from '@/components/Products/ProductInfo';
import ProductActions from '@/components/Products/ProductActions';
import ProductDescription from '@/components/Products/ProductDescription';
import SimilarProducts from '@/components/Products/SimilarProducts';
import { ProductWithCategory } from '@/types';

async function getProduct(slug: string): Promise<ProductWithCategory | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { 
        slug,
        isActive: true 
      },
      include: {
        category: {
          select: { name: true, slug: true }
        },
        reviews: {
          include: {
            user: {
              select: { name: true, image: true }
            }
          },
          where: {
            isReported: false
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!product) return null;

    return {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      images: JSON.parse(product.images) as string[],
      features: JSON.parse(product.features) as string[],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getSimilarProducts(categoryId: string, currentProductId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        stock: { gt: 0 },
        id: { not: currentProductId }
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
    console.error('Error fetching similar products:', error);
    return [];
  }
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.categoryId, product.id);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>›</span>
          <a href="/categories" className="hover:text-gray-700">Categories</a>
          <span>›</span>
          <a href={`/categories/${product.category.slug}`} className="hover:text-gray-700">
            {product.category.name}
          </a>
          <span>›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <ProductImages product={product} />
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <ProductInfo product={product} />
            <ProductActions product={product} />
          </div>
        </div>

        {/* Product Description & Details */}
        <div className="mt-12">
          <ProductDescription product={product} />
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <SimilarProducts products={similarProducts} currentProduct={product} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Generate static params for popular products
export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      select: {
        slug: true
      },
      take: 50
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    return [];
  }
}