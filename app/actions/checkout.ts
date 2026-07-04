'use server';

import db from '@/lib/db';

interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
    variantId?: string;
  }[];
}

export async function createOrder(input: CheckoutInput) {
  try {
    // 1. Create the order
    const order = await db.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        shippingAddress: JSON.stringify(input.shippingAddress),
        total: input.total,
        status: 'PROCESSING',
        paymentIntentId: 'ch_' + Math.random().toString(36).substring(2, 15),
      },
    });

    // 2. Create the order items and decrement product stock
    for (const item of input.items) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          price: item.price,
        },
      });

      // Decrement main product stock
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      // If variant exists, decrement variant stock
      if (item.variantId) {
        await db.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Checkout error:', error);
    return { success: false, error: 'Database reservation failed' };
  }
}
