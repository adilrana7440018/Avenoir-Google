'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Percent,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  updateProductStock,
  updateOrderStatus,
  toggleCoupon,
} from '@/app/actions/admin';

interface AdminDashboardClientProps {
  initialData: {
    products: any[];
    orders: any[];
    reviews: any[];
    coupons: any[];
    stats: {
      totalRevenue: number;
      totalOrders: number;
      avgOrderValue: number;
      conversionRate: number;
    };
    topSelling: any[];
    revenueTimeline: any[];
  };
}

export default function AdminDashboardClient({
  initialData,
}: AdminDashboardClientProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState(initialData);

  // Trigger client render safety
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStockUpdate = async (productId: string, stock: number) => {
    const res = await updateProductStock(productId, stock);
    if (res.success) {
      setData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === productId ? { ...p, stock } : p
        ),
      }));
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    const res = await updateOrderStatus(orderId, status);
    if (res.success) {
      setData((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId ? { ...o, status } : o
        ),
      }));
    }
  };

  const handleCouponToggle = async (couponId: string, isActive: boolean) => {
    const res = await toggleCoupon(couponId, isActive);
    if (res.success) {
      setData((prev) => ({
        ...prev,
        coupons: prev.coupons.map((c) =>
          c.id === couponId ? { ...c, isActive } : c
        ),
      }));
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center font-mono text-xs">
        LOADING ADMINISTRATIVE MANIFEST...
      </div>
    );
  }

  const { stats, products, orders, coupons, revenueTimeline } = data;

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-accent-primary font-mono tracking-widest uppercase">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>AVENOIR SECURE INTERFACE</span>
            </div>
            <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">
              Operational Command
            </h1>
            <p className="text-xs text-text-secondary">
              Review platform analytics, adjust inventory, and dispatch orders.
            </p>
          </div>
          <div className="bg-bg-surface border border-border-subtle rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm text-xs font-mono">
            <span className="w-2.5 h-2.5 bg-accent-secondary rounded-full animate-pulse" />
            <span className="text-text-primary font-bold">DATABASE CONNECTED</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-accent-primary-soft text-accent-primary rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-accent-secondary font-mono bg-accent-secondary-soft px-2 py-0.5 rounded-full">
                +14.8%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Gross Revenue
              </p>
              <h3 className="text-2xl font-black text-text-primary font-mono">
                ${stats.totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-accent-secondary-soft text-accent-secondary rounded-2xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-accent-primary font-mono bg-accent-primary-soft px-2 py-0.5 rounded-full">
                +8.2%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Orders Completed
              </p>
              <h3 className="text-2xl font-black text-text-primary font-mono">
                {stats.totalOrders}
              </h3>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-accent-warm-soft text-accent-warm rounded-2xl">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-text-secondary font-mono bg-bg-elevated px-2 py-0.5 rounded-full">
                Stable
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Average Value
              </p>
              <h3 className="text-2xl font-black text-text-primary font-mono">
                ${stats.avgOrderValue.toFixed(2)}
              </h3>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-bg-elevated text-text-primary rounded-2xl">
                <Percent className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-accent-secondary font-mono bg-accent-secondary-soft px-2 py-0.5 rounded-full">
                +0.4%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Conversion Rate
              </p>
              <h3 className="text-2xl font-black text-text-primary font-mono">
                {stats.conversionRate}%
              </h3>
            </div>
          </div>
        </div>

        {/* Charts & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Graph Card */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                Weekly Revenue Timeline
              </h3>
              <p className="text-[11px] text-text-secondary">
                Weekly financial aggregates parsed across verified checkouts.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTimeline}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    stroke="#57534E"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    stroke="#57534E"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E7E5E4',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Promo Codes */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                  Active Vouchers
                </h3>
                <p className="text-[11px] text-text-secondary">
                  Configure active promotional manifests.
                </p>
              </div>
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex justify-between items-center p-3.5 bg-bg-base border border-border-subtle rounded-2xl"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold text-text-primary">
                        {coupon.code}
                      </span>
                      <p className="text-[10px] text-text-secondary">
                        {coupon.discountType === 'PERCENT'
                          ? `Discount: ${coupon.discountValue}%`
                          : `Discount: $${coupon.discountValue}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCouponToggle(coupon.id, !coupon.isActive)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider font-mono border transition-all ${
                        coupon.isActive
                          ? 'bg-accent-secondary-soft text-accent-secondary border-accent-secondary/20'
                          : 'bg-bg-elevated text-text-tertiary border-border-subtle'
                      }`}
                    >
                      {coupon.isActive ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-bg-elevated/40 border border-border-subtle rounded-2xl p-4 text-[10px] text-text-secondary leading-relaxed font-mono">
              MAN_VOUCHER: System requires at least 1 coupon configuration active.
            </div>
          </div>
        </div>

        {/* Order queue and stock level lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order dispatcher queue */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                Logistical Dispatch Queue
              </h3>
              <p className="text-[11px] text-text-secondary">
                Orders waiting verification and parcel courier handover.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border-subtle text-text-tertiary uppercase tracking-wider font-mono text-[10px]">
                    <th className="pb-3 font-bold">Order ID</th>
                    <th className="pb-3 font-bold">Email</th>
                    <th className="pb-3 font-bold">Total</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {orders.map((o) => (
                    <tr key={o.id} className="text-text-primary">
                      <td className="py-3.5 font-mono text-[11px] truncate max-w-[100px]">
                        #{o.id}
                      </td>
                      <td className="py-3.5 truncate max-w-[120px]">{o.email}</td>
                      <td className="py-3.5 font-mono font-bold">${o.total.toFixed(2)}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            o.status === 'DELIVERED'
                              ? 'bg-accent-secondary-soft text-accent-secondary'
                              : o.status === 'SHIPPED'
                              ? 'bg-accent-primary-soft text-accent-primary'
                              : 'bg-accent-warm-soft text-accent-warm'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'SHIPPED')}
                            className="bg-text-primary hover:bg-accent-primary text-white font-semibold px-3 py-1.5 rounded-xl text-[10px] transition-colors"
                          >
                            Ship Package
                          </button>
                        )}
                        {o.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'DELIVERED')}
                            className="bg-accent-secondary text-white font-semibold px-3 py-1.5 rounded-xl text-[10px] transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {o.status === 'DELIVERED' && (
                          <span className="text-[10px] text-text-tertiary font-mono">
                            Delivered
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product stock controls */}
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                Inventory Levels
              </h3>
              <p className="text-[11px] text-text-secondary">
                Adjust inventory units directly for active items.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border-subtle text-text-tertiary uppercase tracking-wider font-mono text-[10px]">
                    <th className="pb-3 font-bold">Product</th>
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold text-center">Stock</th>
                    <th className="pb-3 font-bold text-right">Modify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {products.map((p) => (
                    <tr key={p.id} className="text-text-primary">
                      <td className="py-3.5 truncate max-w-[150px] font-bold">{p.name}</td>
                      <td className="py-3.5 text-text-secondary uppercase tracking-widest text-[9px] font-mono">
                        {p.category}
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold">
                        <span
                          className={`${
                            p.stock <= 5 ? 'text-error font-bold' : 'text-text-primary'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5 border border-border-subtle rounded-lg bg-bg-base overflow-hidden">
                          <button
                            onClick={() => handleStockUpdate(p.id, p.stock - 1)}
                            className="px-2 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                          >
                            -
                          </button>
                          <span className="px-1 text-[10px] font-mono font-bold text-text-primary">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockUpdate(p.id, p.stock + 1)}
                            className="px-2 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
