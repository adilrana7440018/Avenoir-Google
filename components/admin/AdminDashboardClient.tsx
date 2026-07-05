'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Sparkles,
  LayoutDashboard,
  Package,
  FolderTree,
  Smartphone,
  Palette,
  Hammer,
  Boxes,
  ShoppingBag,
  Users,
  Percent,
  MessageSquare,
  Image as ImageIcon,
  BookOpen,
  Globe,
  BarChart3,
  CreditCard,
  Truck,
  Settings,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Check,
  AlertTriangle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  updateOrderStatus,
  deleteReview,
  toggleCoupon,
  createCoupon,
  deleteCoupon
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

const COLORS_PIE = ['#8A7B6C', '#B49A78', '#D8CFC2', '#756D64'];

export default function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product editor state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    details: '',
    price: 0,
    discountPrice: 0,
    category: 'cases',
    image: '/images/carbon-monolith-1.webp',
    hoverImage: '',
    images: '[]',
    stock: 50,
    specs: '{"Material":"Aramid Fiber","Drop Protection":"10m","Weight":"20g"}',
    compatibility: 'iPhone 16 Pro, iPhone 16 Pro Max',
    isFeatured: false,
    variants: [] as { color: string; colorHex: string; priceModifier: number; stock: number }[]
  });
  
  // Custom variant inputs inside add product
  const [newVarColor, setNewVarColor] = useState('');
  const [newVarHex, setNewVarHex] = useState('#000000');
  const [newVarPriceMod, setNewVarPriceMod] = useState(0);
  const [newVarStock, setNewVarStock] = useState(50);

  // Coupon creator state
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'PERCENT',
    discountValue: 15,
    expiresInDays: 30
  });

  // Announcement/Banner state
  const [bannerForm, setBannerForm] = useState({
    headline: 'Premium Tech Accessories for Everyday Protection',
    subtitle: 'Minimal, durable, and designed to match your device.',
    primaryBtn: 'Shop Cases',
    secondaryBtn: 'Explore Accessories'
  });

  // SEO mock settings
  const [seoForm, setSeoForm] = useState({
    title: 'Avenoir | Soft Aura Premium Storefront',
    description: 'Premium light-themed phone cases, GaN chargers, and braided cables designed with materials science.',
    keywords: 'phone cases, MagSafe, premium covers, Avenoir'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center font-serif-display text-lg font-bold text-text-primary">
        Loading Avenoir administrative system...
      </div>
    );
  }

  const { stats, products, orders, coupons, reviews, revenueTimeline } = data;

  // Handlers for Products
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Edit mode
      const res = await updateProduct(editingProduct.id, {
        ...productForm,
        discountPrice: productForm.discountPrice || null,
        hoverImage: productForm.hoverImage || null
      });
      if (res.success) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        // Refresh local data
        refreshData();
      } else {
        alert('Error: ' + res.error);
      }
    } else {
      // Add mode
      const res = await createProduct({
        ...productForm,
        discountPrice: productForm.discountPrice || null,
        hoverImage: productForm.hoverImage || null
      });
      if (res.success) {
        alert('Product created successfully!');
        setIsAddingProduct(false);
        refreshData();
      } else {
        alert('Error: ' + res.error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res.success) {
        refreshData();
      }
    }
  };

  const handleDuplicateProduct = async (product: any) => {
    const res = await createProduct({
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
      description: product.description,
      details: product.details,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      image: product.image,
      hoverImage: product.hoverImage,
      images: product.images,
      stock: product.stock,
      specs: product.specs,
      compatibility: product.compatibility,
      isFeatured: false
    });
    if (res.success) {
      refreshData();
    }
  };

  // Handlers for Stock & Orders
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

  // Coupons
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

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + couponForm.expiresInDays);
    const res = await createCoupon({
      code: couponForm.code.toUpperCase(),
      discountType: couponForm.discountType,
      discountValue: couponForm.discountValue,
      expiresAt: expiry
    });
    if (res.success) {
      alert('Coupon created successfully!');
      setCouponForm({ code: '', discountType: 'PERCENT', discountValue: 15, expiresInDays: 30 });
      refreshData();
    } else {
      alert('Error creating coupon.');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Delete this coupon?')) {
      const res = await deleteCoupon(id);
      if (res.success) {
        refreshData();
      }
    }
  };

  // Reviews
  const handleDeleteReview = async (id: string) => {
    if (confirm('Delete this review?')) {
      const res = await deleteReview(id);
      if (res.success) {
        refreshData();
      }
    }
  };

  const refreshData = async () => {
    // We can run inline refresh by fetching admin payload
    const response = await fetch('/api/admin/data');
    if (response.ok) {
      const fresh = await response.json();
      setData(fresh);
    } else {
      // Fallback: reload page
      window.location.reload();
    }
  };

  // Filters
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Sidebar list
  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: Package },
    { name: 'Categories', icon: FolderTree },
    { name: 'Device Models', icon: Smartphone },
    { name: 'Colors', icon: Palette },
    { name: 'Materials', icon: Hammer },
    { name: 'Inventory', icon: Boxes },
    { name: 'Orders', icon: ShoppingBag },
    { name: 'Customers', icon: Users },
    { name: 'Discounts', icon: Percent },
    { name: 'Reviews', icon: MessageSquare },
    { name: 'Banners', icon: ImageIcon },
    { name: 'Blog', icon: BookOpen },
    { name: 'SEO', icon: Globe },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Payments', icon: CreditCard },
    { name: 'Shipping', icon: Truck },
    { name: 'Settings', icon: Settings },
    { name: 'Staff Accounts', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-bg-surface border-r border-border-subtle flex flex-col">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-accent-secondary uppercase tracking-[0.15em]">Control Panel</span>
            <h2 className="font-serif-display text-lg font-bold text-text-primary tracking-wider">Avenoir Admin</h2>
          </div>
          <span className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse flex-shrink-0" />
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide max-h-[300px] md:max-h-none">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSearchQuery('');
                  setEditingProduct(null);
                  setIsAddingProduct(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Administrative Container */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span>Admin /</span>
              <span className="font-semibold text-accent-primary">{activeTab}</span>
            </div>
            <h1 className="font-serif-display text-2xl md:text-3xl font-bold text-text-primary mt-1">
              {activeTab}
            </h1>
          </div>

          {/* Quick Search */}
          {['Products', 'Orders', 'Inventory', 'Customers'].includes(activeTab) && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-surface border border-border-subtle rounded-xl pl-9 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          )}
        </div>

        {/* Tab content renders */}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Total Sales</span>
                <h3 className="font-serif-display text-2xl font-bold text-text-primary">${stats.totalRevenue.toFixed(2)}</h3>
                <p className="text-[11px] text-green-700 font-medium">✦ 12% increase from last month</p>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Total Orders</span>
                <h3 className="font-serif-display text-2xl font-bold text-text-primary">{stats.totalOrders}</h3>
                <p className="text-[11px] text-text-secondary">All log orders counted</p>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Average Order Value</span>
                <h3 className="font-serif-display text-2xl font-bold text-text-primary">${stats.avgOrderValue.toFixed(2)}</h3>
                <p className="text-[11px] text-text-secondary">AOV based on checkouts</p>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">Conversion Rate</span>
                <h3 className="font-serif-display text-2xl font-bold text-text-primary">{stats.conversionRate}%</h3>
                <p className="text-[11px] text-green-700 font-medium">✦ Optimal checkout flow</p>
              </div>
            </div>

            {/* Sales Chart & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Revenue Timeline</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="#756D64" fontSize={10} />
                      <YAxis stroke="#756D64" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#8A7B6C" fill="#E8E0D2" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Low Stock Alerts card */}
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Low-Stock Warnings</h3>
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 4).map((p) => (
                      <div key={p.id} className="flex justify-between items-center text-xs py-1 border-b border-border-subtle pb-2">
                        <span className="font-medium text-text-primary truncate max-w-[130px]">{p.name}</span>
                        <span className="text-red-700 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px]">
                          {p.stock} left
                        </span>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <p className="text-xs text-text-secondary italic">All inventory levels optimized.</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('Inventory')}
                  className="w-full text-center text-xs text-accent-primary font-semibold hover:underline mt-4"
                >
                  Adjust Inventory levels &rarr;
                </button>
              </div>
            </div>

            {/* Recent Orders queue */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Recent Checkout Queue</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-subtle text-text-secondary text-[10px] uppercase font-semibold">
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Payment Status</th>
                      <th className="pb-3">Fulfillment</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 3).map((o) => (
                      <tr key={o.id} className="border-b border-border-subtle last:border-b-0">
                        <td className="py-3">
                          <div className="font-semibold text-text-primary">{o.customerName}</div>
                          <div className="text-[10px] text-text-secondary">{o.customerEmail}</div>
                        </td>
                        <td className="py-3 font-semibold">${o.total.toFixed(2)}</td>
                        <td className="py-3 text-green-700 font-medium">Paid (Stripe)</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            o.status === 'DELIVERED' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-orange-50 border border-orange-200 text-orange-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setActiveTab('Orders')}
                            className="text-accent-primary hover:underline font-semibold"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'Products' && (
          <div className="space-y-6 animate-fade-in">
            {/* Conditional Product Form Editor */}
            {isAddingProduct || editingProduct ? (
              <form onSubmit={handleSaveProduct} className="bg-bg-surface border border-border-subtle rounded-2xl p-6 space-y-6 shadow-sm max-w-3xl">
                <div className="flex justify-between items-center border-b border-border-subtle pb-4">
                  <h3 className="font-serif-display text-lg font-bold text-text-primary">
                    {editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Product'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="text-xs text-text-secondary hover:text-text-primary underline"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-accent-primary uppercase tracking-wider">Basic Specs</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">Product Name</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">URL Slug</label>
                      <input
                        type="text"
                        required
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-accent-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-text-secondary uppercase">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-text-secondary uppercase">Discount Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.discountPrice}
                          onChange={(e) => setProductForm({ ...productForm, discountPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                      >
                        <option value="cases">Phone Cases</option>
                        <option value="chargers">GaN Chargers</option>
                        <option value="cables">Braided Cables</option>
                        <option value="audio">AirPods Cases</option>
                        <option value="protectors">Screen Protectors</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>

                  {/* Media & Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-accent-primary uppercase tracking-wider">Assets & Spacing</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">Primary Image URL</label>
                      <input
                        type="text"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">Hover Image URL</label>
                      <input
                        type="text"
                        value={productForm.hoverImage}
                        onChange={(e) => setProductForm({ ...productForm, hoverImage: e.target.value })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">Device Compatibility (comma separated)</label>
                      <input
                        type="text"
                        value={productForm.compatibility}
                        onChange={(e) => setProductForm({ ...productForm, compatibility: e.target.value })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase">Initial Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase block">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>

                {/* Variants generation panel */}
                <div className="space-y-3 border-t border-border-subtle pt-4">
                  <h4 className="text-xs font-bold text-accent-primary uppercase tracking-wider">Product Variants System</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-bg-base p-4 rounded-xl">
                    <input
                      type="text"
                      placeholder="Color Name (e.g. Cobalt)"
                      value={newVarColor}
                      onChange={(e) => setNewVarColor(e.target.value)}
                      className="bg-bg-surface border border-border-subtle rounded-lg px-2 py-1 text-xs text-text-primary"
                    />
                    <input
                      type="text"
                      placeholder="Hex Code (e.g. #3b82f6)"
                      value={newVarHex}
                      onChange={(e) => setNewVarHex(e.target.value)}
                      className="bg-bg-surface border border-border-subtle rounded-lg px-2 py-1 text-xs text-text-primary"
                    />
                    <input
                      type="number"
                      placeholder="Price Add (+5.0)"
                      value={newVarPriceMod || ''}
                      onChange={(e) => setNewVarPriceMod(parseFloat(e.target.value) || 0)}
                      className="bg-bg-surface border border-border-subtle rounded-lg px-2 py-1 text-xs text-text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newVarColor) return;
                        setProductForm({
                          ...productForm,
                          variants: [...productForm.variants, { color: newVarColor, colorHex: newVarHex, priceModifier: newVarPriceMod, stock: newVarStock }]
                        });
                        setNewVarColor('');
                      }}
                      className="bg-accent-primary text-white text-[10px] font-semibold py-1 rounded-lg hover:opacity-90"
                    >
                      Add Variant
                    </button>
                  </div>
                  {/* Variant lists */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {productForm.variants.map((v, i) => (
                      <span key={i} className="text-[10px] font-medium bg-bg-elevated border border-border-subtle px-2.5 py-1 rounded-full flex items-center gap-1.5 text-text-primary">
                        <span className="w-2.5 h-2.5 rounded-full border border-border-subtle" style={{ backgroundColor: v.colorHex }} />
                        <span>{v.color} (+${v.priceModifier})</span>
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, variants: productForm.variants.filter((_, idx) => idx !== i) })}
                          className="text-red-700 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-border-subtle pt-4">
                  <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded border-border-subtle text-accent-primary"
                    />
                    <span>Mark as Featured Product</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent-primary hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all"
                >
                  {editingProduct ? 'Update Manifest Record' : 'Publish Product & Seed'}
                </button>
              </form>
            ) : (
              // Products List Table
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Active Armory Items</h3>
                  <button
                    onClick={() => {
                      setProductForm({
                        name: '',
                        slug: '',
                        description: '',
                        details: '',
                        price: 55,
                        discountPrice: 0,
                        category: 'cases',
                        image: '/images/carbon-monolith-1.webp',
                        hoverImage: '',
                        images: '[]',
                        stock: 100,
                        specs: '{"Material":"Aramid Fiber","Drop Protection":"10m"}',
                        compatibility: 'iPhone 16 Pro, iPhone 16 Pro Max',
                        isFeatured: false,
                        variants: []
                      });
                      setIsAddingProduct(true);
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-accent-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Create Product</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle text-text-secondary text-[10px] uppercase font-semibold">
                        <th className="pb-3">Product Info</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3 text-center">Stock</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="border-b border-border-subtle last:border-b-0 hover:bg-bg-base/20 transition-all">
                          <td className="py-4">
                            <div className="font-semibold text-text-primary">{p.name}</div>
                            <div className="text-[10px] text-text-secondary">{p.compatibility}</div>
                          </td>
                          <td className="py-4 font-medium uppercase text-[10px] tracking-wider text-accent-primary">
                            {p.category}
                          </td>
                          <td className="py-4 font-semibold text-text-primary">
                            {p.discountPrice ? (
                              <div className="flex items-center gap-1.5">
                                <span>${p.discountPrice.toFixed(2)}</span>
                                <span className="text-[10px] text-text-tertiary line-through">${p.price.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span>${p.price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="py-4 text-center font-bold">
                            <span className={p.stock <= 10 ? 'text-red-700' : 'text-text-primary'}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              title="Duplicate"
                              className="p-1.5 rounded-lg bg-bg-base hover:bg-bg-elevated text-text-secondary transition-all"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setProductForm({
                                  name: p.name,
                                  slug: p.slug,
                                  description: p.description,
                                  details: p.details || '',
                                  price: p.price,
                                  discountPrice: p.discountPrice || 0,
                                  category: p.category,
                                  image: p.image,
                                  hoverImage: p.hoverImage || '',
                                  images: p.images || '[]',
                                  stock: p.stock,
                                  specs: p.specs || '{}',
                                  compatibility: p.compatibility,
                                  isFeatured: p.isFeatured,
                                  variants: p.variants || []
                                });
                                setEditingProduct(p);
                              }}
                              title="Edit"
                              className="p-1.5 rounded-lg bg-bg-base hover:bg-bg-elevated text-text-secondary transition-all"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-all border border-red-100"
                            >
                              <Trash2 size={13} />
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
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'Categories' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">E-Commerce Categories Directory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-text-primary">Phone Cases</span>
                  <span className="text-xs text-text-secondary bg-bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Category</span>
                </div>
                <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-text-primary">AirPods Cases</span>
                  <span className="text-xs text-text-secondary bg-bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Category</span>
                </div>
                <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-text-primary">GaN Chargers</span>
                  <span className="text-xs text-text-secondary bg-bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Category</span>
                </div>
                <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-text-primary">Braided Cables</span>
                  <span className="text-xs text-text-secondary bg-bg-surface px-2.5 py-1 rounded-full border border-border-subtle">Category</span>
                </div>
              </div>
              <div className="p-5 bg-bg-elevated/35 border border-border-subtle rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">Category SEO Configuration</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  You can bind custom SEO descriptions and slugs to each category directory from the central SEO Settings tab. Categories maps automatically into home page scroll strips.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEVICE MODELS */}
        {activeTab === 'Device Models' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Supported Device Matrices</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['iPhone 16 Pro', 'iPhone 16 Pro Max', 'Galaxy S25 Ultra', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'AirPods Pro 2', 'AirPods 4'].map((d) => (
                <div key={d} className="p-4 bg-bg-base border border-border-subtle rounded-xl text-center font-medium text-xs text-text-primary shadow-sm hover:border-accent-primary transition-colors cursor-pointer">
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COLORS */}
        {activeTab === 'Colors' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Colorways Directory</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'Obsidian Black', hex: '#0D0D0D' },
                { name: 'Electric Cyan', hex: '#22D3EE' },
                { name: 'Sandstone Grey', hex: '#78716C' },
                { name: 'Satin Cream', hex: '#F5F5F4' },
                { name: 'Espresso Brown', hex: '#4A3728' }
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2 px-4 py-2 bg-bg-base border border-border-subtle rounded-full text-xs text-text-primary shadow-sm">
                  <span className="w-3.5 h-3.5 rounded-full border border-border-subtle" style={{ backgroundColor: c.hex }} />
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-[10px] text-text-secondary">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: MATERIALS */}
        {activeTab === 'Materials' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Structural Synthetics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Aerospace Aramid Fiber', 'Double-Ion Exchange Glass', 'Anodized 6000-series Aluminum', 'Full-Grain Calf Leather', 'Liquid Silicone Matrix'].map((m) => (
                <div key={m} className="p-4 bg-bg-base border border-border-subtle rounded-xl text-center text-xs font-semibold text-text-primary">
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: INVENTORY */}
        {activeTab === 'Inventory' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Inventory Stock Tuning</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary text-[10px] uppercase font-semibold">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-center">Remaining Quantity</th>
                    <th className="pb-3 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b border-border-subtle last:border-b-0">
                      <td className="py-4 font-medium text-text-primary">{p.name}</td>
                      <td className="py-4 text-text-secondary uppercase text-[10px] tracking-wider">{p.category}</td>
                      <td className="py-4 text-center font-bold font-mono">
                        <span className={p.stock <= 10 ? 'text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full' : 'text-text-primary'}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="inline-flex items-center gap-1 border border-border-subtle rounded-lg bg-bg-base overflow-hidden">
                          <button
                            onClick={() => handleStockUpdate(p.id, p.stock - 1)}
                            className="px-2.5 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-text-primary">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleStockUpdate(p.id, p.stock + 1)}
                            className="px-2.5 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
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
        )}

        {/* TAB 8: ORDERS */}
        {activeTab === 'Orders' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Orders Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary text-[10px] uppercase font-semibold">
                    <th className="pb-3">Order Code</th>
                    <th className="pb-3">Customer Profile</th>
                    <th className="pb-3">Revenue total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border-subtle last:border-b-0">
                      <td className="py-4 font-mono text-text-primary truncate max-w-[100px]">#{o.id}</td>
                      <td className="py-4">
                        <div className="font-semibold text-text-primary">{o.customerName}</div>
                        <div className="text-[10px] text-text-secondary">{o.customerEmail}</div>
                      </td>
                      <td className="py-4 font-semibold text-text-primary">${o.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          o.status === 'DELIVERED' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-orange-50 border border-orange-200 text-orange-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'SHIPPED')}
                            className="bg-accent-primary hover:opacity-90 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Dispatch Package
                          </button>
                        )}
                        {o.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleStatusUpdate(o.id, 'DELIVERED')}
                            className="bg-green-700 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button
                          onClick={() => alert(`Customer Address Details:\nName: ${o.customerName}\nEmail: ${o.customerEmail}\nAddress: ${o.shippingAddress}`)}
                          className="bg-bg-base hover:bg-bg-elevated text-text-primary text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-border-subtle"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: CUSTOMERS */}
        {activeTab === 'Customers' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Registered Customer Profiles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary text-[10px] uppercase font-semibold">
                    <th className="pb-3">Customer Info</th>
                    <th className="pb-3">Account Level</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border-subtle last:border-b-0">
                      <td className="py-3">
                        <div className="font-semibold text-text-primary">{o.customerName}</div>
                        <div className="text-[10px] text-text-secondary">{o.customerEmail}</div>
                      </td>
                      <td className="py-3 text-[10px] font-semibold text-accent-secondary uppercase">
                        Verified checkout user
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-[10px] text-text-secondary">Orders: 1 spent: ${o.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: DISCOUNTS */}
        {activeTab === 'Discounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Coupon Creator */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-1 h-fit">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                Create Coupon Code
              </h3>
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EXTRA15"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: parseInt(e.target.value) || 0 })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase">Expires in (Days)</label>
                  <input
                    type="number"
                    required
                    value={couponForm.expiresInDays}
                    onChange={(e) => setCouponForm({ ...couponForm, expiresInDays: parseInt(e.target.value) || 0 })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent-primary text-white font-semibold py-2.5 rounded-xl text-xs hover:opacity-90"
                >
                  Generate Coupon
                </button>
              </form>
            </div>

            {/* Coupons list */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
                Coupons Ledger
              </h3>
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex justify-between items-center p-4 bg-bg-base border border-border-subtle rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold text-text-primary">{coupon.code}</span>
                      <p className="text-[10px] text-text-secondary">
                        {coupon.discountType === 'PERCENT' ? `Discount: ${coupon.discountValue}%` : `Discount: $${coupon.discountValue}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCouponToggle(coupon.id, !coupon.isActive)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${
                          coupon.isActive
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-bg-elevated text-text-tertiary border-border-subtle'
                        }`}
                      >
                        {coupon.isActive ? 'ACTIVE' : 'MUTED'}
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-700 hover:text-red-950 p-1.5 bg-bg-elevated rounded-lg"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: REVIEWS */}
        {activeTab === 'Reviews' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Reviews Feed Queue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-bg-base border border-border-subtle rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-text-primary">{r.userName}</span>
                      <span className="text-[10px] text-accent-secondary uppercase font-semibold">{r.product.name}</span>
                    </div>
                    <p className="text-xs text-text-secondary italic">&ldquo;{r.comment}&rdquo;</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-border-subtle/50 pt-3">
                    <span className="text-[10px] text-text-tertiary">Rating: {r.rating} / 5</span>
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-red-700 hover:underline text-[10px] font-bold"
                    >
                      Delete review
                    </button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-xs text-text-secondary italic">No product reviews found.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 12: BANNERS */}
        {activeTab === 'Banners' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
              Hero Banner Customizer
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Hero Title</label>
                <input
                  type="text"
                  value={bannerForm.headline}
                  onChange={(e) => setBannerForm({ ...bannerForm, headline: e.target.value })}
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Hero Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase">Primary Button Label</label>
                  <input
                    type="text"
                    value={bannerForm.primaryBtn}
                    onChange={(e) => setBannerForm({ ...bannerForm, primaryBtn: e.target.value })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary uppercase">Secondary Button Label</label>
                  <input
                    type="text"
                    value={bannerForm.secondaryBtn}
                    onChange={(e) => setBannerForm({ ...bannerForm, secondaryBtn: e.target.value })}
                    className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Homepage custom layout saved successfully!')}
                className="w-full bg-accent-primary text-white text-xs font-semibold py-2.5 rounded-xl uppercase tracking-wider hover:opacity-90"
              >
                Apply Changes to Homepage
              </button>
            </div>
          </div>
        )}

        {/* TAB 13: BLOG */}
        {activeTab === 'Blog' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Content blog & Articles</h3>
            <div className="space-y-4">
              {[
                { title: 'Best Mobile Covers for iPhone 16 Pro', cat: 'Buying Guides' },
                { title: 'Silicone vs TPU Phone Cases: The Complete Breakdown', cat: 'Product Comparisons' },
                { title: 'How to Choose the Right GaN Charger', cat: 'Charging Tips' }
              ].map((post, idx) => (
                <div key={idx} className="p-4 bg-bg-base border border-border-subtle rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-xs text-text-primary">{post.title}</h4>
                    <span className="text-[10px] text-text-secondary uppercase mt-0.5 block">{post.cat}</span>
                  </div>
                  <span className="text-[10px] bg-bg-surface border border-border-subtle px-2 py-1 rounded-full text-text-primary font-mono">
                    Published
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 14: SEO */}
        {activeTab === 'SEO' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
              SEO & Schema configuration
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Meta Title Tag</label>
                <input
                  type="text"
                  value={seoForm.title}
                  onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Meta Description</label>
                <textarea
                  rows={3}
                  value={seoForm.description}
                  onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Meta Keywords (comma separated)</label>
                <input
                  type="text"
                  value={seoForm.keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => alert('Search tags updated. Sitemap regenerated.')}
                className="w-full bg-accent-primary text-white text-xs font-semibold py-2.5 rounded-xl uppercase tracking-wider hover:opacity-90"
              >
                Sync SEO Meta
              </button>
            </div>
          </div>
        )}

        {/* TAB 15: ANALYTICS */}
        {activeTab === 'Analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* Area & Bar charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Weekly Net Profit</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Mon', profit: 90 },
                      { name: 'Tue', profit: 130 },
                      { name: 'Wed', profit: 110 },
                      { name: 'Thu', profit: 240 },
                      { name: 'Fri', profit: 160 }
                    ]}>
                      <XAxis dataKey="name" fontSize={10} stroke="#756D64" />
                      <YAxis fontSize={10} stroke="#756D64" />
                      <Tooltip />
                      <Bar dataKey="profit" fill="#8A7B6C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Sales by Category</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Phone Cases', value: 65 },
                          { name: 'GaN Chargers', value: 20 },
                          { name: 'Braided Cables', value: 10 },
                          { name: 'Accessories', value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.topSelling.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 text-xs text-text-secondary pl-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A7B6C]" />
                      <span>Cases (65%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B49A78]" />
                      <span>Chargers (20%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D8CFC2]" />
                      <span>Cables (10%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 16: PAYMENTS */}
        {activeTab === 'Payments' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Gateway Configuration</h3>
            <div className="space-y-4">
              <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-text-primary">Stripe Payments</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Supports major credit cards, Apple Pay, Google Pay.</p>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full uppercase">
                  Connected
                </span>
              </div>
              <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between opacity-60">
                <div>
                  <h4 className="font-semibold text-xs text-text-primary">PayPal integration</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">Express checkout for buyers.</p>
                </div>
                <span className="text-[10px] font-bold text-text-tertiary bg-bg-elevated border border-border-subtle px-2.5 py-1 rounded-full uppercase">
                  Disconnected
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 17: SHIPPING */}
        {activeTab === 'Shipping' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Shipping Zones & Rates</h3>
            <div className="space-y-4">
              <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-xs text-text-primary">North America Zone</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">USA, Canada, and Mexico shipping coverage.</p>
                </div>
                <span className="text-xs font-semibold text-accent-primary">Free on orders &gt; $100</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 18: SETTINGS */}
        {activeTab === 'Settings' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3">
              Operational Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Store Name</label>
                <input
                  type="text"
                  value="Avenoir Store"
                  disabled
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none opacity-80"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">Support Email Address</label>
                <input
                  type="text"
                  defaultValue="support@avenoir.com"
                  className="w-full bg-bg-base border border-border-subtle rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => alert('Administrative settings synced.')}
                className="w-full bg-accent-primary text-white text-xs font-semibold py-2.5 rounded-xl uppercase tracking-wider hover:opacity-90"
              >
                Save configurations
              </button>
            </div>
          </div>
        )}

        {/* TAB 19: STAFF ACCOUNTS */}
        {activeTab === 'Staff Accounts' && (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Staff accounts & Permissions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-bg-base border border-border-subtle rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck size={20} className="text-accent-primary" />
                  <div>
                    <h4 className="font-semibold text-xs text-text-primary">Avenoir Admin (Owner)</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">admin@avenoir.com</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-accent-secondary bg-accent-secondary-soft border border-accent-secondary/20 px-2 py-0.5 rounded-full uppercase">
                  Full owner
                </span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
