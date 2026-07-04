'use server';

import db from '@/lib/db';

export async function searchProducts(query: string) {
  if (!query || query.trim() === '') return [];
  
  try {
    const products = await db.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
          { compatibility: { contains: query } },
        ],
      },
      take: 6,
    });
    return products;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getPopularProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        isFeatured: true,
      },
      take: 3,
    });
    return products;
  } catch (error) {
    console.error('Get popular error:', error);
    return [];
  }
}
