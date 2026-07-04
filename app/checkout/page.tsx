'use client';

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowLeft, CheckCircle2, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createOrder } from '@/app/actions/checkout';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { cart, coupon, clearCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = coupon
    ? coupon.discountType === 'PERCENT'
      ? subtotal * (coupon.discountValue / 100)
      : coupon.discountValue
    : 0;

  const shipping = subtotal >= 75 ? 0 : 9.99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    const addressObj = {
      line1: address,
      city,
      state,
      postalCode: zip,
      country: 'USA',
    };

    const itemsInput = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const result = await createOrder({
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      shippingAddress: addressObj,
      total: finalTotal,
      items: itemsInput,
    });

    if (result.success && result.orderId) {
      setOrderId(result.orderId);
      // Confetti splash
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#14B8A6', '#FFFFFF'],
      });
      // Clear Zustand cart
      clearCart();
    } else {
      alert('Transaction authorization failed. Please try again.');
    }
    setLoading(false);
  };

  // If order is completed successfully, render Order Confirmed Screen
  if (orderId) {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);

    return (
      <div className="min-h-screen bg-bg-base py-16 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-bg-surface border border-border-subtle rounded-3xl p-8 space-y-8 shadow-2xl text-center">
          <div className="inline-flex p-4 bg-accent-primary-soft border border-accent-primary/30 rounded-full text-accent-primary">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold font-display text-text-primary uppercase tracking-wider">
              Order Confirmed
            </h1>
            <p className="text-xs text-text-secondary font-mono">
              IDENTIFIER: <span className="text-text-primary font-semibold">{orderId}</span>
            </p>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Your transaction has been authorized successfully. A copy of the digital aramid manifest and shipping logs has been transmitted to your email.
          </p>

          {/* Details strip */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-border-subtle py-6 text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent-primary" /> Shipping To
              </span>
              <p className="text-xs font-semibold text-text-primary truncate">{firstName} {lastName}</p>
              <p className="text-[11px] text-text-secondary truncate">{address}, {city}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-secondary font-mono tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-accent-primary" /> Estimated Delivery
              </span>
              <p className="text-xs font-semibold text-text-primary">
                {deliveryDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-[11px] text-text-secondary">Via Monolith Express</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-4 rounded-xl text-sm transition-premium shadow-md"
            >
              Continue Exploration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no checkout completed, show redirect screen
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-2xl font-extrabold font-display text-text-primary uppercase tracking-wider">
          Checkout Empty
        </h1>
        <p className="text-sm text-text-secondary max-w-sm mt-3">
          Your active shopping cart has no queued elements. Please select items from the catalog before proceeding to authorization.
        </p>
        <Link
          href="/products/cases"
          className="mt-8 px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-bold rounded-xl text-sm transition-premium shadow-md"
        >
          Return to Armory Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Link
            href="/products/cases"
            className="p-2 rounded-xl border border-border-subtle hover:border-text-tertiary text-text-secondary hover:text-text-primary bg-bg-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary uppercase tracking-tight">
            Checkout Authorization
          </h1>
        </div>

        {/* Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Checkout form - Column 7 */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Customer Details */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-bold font-display text-text-primary border-b border-border-subtle pb-3">
                1. Customer Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                    placeholder="name@domain.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-bold font-display text-text-primary border-b border-border-subtle pb-3">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                    placeholder="123 Carbon Fiber Lane"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                      placeholder="Neon City"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      State / Reg
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      ZIP / Postal
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                      placeholder="90210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment simulator */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                <h2 className="text-base font-bold font-display text-text-primary">
                  3. Secure Card Payment
                </h2>
                <div className="flex items-center gap-1.5 text-accent-primary text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Stripe Encryption</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                    Credit Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-primary font-mono transition-premium"
                      placeholder="4242 4242 4242 4242 (Stripe Test)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary font-mono transition-premium"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                      Security Code (CVC)
                    </label>
                    <input
                      type="text"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      maxLength={4}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary font-mono transition-premium"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Authorize button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-primary hover:bg-accent-primary/95 disabled:bg-accent-primary/40 text-white font-bold py-4 rounded-xl text-center flex items-center justify-center gap-2 group transition-premium text-base shadow-lg shadow-accent-primary/10 cursor-pointer"
            >
              {loading ? (
                <span>Authorizing Security Protocols...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Authorize Transaction — ${finalTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>

          {/* Order Summary - Column 5 */}
          <aside className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-6 h-fit shadow-sm">
            <h2 className="text-base font-bold font-display text-text-primary border-b border-border-subtle pb-3">
              Order Summary
            </h2>

            {/* Items list */}
            <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-12 h-12 bg-bg-surface border border-border-subtle rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="50px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-text-primary truncate">{item.name}</h3>
                    <p className="text-[10px] text-text-secondary mt-0.5 truncate">
                      Qty: {item.quantity} {item.color ? ` / ${item.color}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-text-primary font-mono flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 border-t border-border-subtle pt-4 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-text-primary font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-accent-primary font-medium">
                  <span>Discount ({coupon.code})</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Express Courier Shipping</span>
                <span className="text-text-primary font-mono">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-text-primary border-t border-border-subtle pt-3">
                <span>Total Due</span>
                <span className="text-accent-primary font-mono">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* SSL/Guarantee tags */}
            <div className="pt-4 border-t border-border-subtle space-y-3">
              <div className="flex gap-2.5 items-center text-[10px] text-text-secondary">
                <ShieldCheck className="w-4 h-4 text-accent-primary" />
                <span>PCI-DSS Level 1 Encryption Verified</span>
              </div>
              <div className="flex gap-2.5 items-center text-[10px] text-text-secondary">
                <Lock className="w-4 h-4 text-accent-primary" />
                <span>256-bit Secure Socket Layer Connection</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
