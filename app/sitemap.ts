import { MetadataRoute } from 'next';
import db from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://avenoir.com';
  
  // Static paths
  const routes = ['', '/account', '/checkout', '/admin'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Fetch dynamic categories
  const categories = ['cases', 'chargers', 'cables', 'audio', 'protectors', 'accessories'];
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/products/${cat}`,
    lastModified: new Date(),
  }));

  // Fetch dynamic products from SQLite
  try {
    const products = await db.product.findMany();
    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.category}/${p.slug}`,
      lastModified: new Date(p.createdAt),
    }));
    return [...routes, ...categoryRoutes, ...productRoutes];
  } catch (e) {
    console.error('Sitemap generator error:', e);
    return [...routes, ...categoryRoutes];
  }
}
