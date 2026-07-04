'use server';

import db from '@/lib/db';

export async function getUserOrders(email: string) {
  try {
    const orders = await db.order.findMany({
      where: { customerEmail: email },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          category: item.product.category,
          slug: item.product.slug,
        },
      })),
    }));
  } catch (error) {
    console.error('Fetch orders error:', error);
    return [];
  }
}

export async function getWishlistProducts(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  try {
    const products = await db.product.findMany({
      where: {
        id: { in: ids },
      },
    });
    return products;
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    return [];
  }
}
