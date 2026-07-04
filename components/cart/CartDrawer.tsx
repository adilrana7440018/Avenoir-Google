'use client';

import { useStore } from '@/lib/store';
import { usePaddle } from './PaddleContext';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, Gift, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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

  const { checkout } = usePaddle();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'PERCENT') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Free shipping tracker ($100 threshold)
  const shippingThreshold = 100;
  const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);
  const remainingForFree = Math.max(0, shippingThreshold - subtotal);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoInput.trim().toUpperCase() === 'AURA10') {
      applyCoupon({
        code: 'AURA10',
        discountType: 'PERCENT',
        discountValue: 10,
      });
      setPromoInput('');
    } else if (promoInput.trim().toUpperCase() === 'FREE20') {
      applyCoupon({
        code: 'FREE20',
        discountType: 'FIXED',
        discountValue: 20,
      });
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon manifest code');
    }
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    checkout(cart, finalTotal);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-text-primary/10 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-bg-surface border-l border-border-subtle flex flex-col shadow-md"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-primary font-bold">
                  <ShoppingBag className="w-4.5 h-4.5 text-accent-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-wider">
                    Locker Loadout
                  </h2>
                  <span className="text-xs bg-bg-elevated px-2 py-0.5 rounded-full font-mono text-text-secondary font-semibold">
                    {cartCount}
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Free Shipping Tracker */}
              {cart.length > 0 && (
                <div className="bg-bg-elevated/40 border-b border-border-subtle px-6 py-4.5 space-y-2">
                  <div className="flex justify-between text-[11px] text-text-secondary">
                    {remainingForFree > 0 ? (
                      <span>
                        Add <span className="font-mono text-accent-primary font-bold">${remainingForFree.toFixed(2)}</span> more for Free Shipping
                      </span>
                    ) : (
                      <span className="text-accent-secondary font-bold">
                        FREE SHIPPING UNLOCKED
                      </span>
                    )}
                    <span>Goal: $100.00</span>
                  </div>
                  <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        remainingForFree > 0 ? 'bg-accent-primary' : 'bg-accent-secondary'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-bg-elevated rounded-full text-text-tertiary">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-text-primary font-bold text-sm">Bag empty</p>
                      <p className="text-xs text-text-secondary max-w-[250px] mx-auto leading-relaxed">
                        Add aramid covers or charging devices to compile your first order loadout.
                      </p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-bg-base/30 border border-border-subtle rounded-2xl group transition-all"
                    >
                      {/* Image */}
                      <div className="relative w-18 h-18 bg-bg-elevated border border-border-subtle rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Detail metadata */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-text-primary truncate">
                            {item.name}
                          </h4>
                          {item.compatibility && (
                            <p className="text-[10px] text-text-tertiary uppercase font-mono tracking-wider">
                              COMPATIBILITY: {item.compatibility}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity selectors */}
                          <div className="flex items-center border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-1.5 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-[11px] font-mono font-bold text-text-primary">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-1.5 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price & Delete */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-text-tertiary hover:text-error transition-colors p-1"
                              aria-label="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal, Promo, & Checkout actions */}
              {cart.length > 0 && (
                <div className="border-t border-border-subtle p-6 bg-bg-surface space-y-4">
                  {/* Coupon section */}
                  {coupon ? (
                    <div className="flex justify-between items-center bg-accent-primary-soft border border-accent-primary/20 text-accent-primary rounded-xl px-3 py-2 text-[11px] font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5" />
                        <span>PROMO: {coupon.code} active (-${discountAmount.toFixed(2)})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-accent-primary hover:underline hover:text-indigo-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePromoSubmit} className="space-y-1">
                      <div className="flex border border-border-subtle rounded-xl bg-bg-base overflow-hidden focus-within:border-accent-primary">
                        <input
                          type="text"
                          placeholder="PROMO CODE"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="bg-transparent px-3 py-2 text-[10px] font-mono tracking-widest text-text-primary focus:outline-none w-full placeholder:text-text-tertiary"
                        />
                        <button
                          type="submit"
                          className="bg-bg-elevated hover:bg-text-primary hover:text-white px-4 text-[10px] font-semibold uppercase tracking-wider transition-colors border-l border-border-subtle"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-error font-medium pl-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>{promoError}</span>
                        </p>
                      )}
                    </form>
                  )}

                  {/* Pricing summaries */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    {coupon && (
                      <div className="flex justify-between text-accent-primary">
                        <span>Discount ({coupon.code})</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-text-secondary">
                      <span>Shipping</span>
                      <span className="font-mono">
                        {subtotal >= shippingThreshold ? 'FREE' : '$9.99'}
                      </span>
                    </div>
                    <div className="border-t border-border-subtle pt-3 flex justify-between font-bold text-text-primary text-sm">
                      <span>Final Total</span>
                      <span className="font-mono text-accent-primary">
                        ${(finalTotal + (subtotal >= shippingThreshold ? 0 : 9.99)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-text-primary hover:bg-accent-primary text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Checkout via Paddle</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
