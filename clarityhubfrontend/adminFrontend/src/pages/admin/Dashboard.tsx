import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  ArrowUpRight,
  MoreVertical,
  Calendar,
  Filter,
  CreditCard
} from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { AnalyticsData, Order, Product } from "../../types/api";
import { motion } from "framer-motion";

const StatCard = ({ title, value, growth, icon: Icon, trend }: any) => (
  <div className="admin-card p-6 flex flex-col justify-between group h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-[var(--primary-muted)] flex items-center justify-center text-[var(--primary)] transition-transform group-hover:scale-110">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend === 'up' ? 'text-rose-500 bg-rose-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {growth}%
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-[var(--text-secondary)]">{title}</p>
      <h3 className="text-3xl font-black mt-1 tracking-tight text-[var(--text-primary)]">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, orders, stock] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getAnalytics().then(() => []), // Placeholder for recent orders
          adminService.getAnalytics().then(() => []) // Placeholder for stock
        ]);
        setAnalytics(stats);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Overview</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
             <Calendar size={18} /> Last 7 Days
           </button>
           <button className="admin-btn admin-btn-primary">
             <Filter size={18} /> Filters
           </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${analytics?.revenue?.toLocaleString() || "0"}`} 
          growth={analytics?.revenueGrowth || 0}
          icon={DollarSign}
          trend="up"
        />
        <StatCard 
          title="Total Orders" 
          value={analytics?.orders?.toLocaleString() || "0"} 
          growth={analytics?.salesGrowth || 0}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard 
          title="Total Customers" 
          value={analytics?.customers?.toLocaleString() || "0"} 
          growth={12}
          icon={Users}
          trend="up"
        />
        <StatCard 
          title="Products Sold" 
          value="1,240" 
          growth={4}
          icon={Package}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 admin-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Revenue Evolution</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Comparison between actual and target performance.</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border-subtle)]">
                 <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                 <span className="text-[10px] font-bold text-[var(--text-secondary)]">Revenue</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border-subtle)]">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-[10px] font-bold text-[var(--text-secondary)]">Target</span>
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full bg-[var(--surface-hover)] rounded-2xl flex items-center justify-center border border-dashed border-[var(--border-heavy)] text-[var(--text-tertiary)] font-bold italic">
            [ Interactive Chart Placeholder ]
          </div>
        </div>

        {/* Sidebar Mini List */}
        <div className="admin-card overflow-hidden h-full flex flex-col">
          <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight">Top Products</h3>
            <button className="text-[var(--primary)] text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border-subtle)] last:border-0">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-muted)] overflow-hidden shrink-0">
                   <img src={`https://placehold.co/100x100/png?text=P${i}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold truncate">Premium Product {i}</p>
                   <p className="text-xs text-[var(--text-secondary)] mt-0.5">Fashion • 240 sales</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-[var(--text-primary)]">$199</p>
                   <p className="text-[10px] text-rose-500 font-bold mt-0.5">+12.5%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="admin-card overflow-hidden">
        <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tighter">Recent Transactions</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">Monitoring latest orders and payment statuses across all regions.</p>
          </div>
          <button className="admin-btn bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-sm font-bold hover:bg-[var(--bg-main)]">
            Explore All Activities
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--bg-sidebar)]/50 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                <th className="px-8 py-5 border-b border-[var(--border-subtle)]">Customer</th>
                <th className="px-8 py-5 border-b border-[var(--border-subtle)]">Date</th>
                <th className="px-8 py-5 border-b border-[var(--border-subtle)]">Status</th>
                <th className="px-8 py-5 border-b border-[var(--border-subtle)]">Amount</th>
                <th className="px-8 py-5 border-b border-[var(--border-subtle)]">Method</th>
                <th className="px-8 py-5 border-b border-[var(--border-subtle)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="hover:bg-[var(--surface-hover)] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] flex items-center justify-center font-bold text-sm">JD</div>
                      <div>
                        <p className="text-sm font-bold">John Doe {i}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">john@example.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-[var(--text-secondary)] font-medium">Apr 12, 2026</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500">
                      Completed
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-[var(--text-primary)]">$1,240.50</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                       <CreditCard size={14} />
                       <span className="text-xs font-bold">•••• 4242</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 rounded-lg hover:bg-[var(--bg-main)] border border-transparent hover:border-[var(--border-subtle)] transition-all">
                      <MoreVertical size={16} className="text-[var(--text-secondary)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
