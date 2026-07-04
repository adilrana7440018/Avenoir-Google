'use client';

import { useStore, CartItem } from '@/lib/store';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  // Hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Free shipping threshold at $75
  const shippingThreshold = 75;
  const isFreeShipping = subtotal >= shippingThreshold;
  const amountToFreeShipping = shippingThreshold - subtotal;

  const discountAmount = coupon
    ? coupon.discountType === 'PERCENT'
      ? subtotal * (coupon.discountValue / 100)
      : coupon.discountValue
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'AVENOIR10') {
      applyCoupon({ code: 'AVENOIR10', discountType: 'PERCENT', discountValue: 10 });
      setPromoCode('');
    } else if (code === 'SECURE20') {
      applyCoupon({ code: 'SECURE20', discountType: 'PERCENT', discountValue: 20 });
      setPromoCode('');
    } else if (code === 'MILL50') {
      applyCoupon({ code: 'MILL50', discountType: 'FIXED', discountValue: 50 });
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 md:pl-0">
        <div className="w-screen max-w-md transform bg-bg-secondary border-l border-white/10 transition-transform duration-300 ease-out flex flex-col h-full shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold font-display tracking-tight text-white">
                Your Cart ({itemsCount})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          {cart.length > 0 && (
            <div className="px-6 py-4 bg-bg-primary/50 border-b border-white/10">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-text-secondary">
                  {isFreeShipping
                    ? '🎉 You qualify for Free Express Shipping!'
                    : `Spend $${amountToFreeShipping.toFixed(2)} more for Free Express Shipping`}
                </span>
                <span className="text-accent font-semibold">
                  ${subtotal.toFixed(2)} / ${shippingThreshold}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-white/20 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-white font-medium">Your cart is empty</p>
                  <p className="text-text-secondary text-sm">
                    Architectural protection awaits your digital devices.
                  </p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/5 hover:border-accent transition-premium mt-2"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-white/5">
                  <div className="relative w-20 h-20 bg-surface-card border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm font-medium">
                        <h3 className="text-white line-clamp-1 pr-2">{item.name}</h3>
                        <p className="text-white font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        {item.compatibility} {item.color ? ` / ${item.color}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm mt-2">
                      <div className="flex items-center border border-white/10 rounded-lg bg-bg-primary">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2.5 text-text-secondary hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-white font-mono text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2.5 text-text-secondary hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-secondary hover:text-error p-1 rounded-lg hover:bg-white/5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Summary and Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-white/10 bg-bg-primary px-6 py-6 space-y-4">
              {/* Promo code form */}
              {!coupon ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError('');
                    }}
                    className="flex-1 bg-surface-card border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent font-mono placeholder:text-text-secondary/50 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 border border-white/10 rounded-xl text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center bg-accent/10 border border-accent/20 rounded-xl px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2 text-accent">
                    <Tag className="w-4 h-4" />
                    <span className="font-mono font-bold">{coupon.code}</span>
                    <span className="text-xs">
                      (-{coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-accent hover:text-white text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoError && <p className="text-xs text-error font-medium">{promoError}</p>}

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-accent font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className="text-white font-medium">
                    {isFreeShipping ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-accent font-mono">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout buttons */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-accent hover:bg-cyan-400 text-bg-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-premium"
                >
                  <Lock className="w-4 h-4" />
                  <span>Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-xs text-text-secondary hover:text-white pt-3 transition-colors"
                >
                  Or continue shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
