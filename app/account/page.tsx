'use client';

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, User, ShieldCheck, MapPin, KeyRound, BellRing, PackageCheck, Truck } from 'lucide-react';
import { getUserOrders, getWishlistProducts } from '@/app/actions/account';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
    slug: string;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string; // JSON string
  total: number;
  status: string;
  paymentIntentId: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const { wishlist, cart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  // Customer mock identity (synced to seeded DB values)
  const mockUser = {
    name: 'John Doe',
    email: 'user@avenoir.com',
    role: 'USER',
    joined: 'July 2026',
  };

  // State loaded from DB
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch orders from SQLite
    getUserOrders(mockUser.email).then((res) => {
      setOrders(res as Order[]);
      setLoadingOrders(false);
    });
  }, []);

  // Fetch wishlist details when active tab changes or wishlist array updates
  useEffect(() => {
    if (activeTab === 'wishlist' && wishlist.length > 0) {
      setLoadingWishlist(true);
      getWishlistProducts(wishlist).then((res) => {
        setWishlistProducts(res);
        setLoadingWishlist(false);
      });
    } else if (wishlist.length === 0) {
      setWishlistProducts([]);
    }
  }, [activeTab, wishlist]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        {/* Profile Title Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border-subtle bg-bg-surface rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-accent-primary-soft border border-accent-primary/30 text-accent-primary flex items-center justify-center font-display font-extrabold text-2xl">
              JD
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">{mockUser.name}</h1>
              <p className="text-xs text-text-secondary font-mono mt-0.5">{mockUser.email}</p>
            </div>
          </div>
          <div className="text-center md:text-right border-t border-border-subtle md:border-none pt-4 md:pt-0 w-full md:w-auto">
            <span className="bg-bg-elevated border border-border-subtle text-text-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Member Since {mockUser.joined}
            </span>
          </div>
        </div>

        {/* Tab Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Menu Sidebar */}
          <nav className="lg:col-span-3 bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-1 shadow-sm">
            {[
              { label: 'Order History', id: 'orders', icon: <ShoppingBag className="w-4 h-4" /> },
              { label: 'Wishlist Armory', id: 'wishlist', icon: <Heart className="w-4 h-4" /> },
              { label: 'Shipping Addresses', id: 'address', icon: <MapPin className="w-4 h-4" /> },
              { label: 'Security Protocols', id: 'security', icon: <KeyRound className="w-4 h-4" /> },
              { label: 'Notification Feed', id: 'notifications', icon: <BellRing className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl border transition-premium ${
                  activeTab === tab.id
                    ? 'bg-accent-primary text-white border-accent-primary shadow-sm font-semibold'
                    : 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Active Panel Content */}
          <main className="lg:col-span-9">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold font-display text-text-primary">Queued & Completed Logs</h2>

                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-32 bg-bg-surface border border-border-subtle rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border border-dashed border-border-subtle bg-bg-surface rounded-2xl p-12 text-center space-y-3 shadow-sm">
                    <ShoppingBag className="w-8 h-8 text-text-tertiary mx-auto" />
                    <p className="text-text-primary text-sm font-semibold">No order logs cached</p>
                    <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                      You have not completed any transaction authorizations yet. Browse the catalog to load your hardware.
                    </p>
                    <Link
                      href="/products/cases"
                      className="inline-flex px-4 py-2 border border-border-subtle hover:border-accent-primary hover:text-accent-primary rounded-xl text-xs font-bold transition-premium mt-2 text-text-primary bg-bg-surface hover:bg-bg-elevated"
                    >
                      Browse Cases
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const addressObj = JSON.parse(order.shippingAddress || '{}');
                      return (
                        <div
                          key={order.id}
                          className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-md"
                        >
                          {/* Order metadata header */}
                          <div className="bg-bg-elevated px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle text-xs">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                              <div>
                                <p className="text-text-secondary font-mono">DATE QUEUED</p>
                                <p className="text-text-primary font-medium mt-0.5">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-text-secondary font-mono">ORDER TOTAL</p>
                                <p className="text-accent-primary font-bold mt-0.5 font-mono">${order.total.toFixed(2)}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-text-secondary font-mono">ORDER ID</p>
                                <p className="text-text-primary font-medium mt-0.5 font-mono truncate max-w-[150px]">
                                  {order.id}
                                </p>
                              </div>
                            </div>

                            <span className="bg-accent-primary-soft text-accent-primary text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono self-start sm:self-center border border-accent-primary/20">
                              {order.status}
                            </span>
                          </div>

                          {/* Order items lists */}
                          <div className="p-6 space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4 items-center justify-between">
                                <div className="flex gap-3 items-center min-w-0">
                                  <div className="relative w-12 h-12 bg-bg-surface border border-border-subtle rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={item.product.image}
                                      alt={item.product.name}
                                      fill
                                      className="object-cover"
                                      sizes="50px"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-text-primary truncate hover:text-accent-primary transition-colors">
                                      <Link href={`/products/${item.product.category}/${item.product.slug}`}>
                                        {item.product.name}
                                      </Link>
                                    </h4>
                                    <p className="text-[10px] text-text-secondary mt-0.5 font-mono">
                                      Qty: {item.quantity} &bull; Price: ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Tracking bar */}
                            <div className="pt-4 border-t border-border-subtle mt-4 space-y-4">
                              <h5 className="text-[9px] uppercase font-bold text-text-secondary font-mono tracking-wider flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-accent-primary" /> Shipping & Dispatch Logs
                              </h5>
                              <div className="relative flex items-center justify-between text-[10px] text-text-secondary px-2">
                                {/* Lines connector */}
                                <div className="absolute left-4 right-4 bg-border-subtle h-0.5 top-2 z-0" />
                                <div className="absolute left-4 w-1/3 bg-accent-primary h-0.5 top-2 z-0" /> {/* Halfway processed progress */}

                                <div className="z-10 flex flex-col items-center gap-1.5 font-mono">
                                  <span className="w-4 h-4 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold text-[8px] border border-bg-surface">✓</span>
                                  <span className="text-text-primary font-semibold">Authorized</span>
                                </div>
                                <div className="z-10 flex flex-col items-center gap-1.5 font-mono">
                                  <span className="w-4 h-4 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold text-[8px] border border-bg-surface">✓</span>
                                  <span className="text-text-primary font-semibold">Milled/Packed</span>
                                </div>
                                <div className="z-10 flex flex-col items-center gap-1.5 font-mono">
                                  <span className="w-4 h-4 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-[8px]" />
                                  <span>In Transit</span>
                                </div>
                                <div className="z-10 flex flex-col items-center gap-1.5 font-mono">
                                  <span className="w-4 h-4 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-[8px]" />
                                  <span>Delivered</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold font-display text-text-primary">Your Saved Armor</h2>

                {loadingWishlist ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 animate-pulse">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-64 bg-bg-surface border border-border-subtle rounded-2xl" />
                    ))}
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="border border-dashed border-border-subtle bg-bg-surface rounded-2xl p-12 text-center space-y-3 shadow-sm">
                    <Heart className="w-8 h-8 text-text-tertiary mx-auto" />
                    <p className="text-text-primary text-sm font-semibold">Wishlist empty</p>
                    <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                      Tap the heart icon on catalog cards to save components to your locker for quick reference.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-bg-surface border border-border-subtle rounded-2xl p-4 flex gap-4 items-center group relative hover:border-accent-primary/30 transition-premium shadow-sm"
                      >
                        <div className="relative w-20 h-20 bg-bg-surface border border-border-subtle rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[8px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-bold text-text-primary truncate leading-tight">
                            <Link href={`/products/${p.category}/${p.slug}`}>{p.name}</Link>
                          </h4>
                          <p className="text-xs text-accent-primary font-semibold font-mono">${p.price.toFixed(2)}</p>
                          <Link
                            href={`/products/${p.category}/${p.slug}`}
                            className="inline-flex text-[10px] font-bold text-text-primary hover:text-accent-primary transition-colors gap-1 items-center pt-2"
                          >
                            Configure Specifications &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Address, Security, Notifications panels */}
            {['address', 'security', 'notifications'].includes(activeTab) && (
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                  <span className="p-2 bg-accent-primary-soft rounded-lg text-accent-primary">
                    {activeTab === 'address' ? <MapPin className="w-5 h-5" /> : activeTab === 'security' ? <KeyRound className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
                  </span>
                  <h3 className="text-sm font-bold text-text-primary capitalize">{activeTab} Manifest</h3>
                </div>

                <div className="space-y-4">
                  {activeTab === 'security' ? (
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">New Password</label>
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                        />
                      </div>
                      <div className="space-y-2 pb-2">
                        <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">Verify Password</label>
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary transition-premium"
                        />
                      </div>
                      <button className="px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/95 text-white font-bold rounded-xl text-xs transition-premium shadow-md cursor-pointer">
                        Update Security Protocols
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-bg-elevated border border-border-subtle rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-text-primary">
                          {activeTab === 'address'
                            ? 'Default Billing & Courier Destination'
                            : 'Avenoir COLLABS Release Feed'}
                        </p>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          {activeTab === 'address'
                            ? '123 Cyberpunk St, Neon City, CA, USA'
                            : 'Immediate notification of structural engineering releases'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-accent-primary hover:underline cursor-pointer">
                        Modify
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-text-secondary italic">
                    * Mock account system. State is synced dynamically for simulation.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
