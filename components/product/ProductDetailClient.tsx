'use client';

import { useStore } from '@/lib/store';
import { Heart, Star, Truck, ShieldCheck, HelpCircle, Check, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface Variant {
  id: string;
  color: string;
  colorHex: string;
  priceModifier: number;
  stock: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date | string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  description: string;
  details: string;
  category: string;
  image: string;
  hoverImage?: string | null;
  images: string; // JSON string array
  rating: number;
  reviewsCount: number;
  stock: number;
  specs: string; // JSON string
  compatibility: string; // comma-separated
  variants: Variant[];
  reviews: Review[];
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: any[];
}

const categoryMap: Record<string, string> = {
  cases: 'Phone Cases',
  chargers: 'GaN Chargers',
  cables: 'Braided Cables',
  audio: 'AirPods Shells',
  protectors: 'Screen Glass',
  accessories: 'MagSafe Accessories',
  all: 'All Hardware',
};

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem, wishlist, toggleWishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  
  // Gallery state
  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images || '[]');
    if (!Array.isArray(imageList)) {
      imageList = [];
    }
  } catch (e) {
    console.error('Failed to parse product.images:', e);
  }
  const allImages = [product.image, ...imageList].filter(Boolean);
  const [activeImage, setActiveImage] = useState(allImages[0] || product.image);
  
  // Custom Zoom State
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // Selected Options
  const compatOptions = (product.compatibility || '').split(',').map((c) => c.trim()).filter(Boolean);
  const [selectedDevice, setSelectedDevice] = useState(compatOptions[0] || '');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    (product.variants && product.variants[0]) || null
  );
  const [quantity, setQuantity] = useState(1);

  // Sticky Buy Bar scroll trigger
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (!ctaRef.current) return;
      const ctaBottom = ctaRef.current.getBoundingClientRect().bottom;
      // Show sticky bar once main CTA is out of view (scrolled above viewport)
      setShowStickyBar(ctaBottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  const isWishlisted = wishlist && Array.isArray(wishlist) && wishlist.includes(product.id);
  const basePrice = product.discountPrice || product.price;
  const priceModifier = selectedVariant ? selectedVariant.priceModifier : 0;
  const currentPrice = basePrice + priceModifier;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      compatibility: selectedDevice,
      color: selectedVariant?.color,
      colorHex: selectedVariant?.colorHex,
    });
  };

  // Mock Delivery Dates
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 4);
  const deliveryString = `Arrives: ${deliveryStart.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${deliveryEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (Express)`;

  // Spec list parsing
  let specsObj: Record<string, string> = {};
  try {
    specsObj = JSON.parse(product.specs || '{}');
    if (typeof specsObj !== 'object' || specsObj === null) {
      specsObj = {};
    }
  } catch (e) {
    console.error('Failed to parse product.specs:', e);
  }

  const faqs = [
    {
      q: 'Does this product support magnetic wireless charging (MagSafe)?',
      a: 'Yes. All Avenoir cases, wallets, and stands feature premium N52 NdFeB rare-earth magnet configurations designed to deliver optimal charging speeds and stable physical alignment.',
    },
    {
      q: 'What does the Monolithic Warranty cover?',
      a: 'It covers everything. If your case breaks, cracks, or loses structural integrity during normal physical operations, Avenoir replaces it under a lifetime replacement contract.',
    },
  ];

  // Image Zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <div className="bg-bg-base min-h-screen py-10 md:py-16 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
          <Link href="/" className="hover:text-text-primary transition-colors">HOME</Link>
          <span>/</span>
          <Link href={`/products/${product.category}`} className="hover:text-text-primary uppercase transition-colors">
            {categoryMap[product.category] || product.category}
          </Link>
          <span>/</span>
          <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery - Column 7 */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main view with zoom */}
            <div
              className="relative aspect-square w-full bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden cursor-zoom-in shadow-sm"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
                priority
              />
              {/* Zoom Overlay panel */}
              <div
                className="absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-150"
                style={{
                  ...zoomStyle,
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: '200%',
                }}
              />
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border bg-bg-surface flex-shrink-0 transition-premium ${
                      activeImage === img ? 'border-accent-primary ring-1 ring-accent-primary' : 'border-border-subtle opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Product view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & CTA Panel - Column 5 */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold text-accent-primary font-mono tracking-widest bg-accent-primary-soft px-3 py-1 rounded-full border border-accent-primary/20 w-fit block">
                {categoryMap[product.category] || product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-text-primary leading-tight">
                {product.name}
              </h1>

              {/* Price and Ratings */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-2xl font-bold text-accent-primary font-mono">
                        ${currentPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-text-secondary line-through font-mono">
                        ${(product.price + priceModifier).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-text-primary font-mono">
                      ${currentPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="h-4 w-px bg-border-subtle" />
                <div className="flex items-center gap-1.5">
                  <div className="flex text-accent-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-accent-primary' : 'opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-text-primary font-mono">{product.rating}</span>
                  <span className="text-xs text-text-secondary">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Config options */}
            <div className="space-y-6 pt-6 border-t border-border-subtle">
              {/* Compatibility Dropdown */}
              {compatOptions.length > 0 && compatOptions[0] !== '' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                    Select Hardware Model
                  </label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full bg-bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary font-display cursor-pointer"
                  >
                    {compatOptions.map((device) => (
                      <option key={device} value={device}>
                        {device}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color swatches */}
              {product.variants.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider font-mono">
                    <span className="text-text-secondary">Colorway</span>
                    <span className="text-text-primary font-medium">{selectedVariant?.color}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`group relative p-1 rounded-full border transition-premium flex items-center justify-center ${
                          selectedVariant?.id === variant.id ? 'border-accent-primary' : 'border-border-subtle hover:border-text-tertiary'
                        }`}
                        aria-label={`Select color ${variant.color}`}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center"
                          style={{ backgroundColor: variant.colorHex }}
                        >
                          {selectedVariant?.id === variant.id && (
                            <Check className={`w-4 h-4 ${variant.colorHex === '#FFFFFF' ? 'text-text-primary' : 'text-white'}`} />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Stock indicator */}
            <div className="space-y-3 p-4 bg-bg-surface border border-border-subtle rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-text-primary font-semibold">In Stock</span>
                <span className="text-text-secondary">&bull; Shipped from Monolith depot</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Truck className="w-3.5 h-3.5 text-accent-primary" />
                <span>{deliveryString}</span>
              </div>
            </div>

            {/* CTA Buy Area */}
            <div ref={ctaRef} className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="flex items-center border border-border-subtle rounded-xl bg-bg-surface overflow-hidden h-14">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 px-4 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-text-primary font-mono text-sm w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 px-4 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-premium shadow-md"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Configure Armory</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 border rounded-xl transition-premium ${
                    isWishlisted
                      ? 'bg-accent-primary-soft border-accent-primary/30 text-accent-primary'
                      : 'bg-bg-surface border-border-subtle hover:bg-bg-elevated hover:border-text-tertiary text-text-secondary hover:text-text-primary'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-accent-primary' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical specs - Bento grids */}
        <section className="py-12 border-t border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-3">
            <h3 className="text-xs uppercase font-bold text-accent-primary font-mono tracking-widest">
              Technical Specifications
            </h3>
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-text-primary">
              Raw Engineering Metrics
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Milled exactly to physical constraints. We utilize structural carbon composites and N52 neodymium matrices to deliver verified specifications.
            </p>
          </div>
          <div className="md:col-span-2 bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(specsObj).map(([key, val]: [string, any]) => (
                <div key={key} className="flex justify-between py-3 border-b border-border-subtle text-xs">
                  <span className="text-text-secondary font-mono uppercase tracking-wider">{key}</span>
                  <span className="text-text-primary font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Modules */}
        <section className="py-12 border-t border-border-subtle space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold text-accent-primary font-mono tracking-widest">
                Customer Feed
              </h3>
              <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-text-primary">
                Verified Verification Reviews
              </h2>
            </div>
            <span className="text-xs text-text-secondary">({product.reviews.length} total)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.length === 0 ? (
              <p className="text-xs text-text-secondary italic">No reviews compiled for this accessory yet.</p>
            ) : (
              product.reviews.map((r) => (
                <div key={r.id} className="bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primary">{r.userName}</span>
                    <span className="bg-accent-primary-soft text-accent-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex text-accent-primary gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent-primary" />
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-t border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-accent-primary font-mono tracking-widest">
              Need Verification?
            </h3>
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-text-primary">
              Tactile FAQ
            </h2>
          </div>
          <div className="md:col-span-2 space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-2 border-b border-border-subtle pb-4">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent-primary" />
                  {faq.q}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 border-t border-border-subtle space-y-8">
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-text-primary text-center md:text-left">
              Complete Your Loadout
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Buy-Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-bg-surface/95 backdrop-blur-md border-t border-border-subtle py-3.5 px-6 animate-fade-in shadow-2xl flex items-center justify-between pb-safe-bottom">
          <div className="flex items-center gap-4 min-w-0 pr-4">
            <div className="relative w-12 h-12 bg-bg-surface border border-border-subtle rounded-xl overflow-hidden flex-shrink-0 hidden sm:block">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="50px"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-text-primary truncate leading-tight">{product.name}</h4>
              <p className="text-[10px] text-text-secondary mt-0.5 truncate">
                {selectedDevice} {selectedVariant ? ` / ${selectedVariant.color}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-base font-bold font-mono text-accent-primary hidden sm:inline-block">
              ${currentPrice.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-accent-primary hover:bg-accent-primary/95 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-1.5 transition-premium shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Loadout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
