'use client';

import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  category: string;
  image: string;
  hoverImage?: string | null;
  rating: number;
  reviewsCount: number;
  compatibility: string;
  isFeatured: boolean;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
};

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-bg-surface border border-border-subtle rounded-3xl p-3 sm:p-4 space-y-3 aspect-[4/5] animate-pulse"
          >
            <div className="bg-bg-elevated rounded-2xl w-full aspect-[4/5]" />
            <div className="h-4 bg-bg-elevated rounded w-3/4" />
            <div className="h-3 bg-bg-elevated rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border-subtle rounded-3xl p-16 text-center space-y-3 bg-bg-surface">
        <p className="text-text-primary font-bold text-base">No Components Mapped</p>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          We couldn&apos;t locate any inventory items matching your selected compatibility parameters or category filters.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
