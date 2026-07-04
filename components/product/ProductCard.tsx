'use client';

import { useStore } from '@/lib/store';
import { Heart, ShoppingBag, Star, Shield } from 'lucide-react';
import Link from 'next/link';
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
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-3 sm:p-4 space-y-3 aspect-[4/5] animate-pulse">
        <div className="bg-bg-elevated rounded-2xl w-full aspect-[4/5]" />
        <div className="h-4 bg-bg-elevated rounded w-3/4" />
        <div className="h-3 bg-bg-elevated rounded w-1/2" />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      compatibility: product.compatibility.split(',')[0],
    });
  };

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-md hover:border-accent-primary/20 cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent > 0 && (
          <span className="bg-error text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-accent-primary-soft border border-accent-primary/20 text-accent-primary text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Shield className="w-2.5 h-2.5" /> Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-2xl border transition-all duration-300 ${
          isWishlisted
            ? 'bg-accent-primary-soft border-accent-primary/30 text-accent-primary'
            : 'bg-white/90 border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-tertiary backdrop-blur-sm'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-accent-primary' : ''}`} />
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
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-text-tertiary font-mono tracking-widest block">
            {product.category === 'cases' ? 'Phone Cases' :
             product.category === 'chargers' ? 'GaN Chargers' :
             product.category === 'cables' ? 'Braided Cables' :
             product.category === 'audio' ? 'AirPods Shells' :
             product.category === 'protectors' ? 'Screen Glass' :
             product.category === 'accessories' ? 'MagSafe Accessories' : product.category}
          </span>
          <Link href={`/products/${product.category}/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </Link>
          <div className="text-[9px] font-mono text-accent-secondary uppercase tracking-widest line-clamp-1">
            Fits: {product.compatibility}
          </div>
          <p className="text-[11px] sm:text-xs text-text-secondary line-clamp-2 min-h-8 hidden sm:block leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border-subtle mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              {product.discountPrice ? (
                <>
                  <span className="text-xs sm:text-sm font-bold text-accent-primary font-mono">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-text-tertiary line-through font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xs sm:text-sm font-bold text-text-primary font-mono">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 mt-0.5 text-[9px] sm:text-[10px] text-text-secondary">
              <Star className="w-2.5 h-2.5 text-accent-warm fill-accent-warm" />
              <span className="font-semibold text-text-primary font-mono">{product.rating}</span>
              <span className="text-text-tertiary">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="p-2 sm:p-2.5 bg-bg-elevated hover:bg-accent-primary text-text-primary hover:text-white border border-border-subtle hover:border-accent-primary rounded-xl transition-all duration-300"
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
