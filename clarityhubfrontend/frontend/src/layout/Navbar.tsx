import {
  LayoutDashboard,
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UserPlus,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../features/cart/api/hooks";
import { useMe, useLogout } from "../features/auth/api/hooks/hooks";

const navLinks = [
  { name: "Collections", href: "/" },
  { name: "Build a box", href: "/category/gift-boxes" },
  { name: "Corporate", href: "/category/corporate" },
  { name: "Our story", href: "/category/faith-collection" },
];

export const Navbar = () => {
  const { data: user } = useMe();
  const { data: cart = [] } = useCart();
  const { mutate: logout } = useLogout();
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5175";

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-header)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="inline-flex items-center gap-3 text-[var(--text-primary)]">
          <span className="grid h-10 w-10 place-items-center rounded-xl brand-gradient text-sm font-bold text-white shadow-md">DG</span>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">DOXA Gift Atelier</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-white/70 p-1 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  isActive ? "bg-[var(--primary)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--petal)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            {user.role === "admin" && (
              <a
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-white/70 px-3 py-2 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--petal)]"
                href={adminUrl}
              >
                <LayoutDashboard size={14} />
                Admin
              </a>
            )}

            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] bg-white/75 text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              aria-label="Go to cart"
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </Link>

            <div className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] bg-white/75 text-[var(--primary)]">
              <User size={16} />
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/75 px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--petal)]"
              onClick={() => logout()}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/signup" className="brand-button">
              <UserPlus size={16} />
              Sign up
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/75 px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--petal)]"
            >
              <LogIn size={16} />
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
