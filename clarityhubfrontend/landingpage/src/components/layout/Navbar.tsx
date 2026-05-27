import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../../data/landingData";
import { useScrolled } from "../../hooks/useScrolled";

const iconButton =
  "inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-doxa-crimson/15 bg-white/70 text-doxa-noir shadow-sm transition duration-200 hover:-translate-y-px";

export function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const isGiftPage = window.location.pathname === "/gifts";
  const linkHref = (href: string) => (isGiftPage && href.startsWith("#") ? `/${href}` : href);

  return (
    <header
      className={`sticky top-0 z-50 transition duration-200 ${
        scrolled ? "border-b border-doxa-crimson/10 bg-white/80 shadow-[0_18px_42px_rgba(26,10,18,0.07)] backdrop-blur-xl" : ""
      }`}
    >
      <nav className="mx-auto grid min-h-[76px] w-container grid-cols-[auto_1fr] items-center gap-4 lg:grid-cols-[auto_1fr_auto]" aria-label="Main navigation">
        <a className="inline-flex" href="#" aria-label="DOXA Gift Atelier home">
          <img className="h-12 w-[118px] object-contain object-left md:w-[142px]" src="/assets/logo-wide.png" alt="DOXA Gift Atelier" />
        </a>

        <div className="hidden justify-self-center rounded-full border border-doxa-crimson/15 bg-white/60 p-1 shadow-sm backdrop-blur lg:flex">
          {navItems.map((item) => (
            <a
              className="inline-flex min-h-[38px] items-center rounded-full px-3.5 text-[13px] font-bold text-doxa-noir transition hover:bg-doxa-petal hover:text-doxa-crimson"
              key={item.href}
              href={linkHref(item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2" aria-label="Commerce actions">
          <a className={`${iconButton} hidden w-auto gap-2 px-3 lg:inline-flex`} href="#products" aria-label="Search gifts">
            <Search size={18} />
            <span className="text-xs font-bold">Search gifts</span>
          </a>
          <a
            className="hidden min-h-[38px] items-center rounded-full bg-brand-gradient px-4 text-[13px] font-extrabold text-white shadow-brand transition hover:-translate-y-px md:inline-flex"
            href={linkHref("#order")}
          >
            Start request
          </a>
          <button
            className={`${iconButton} lg:hidden`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden ${menuOpen ? "grid" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="mx-auto mb-4 grid w-container gap-2 rounded-lg border border-doxa-crimson/10 bg-white/95 p-3 shadow-doxa backdrop-blur">
          {navItems.map((item) => (
            <a
              className="rounded-md px-4 py-3 text-sm font-extrabold text-doxa-noir transition hover:bg-doxa-petal hover:text-doxa-crimson"
              key={item.href}
              href={linkHref(item.href)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="mt-1 inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-gradient px-4 text-sm font-black text-white shadow-brand"
            href={linkHref("#order")}
            onClick={() => setMenuOpen(false)}
          >
            Start request
          </a>
        </div>
      </div>
    </header>
  );
}
