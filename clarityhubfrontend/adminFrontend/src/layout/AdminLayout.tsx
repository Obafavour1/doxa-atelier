import React, { Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Ticket,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Activity,
  CreditCard,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";
import { useLogout, useMe } from "../features/auth/api/hooks/hooks";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { group: "General", items: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: Activity },
  ]},
  { group: "Management", items: [
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Customers", href: "/customers", icon: Users },
  ]},
  { group: "Marketing", items: [
    { name: "Coupons", href: "/coupons", icon: Ticket },
  ]},
  { group: "System", items: [
    { name: "Settings", href: "/settings", icon: Settings },
  ]}
];

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('admin-theme') as 'light' | 'dark') || 'dark';
  });
  const { data: user, isLoading } = useMe();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col transition-all duration-300 ease-in-out z-50`}
      >
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)]">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold shrink-0">D</div>
            {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Doxa<span className="text-[var(--primary)] ml-0.5">Admin</span></span>}
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              {isSidebarOpen && (
                 <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-4">
                   {group.group}
                 </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                        isActive
                          ? "bg-[var(--primary)] text-black font-semibold shadow-[var(--shadow-md)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                      } ${!isSidebarOpen && "justify-center px-0"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-sidebar)]">
          <button
            onClick={() => logout()}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-colors ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[var(--bg-main)]">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border-subtle)] glass-morphism flex items-center justify-between px-8 z-40 sticky top-0">
          <div className="flex items-center gap-6 flex-1">
             <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
            >
              {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
            </button>

            <div className="hidden md:flex items-center gap-3 bg-[var(--surface-hover)] border border-[var(--border-subtle)] px-4 py-1.5 rounded-full w-full max-w-md group focus-within:border-[var(--primary)] transition-all">
              <Search size={16} className="text-[var(--text-tertiary)]" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-tertiary)]"
              />
              <div className="flex items-center gap-1 text-[10px] bg-[var(--bg-main)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-tertiary)] group-focus-within:hidden">
                <span className="font-mono">⌘</span>
                <span className="font-mono">K</span>
              </div>
          </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--bg-main)]"></span>
            </button>

            <div className="h-8 w-[1px] bg-[var(--border-subtle)] mx-2"></div>

            <Link to="/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-[var(--surface-hover)] transition-colors group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold leading-none">{user.firstName} {user.lastName}</span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider mt-1">Super Admin</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[var(--primary-muted)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
                 {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : <ShieldCheck size={20} className="text-[var(--primary)]" />}
              </div>
              <ChevronDown size={14} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={
                <div className="space-y-8 animate-pulse">
                  <div className="h-8 w-48 bg-[var(--surface-hover)] rounded-md"></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[var(--surface-hover)] rounded-2xl"></div>)}
                  </div>
                  <div className="h-96 bg-[var(--surface-hover)] rounded-3xl"></div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
