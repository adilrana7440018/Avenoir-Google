'use client';

import { useStore } from '@/lib/store';
import { Heart, ShoppingCart, Star, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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
      <div className="bg-surface-card border border-white/10 rounded-2xl p-4 space-y-4 animate-pulse">
        <div className="bg-white/5 aspect-square rounded-xl w-full" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-8 bg-white/5 rounded-lg w-8" />
        </div>
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
      compatibility: product.compatibility.split(',')[0], // Default to first listed device
    });
  };

  return (
    <div
      className="group relative bg-surface-card border border-white/10 rounded-2xl overflow-hidden transition-premium hover:-translate-y-1.5 flex flex-col h-full hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(34,211,238,0.08)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges and Wishlist */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discountPercent > 0 && (
          <span className="bg-error text-white text-[10px] font-bold px-2 py-1 rounded-full font-mono">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-accent/20 border border-accent/40 text-accent text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
            <Shield className="w-2.5 h-2.5" /> MONOLITH
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        className={`absolute top-4 right-4 z-10 p-2 rounded-xl border transition-premium ${
          isWishlisted
            ? 'bg-accent/10 border-accent/30 text-accent'
            : 'bg-black/40 border-white/10 text-text-secondary hover:text-white hover:border-white/20 backdrop-blur-sm'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-accent' : ''}`} />
      </button>

      {/* Image Container */}
      <Link href={`/products/${product.category}/${product.slug}`} className="block relative aspect-square bg-bg-primary/50 overflow-hidden">
        <Image
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 250px"
          priority={product.isFeatured}
        />
      </Link>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-wider">
            {product.category}
          </span>
          <Link href={`/products/${product.category}/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary line-clamp-2 min-h-8">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              {product.discountPrice ? (
                <>
                  <span className="text-sm font-bold text-accent font-mono">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-text-secondary line-through font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-white font-mono">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1 text-[10px] text-text-secondary">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="font-semibold text-white font-mono">{product.rating}</span>
              <span>({product.reviewsCount})</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-3 bg-white/5 hover:bg-accent hover:text-bg-primary border border-white/10 hover:border-accent rounded-xl transition-premium group/btn"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
