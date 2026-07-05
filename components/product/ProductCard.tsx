'use client';

import { useStore } from '@/lib/store';
import { Heart, ShoppingBag, Star, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface ProductCardProps {
  product: {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, wishlist, toggleWishlist } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-3 sm:p-4 space-y-3 aspect-[4/5] animate-pulse">
        <div className="bg-bg-elevated rounded-xl w-full aspect-[4/5]" />
        <div className="h-4 bg-bg-elevated rounded w-3/4" />
        <div className="h-3 bg-bg-elevated rounded w-1/2" />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/products/${product.category}/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      compatibility: product.compatibility.split(',')[0],
    });
  };

  // Category mapping
  const categoryNames: Record<string, string> = {
    cases: 'Phone Cases',
    chargers: 'Chargers',
    cables: 'Cables',
    audio: 'AirPods Cases',
    protectors: 'Screen Protectors',
    accessories: 'Accessories',
  };

  const displayCategory = categoryNames[product.category] || product.category;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="group relative bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-md cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-accent-primary text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-accent-secondary text-white text-[8px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Shield className="w-2.5 h-2.5" /> Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm transition-colors text-text-secondary hover:text-accent-primary`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'text-accent-primary fill-accent-primary' : ''}`} />
      </button>

      {/* Image Container (Strict 4:5 Aspect Ratio) */}
      <Link
        href={`/products/${product.category}/${product.slug}`}
        className="block relative w-full aspect-[4/5] bg-bg-elevated overflow-hidden border-b border-border-subtle"
      >
        <Image
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 scale-100 group-hover:scale-102"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 250px"
          priority={product.isFeatured}
        />
      </Link>

      {/* Details Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-accent-secondary block mb-1">
            {displayCategory}
          </span>
          <Link href={`/products/${product.category}/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </Link>
          <div className="text-[10px] text-text-secondary line-clamp-1">
            {product.compatibility}
          </div>
          <p className="text-[11px] text-text-secondary line-clamp-2 hidden sm:block mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border-subtle mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              {product.discountPrice ? (
                <>
                  <span className="text-sm font-semibold text-text-primary">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-text-tertiary line-through ml-1.5">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-text-primary">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1 text-[10px] text-text-secondary">
              <Star className="w-3 h-3 text-accent-warm fill-accent-warm" />
              <span className="font-medium text-text-primary">{product.rating}</span>
              <span className="text-text-tertiary">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="p-2 bg-accent-primary text-white rounded-xl hover:opacity-90 transition-all duration-300"
            aria-label="Add to bag"
          >
            <ShoppingCartWrapper />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Small helper inside card
function ShoppingCartWrapper() {
  return <ShoppingBag className="w-3.5 h-3.5" />;
}
