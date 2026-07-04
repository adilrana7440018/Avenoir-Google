'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useStore, CartItem } from '@/lib/store';
import { CreditCard, Lock, ShieldCheck, X, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaddleContextType {
  checkout: (items: CartItem[], total: number) => void;
  isCheckingOut: boolean;
  checkoutSuccess: boolean;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export function usePaddle() {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
}

interface PaddleProviderProps {
  children: ReactNode;
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const { clearCart } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Simulated fields
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const checkout = (items: CartItem[], total: number) => {
    setCheckoutItems(items);
    setCheckoutTotal(total);
    setIsCheckingOut(true);
    setCheckoutSuccess(false);
    setLoading(false);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay for Paddle checkouts
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setCheckoutSuccess(true);
    clearCart();
  };

  const handleClose = () => {
    setIsCheckingOut(false);
    setCheckoutSuccess(false);
    setEmail('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <PaddleContext.Provider value={{ checkout, isCheckingOut, checkoutSuccess }}>
      {children}

      {/* Simulated Paddle Overlay Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={loading ? undefined : handleClose}
              className="absolute inset-0 bg-text-primary/10 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-md overflow-hidden z-10"
            >
              {/* Close button */}
              {!loading && (
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 text-text-secondary hover:text-text-primary p-1.5 rounded-full hover:bg-bg-elevated transition-colors"
                  aria-label="Close checkout"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {checkoutSuccess ? (
                /* Success view */
                <div className="text-center py-8 space-y-6">
                  <div className="inline-flex p-4 bg-accent-secondary-soft text-accent-secondary rounded-full">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-text-primary">
                      Transaction Completed
                    </h3>
                    <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                      Your Paddle session was processed successfully. A logistical manifest and order details have been dispatched to your email.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full bg-text-primary hover:bg-accent-primary text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Return to Storefront
                  </button>
                </div>
              ) : (
                /* Billing Form view */
                <form onSubmit={handlePay} className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-accent-primary font-mono tracking-widest uppercase">
                      <Lock className="w-3.5 h-3.5" />
                      <span>PADDLE SECURE GATEWAY</span>
                    </div>
                    <h3 className="text-base font-bold text-text-primary">
                      AVENOIR Order Loadout
                    </h3>
                    <p className="text-[11px] text-text-secondary">
                      Your checkout session is encrypted and processed via Paddle.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-bg-base border border-border-subtle rounded-2xl p-4 space-y-2">
                    <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                      {checkoutItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-[11px] text-text-secondary font-mono"
                        >
                          <span className="truncate max-w-[200px]">{item.name}</span>
                          <span>
                            {item.quantity}x &bull; ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border-subtle pt-2 flex justify-between text-xs font-bold text-text-primary">
                      <span>Total Amount:</span>
                      <span className="font-mono text-accent-primary">
                        ${checkoutTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Card Fields */}
                  <div className="space-y-3.5">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-widest">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        disabled={loading}
                        placeholder="buyer@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary disabled:opacity-50"
                      />
                    </div>

                    {/* Card details */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-widest">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          disabled={loading}
                          pattern="[0-9 ]{12,19}"
                          placeholder="•••• •••• •••• ••••"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-bg-base border border-border-subtle rounded-xl pl-10 pr-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary disabled:opacity-50 font-mono"
                        />
                        <CreditCard className="w-4 h-4 text-text-tertiary absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* Exp/CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-widest">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          disabled={loading}
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary disabled:opacity-50 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-widest">
                          Security Code
                        </label>
                        <input
                          type="password"
                          required
                          disabled={loading}
                          maxLength={3}
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary disabled:opacity-50 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent-primary hover:bg-indigo-600 disabled:bg-indigo-400 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authorizing via Paddle...</span>
                        </>
                      ) : (
                        <span>Authorize Payment</span>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-tertiary">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-secondary" />
                      <span>Certified Paddle Merchant &bull; Encrypted Sessions</span>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PaddleContext.Provider>
  );
}
