// Image optimization configuration
export const imageConfig = {
  domains: ['localhost', 'hiba-ecommerce.vercel.app'],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
};

// Database query optimization
export const queryConfig = {
  productList: {
    take: 20,
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      slug: true,
      stock: true,
      category: { select: { name: true } }
    }
  },
  orderList: {
    take: 10,
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { 
        take: 2,
        include: { 
          product: { select: { name: true } } 
        } 
      }
    }
  }
};

// Cache configuration
export const cacheConfig = {
  revalidate: 60, // 1 minute
  productPage: 300, // 5 minutes
  categoryPage: 600, // 10 minutes
};