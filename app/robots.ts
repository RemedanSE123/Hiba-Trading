import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/', '/orders/'],
    },
    sitemap: 'https://hiba-ecommerce.vercel.app/sitemap.xml',
  };
}