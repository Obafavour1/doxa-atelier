import {
  ChevronDown,
  Gift,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../features/cart/api/hooks";
import { useLogout, useMe } from "../features/auth/api/hooks/hooks";
import { categoriesData } from "../shared/lib/data";

const primaryLinks = [
  { name: "Build a box", href: "/category/gift-boxes" },
  { name: "Corporate gifting", href: "/category/corporate-gifting" },
  { name: "Our story", href: "/#our-story" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-3 py-2 text-[13px] font-semibold transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:bg-[var(--primary)] after:transition-transform ${
    isActive
      ? "text-[var(--primary)] after:scale-x-100"
      : "text-[var(--text-secondary)] after:scale-x-0 hover:text-[var(--text-primary)] hover:after:scale-x-100"
  }`;

export const Navbar = () => {
  const { data: user } = useMe();
  const { data: cart = [] } = useCart();
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5175";

  useEffect(() => {
    setShopOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShopOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShopOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] shadow-[var(--shadow-sm)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
        <Link to="/" className="inline-flex shrink-0 items-center gap-2.5 text-[var(--text-primary)]" aria-label="DOXA Atelier home">
          <span className="brand-gradient grid h-10 w-10 place-items-center rounded-lg text-sm font-bold text-white shadow-md">DG</span>
          <span className="hidden text-base font-semibold tracking-tight sm:inline xl:text-lg">DOXA Atelier</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          <div ref={menuRef}>
            <button
              type="button"
              onClick={() => setShopOpen((open) => !open)}
              aria-expanded={shopOpen}
              aria-controls="shop-menu"
              className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Shop gifts
              <ChevronDown size={15} className={`transition-transform ${shopOpen ? "rotate-180" : ""}`} />
            </button>

            {shopOpen && (
              <MotionMenu />
            )}
          </div>

          {primaryLinks.map((item) => (
            <NavLink key={item.name} to={item.href} className={navLinkClass}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] bg-white/75 text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              aria-label={`Shopping cart with ${cart.length} item${cart.length === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold text-white">{cart.length}</span>
              )}
            </Link>
          )}

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                {user.role === "admin" && (
                  <a href={adminUrl} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/75 px-4 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--petal)]">
                    <LayoutDashboard size={15} /> Admin
                  </a>
                )}
                <button onClick={() => logout()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/75 px-4 text-xs font-semibold text-[var(--text-primary)] transition hover:bg-[var(--petal)]">
                  <LogOut size={15} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="inline-flex min-h-10 items-center px-3 text-sm font-semibold text-[var(--text-primary)] transition hover:text-[var(--primary)]">Login</Link>
                <Link to="/signup" className="brand-button min-h-10 px-4"><UserPlus size={15} /> Sign up</Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] bg-white/75 text-[var(--text-primary)] lg:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-5 shadow-[var(--shadow-lg)] lg:hidden">
          <div className="mx-auto max-w-7xl">
            <p className="doxa-label mb-3 text-[var(--primary)]">Shop by collection</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {categoriesData.map((category) => (
                <Link key={category.slug} to={`/category/${category.slug}`} className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--cream)] p-3 transition hover:border-[var(--border-heavy)]">
                  <img src={category.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
                  <span><span className="block text-sm font-semibold text-[var(--text-primary)]">{category.name}</span><span className="mt-0.5 block text-xs text-[var(--text-secondary)]">{category.description}</span></span>
                </Link>
              ))}
            </div>
            <div className="my-5 h-px bg-[var(--border-subtle)]" />
            <div className="grid gap-1">
              {primaryLinks.map((item) => <Link key={item.name} to={item.href} className="rounded-lg px-3 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--petal)]">{item.name}</Link>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-5">
              {user ? (
                <>
                  {user.role === "admin" && <a href={adminUrl} className="brand-button"><LayoutDashboard size={15} /> Admin dashboard</a>}
                  <button onClick={() => logout()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-5 text-sm font-semibold"><LogOut size={16} /> Log out</button>
                </>
              ) : (
                <><Link to="/signup" className="brand-button"><UserPlus size={16} /> Create account</Link><Link to="/login" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-5 text-sm font-semibold"><LogIn size={16} /> Login</Link></>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const MotionMenu = () => (
  <div id="shop-menu" className="fixed left-1/2 top-[72px] w-[min(1100px,calc(100vw-48px))] -translate-x-1/2 border-x border-b border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-lg)]">
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div><p className="doxa-label text-[var(--primary)]">The gift edit</p><h2 className="mt-1 text-xl font-medium text-[var(--text-primary)]">Shop by collection</h2></div>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--text-tertiary)]"><Sparkles size={13} /> Curated with intention</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categoriesData.map((category) => (
            <Link key={category.slug} to={`/category/${category.slug}`} className="group flex gap-3 rounded-lg border border-transparent p-3 transition hover:border-[var(--border-subtle)] hover:bg-[var(--cream)]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--primary-muted)] text-[var(--primary)]"><Gift size={17} /></span>
              <span><span className="block text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)]">{category.name}</span><span className="mt-1 block text-xs leading-4 text-[var(--text-secondary)]">{category.description}</span></span>
            </Link>
          ))}
        </div>
      </div>
      <Link to="/category/gift-boxes" className="group relative min-h-72 overflow-hidden rounded-lg bg-[var(--noir)]">
        <img src="/doxa-nav-gift-collection.png" alt="Curated DOXA gift collection" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)]/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="doxa-label text-white/70">Featured collection</p><p className="mt-2 text-xl font-semibold">The art of thoughtful giving</p><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold">Explore gift boxes <ChevronDown size={14} className="-rotate-90" /></span></div>
      </Link>
    </div>
  </div>
);
