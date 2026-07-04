'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getAdminData,
  updateProductStock,
  updateOrderStatus,
  deleteReview,
  toggleCoupon,
} from '@/app/actions/admin';
import { ShieldCheck, ShoppingBag, Layers, Star, Trash2, Save, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface OrderItem {
  price: number;
  quantity: number;
  product: { name: string };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: { name: string };
}

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiresAt: string;
  isActive: boolean;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, conversionRate: 0 });
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stock edit states
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAdminData();
    if (data) {
      setProducts(data.products);
      setOrders(data.orders as Order[]);
      setReviews(data.reviews as Review[]);
      setCoupons(data.coupons as Coupon[]);
      setStats(data.stats);
      setTopSelling(data.topSelling);
      setTimeline(data.revenueTimeline);

      // Initialize stock editing states
      const stockMap: Record<string, number> = {};
      data.products.forEach((p) => {
        stockMap[p.id] = p.stock;
      });
      setEditingStock(stockMap);
    }
    setLoading(false);
  };

  const handleStockUpdate = async (id: string) => {
    const newStock = editingStock[id];
    const res = await updateProductStock(id, newStock);
    if (res.success) {
      alert('Stock successfully synchronized in database.');
      // Refresh local list
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateOrderStatus(id, newStatus);
    if (res.success) {
      alert('Order status successfully updated.');
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    }
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    const res = await toggleCoupon(id, newActive);
    if (res.success) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: newActive } : c))
      );
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Permanently delete review from feed database?')) {
      const res = await deleteReview(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen mesh-bg py-10 md:py-16 text-sm text-text-secondary">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header Indicator */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white uppercase tracking-tight">
              Avenoir System Console
            </h1>
            <p className="text-xs text-text-secondary font-mono">
              OPERATOR LEVEL: <span className="text-accent">OWNER PRIVILEGES ACTIVE</span>
            </p>
          </div>
          <span className="flex items-center gap-1.5 bg-accent/15 border border-accent/30 text-accent font-semibold px-3 py-1 rounded-full text-xs">
            <ShieldCheck className="w-4 h-4" /> System Live
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white font-mono animate-pulse">
            LOADING TACTILE METRICS MANIFEST...
          </div>
        ) : (
          <>
            {/* Metric Blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Gross Revenue', val: `$${stats.totalRevenue.toFixed(2)}`, desc: 'Real-time order totals' },
                { title: 'Orders Logged', val: stats.totalOrders, desc: 'Queue processing count' },
                { title: 'Average Value', val: `$${stats.avgOrderValue.toFixed(2)}`, desc: 'Value per transaction' },
                { title: 'Conversion Rate', val: `${stats.conversionRate}%`, desc: 'Active session buy ratio' },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-secondary/40 border border-white/10 rounded-2xl p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
                    {stat.title}
                  </span>
                  <p className="text-2xl font-extrabold font-mono text-white leading-tight">{stat.val}</p>
                  <p className="text-[10px] text-text-secondary/70">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-bg-secondary/40 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Weekly Sales Curve
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="date" stroke="#737373" fontSize={11} />
                      <YAxis stroke="#737373" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#22D3EE"
                        strokeWidth={2.5}
                        dot={{ r: 4, stroke: '#22D3EE', fill: '#0D0D0D' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Best selling */}
              <div className="bg-bg-secondary/40 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Top Selling Division
                </h3>
                <div className="space-y-4">
                  {topSelling.length === 0 ? (
                    <p className="text-xs text-text-secondary italic">No products registered sales yet.</p>
                  ) : (
                    topSelling.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-white truncate max-w-[150px]">{p.name}</p>
                          <p className="text-[10px] text-text-secondary">{p.qty} units moved</p>
                        </div>
                        <span className="text-xs font-bold text-accent font-mono">
                          ${p.rev.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Content Control System */}
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-white/10 gap-2 pb-px overflow-x-auto no-scrollbar">
                {[
                  { label: 'Inventory Log', id: 'inventory', icon: <Layers className="w-4 h-4" /> },
                  { label: 'Orders Queue', id: 'orders', icon: <ShoppingBag className="w-4 h-4" /> },
                  { label: 'Reviews Feed', id: 'reviews', icon: <Star className="w-4 h-4" /> },
                  { label: 'Promotional Coupons', id: 'coupons', icon: <Tag className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-premium border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-text-secondary hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Inventory Control Grid */}
              {activeTab === 'inventory' && (
                <div className="bg-bg-secondary/40 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/2 border-b border-white/5 text-[10px] font-bold uppercase tracking-wider font-mono text-white">
                          <th className="px-6 py-4">Component Name</th>
                          <th className="px-6 py-4">Division</th>
                          <th className="px-6 py-4">MSRP Price</th>
                          <th className="px-6 py-4">Stock Level</th>
                          <th className="px-6 py-4 text-center">Commit Changes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs text-text-secondary">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-white/2">
                            <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                            <td className="px-6 py-4 uppercase font-mono">{p.category}</td>
                            <td className="px-6 py-4 font-mono text-white">${p.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={editingStock[p.id] ?? p.stock}
                                onChange={(e) =>
                                  setEditingStock({
                                    ...editingStock,
                                    [p.id]: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20 bg-surface-card border border-white/10 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-accent"
                              />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleStockUpdate(p.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent/15 border border-accent/30 text-accent font-semibold rounded-lg text-[10px] hover:bg-accent hover:text-bg-primary transition-premium"
                              >
                                <Save className="w-3.5 h-3.5" /> Synchronize
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders queue grid */}
              {activeTab === 'orders' && (
                <div className="bg-bg-secondary/40 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/2 border-b border-white/5 text-[10px] font-bold uppercase tracking-wider font-mono text-white">
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Purchased Item</th>
                          <th className="px-6 py-4">Grand Total</th>
                          <th className="px-6 py-4">Dispatch Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-text-secondary italic">
                              No order transactions queued.
                            </td>
                          </tr>
                        ) : (
                          orders.map((o) => (
                            <tr key={o.id} className="hover:bg-white/2">
                              <td className="px-6 py-4 font-mono text-white truncate max-w-[120px]">{o.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-semibold text-white">{o.customerName}</p>
                                <p className="text-[10px] text-text-secondary font-mono">{o.customerEmail}</p>
                              </td>
                              <td className="px-6 py-4">
                                <ul className="space-y-1">
                                  {o.items.map((i, idx) => (
                                    <li key={idx} className="truncate max-w-[200px]">
                                      &bull; {i.product.name} (x{i.quantity})
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="px-6 py-4 font-mono text-white font-bold">${o.total.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                  className="bg-surface-card border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-accent cursor-pointer"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reviews grid */}
              {activeTab === 'reviews' && (
                <div className="bg-bg-secondary/40 border border-white/10 rounded-2xl overflow-hidden p-6 space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-text-secondary italic">No review messages submitted yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((r) => (
                        <div
                          key={r.id}
                          className="bg-white/2 border border-white/5 rounded-xl p-4 flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-white text-xs">{r.userName}</span>
                              <div className="flex text-accent gap-0.5">
                                {[...Array(r.rating)].map((_, idx) => (
                                  <Star key={idx} className="w-3 h-3 fill-accent text-accent" />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-text-secondary leading-relaxed italic">
                              &ldquo;{r.comment}&rdquo;
                            </p>
                          </div>
                          <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-[9px] font-mono">
                            <span>Product: <strong className="text-white">{r.product.name}</strong></span>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-text-secondary hover:text-error transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Purge
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Coupons management */}
              {activeTab === 'coupons' && (
                <div className="bg-bg-secondary/40 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/2 border-b border-white/5 text-[10px] font-bold uppercase tracking-wider font-mono text-white">
                          <th className="px-6 py-4">Promo Code</th>
                          <th className="px-6 py-4">Calculation Type</th>
                          <th className="px-6 py-4">Markdown Value</th>
                          <th className="px-6 py-4">Expiration Date</th>
                          <th className="px-6 py-4 text-center">Status Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {coupons.map((c) => (
                          <tr key={c.id} className="hover:bg-white/2">
                            <td className="px-6 py-4 font-mono text-white font-bold">{c.code}</td>
                            <td className="px-6 py-4 uppercase font-mono">{c.discountType}</td>
                            <td className="px-6 py-4 font-mono text-white">
                              {c.discountType === 'PERCENT' ? `${c.discountValue}%` : `$${c.discountValue}`}
                            </td>
                            <td className="px-6 py-4 font-mono">
                              {new Date(c.expiresAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleCoupon(c.id, c.isActive)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-premium uppercase ${
                                  c.isActive
                                    ? 'bg-success/15 border-success/30 text-success'
                                    : 'bg-error/15 border-error/30 text-error'
                                }`}
                              >
                                {c.isActive ? 'Active' : 'Disabled'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
