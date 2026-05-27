import { ArrowLeft, ExternalLink, ShoppingBag, Star } from "lucide-react";
import { categoryHeroCopy, giftCategories, products } from "../data/landingData";

const shopUrl = "https://doxa-atelier.vercel.app/";

function getSelectedCategory() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "all";
}

export function GiftsPage() {
  const selectedCategory = getSelectedCategory();
  const activeCategory = giftCategories.some((category) => category.id === selectedCategory) ? selectedCategory : "all";
  const visibleProducts = activeCategory === "all" ? products : products.filter((product) => product.categoryId === activeCategory);
  const activeLabel = giftCategories.find((category) => category.id === activeCategory)?.label || "All gifts";

  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid min-h-[52vh] w-container items-center gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div>
          <a className="mb-8 inline-flex items-center gap-2 rounded-full border border-doxa-crimson/15 bg-white px-4 py-2 text-sm font-black text-doxa-noir shadow-sm transition hover:text-doxa-crimson" href="/">
            <ArrowLeft size={16} /> Back to home
          </a>
          <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">DOXA gift gallery</p>
          <h1 className="font-display text-[42px] font-bold leading-[1.02] text-doxa-noir md:text-[64px]">
            {activeLabel === "All gifts" ? "All curated gifts" : `${activeLabel} gifts`}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-doxa-slate">{categoryHeroCopy[activeCategory]}</p>
        </div>
        <div className="relative overflow-hidden rounded-lg shadow-doxa-xl">
          <img className="aspect-[1.25] w-full object-cover" src="/assets/hero-gift-set.jpg" alt="DOXA curated gift display" />
          <div className="absolute inset-0 bg-gradient-to-b from-doxa-noir/0 to-doxa-noir/60" />
          <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-white/85 p-4 text-sm font-extrabold text-doxa-noir backdrop-blur">
            Explore by category, compare gift styles, then continue to the DOXA ecommerce store.
          </div>
        </div>
      </section>

      <section className="mx-auto w-container pb-20">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {giftCategories.map((category) => (
            <a
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black shadow-sm transition ${
                activeCategory === category.id
                  ? "border-transparent bg-doxa-crimson text-white"
                  : "border-doxa-crimson/15 bg-white text-doxa-slate hover:border-doxa-crimson hover:text-doxa-crimson"
              }`}
              href={category.id === "all" ? "/gifts" : `/gifts?category=${category.id}`}
              key={category.id}
            >
              {category.label}
            </a>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((gift) => (
            <article className="group overflow-hidden rounded-lg border border-doxa-crimson/10 bg-white shadow-doxa transition hover:-translate-y-1 hover:shadow-doxa-xl" key={gift.title}>
              <div className="relative aspect-[1.1] overflow-hidden bg-doxa-petal">
                <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={gift.image} alt={gift.title} loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-extrabold text-doxa-crimson backdrop-blur">
                  {gift.badge}
                </span>
              </div>
              <div className="grid gap-5 p-5">
                <div>
                  <p className="mb-1.5 text-xs font-extrabold text-doxa-muted">{gift.category}</p>
                  <h2 className="text-xl font-bold leading-snug text-doxa-noir">{gift.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-doxa-slate">{gift.description}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-black text-doxa-crimson">
                    <Star size={15} fill="currentColor" /> {gift.rating}
                  </span>
                  <a className="inline-flex items-center gap-1.5 text-sm font-black text-doxa-indigo" href={shopUrl} target="_blank" rel="noreferrer">
                    Store <ExternalLink size={15} />
                  </a>
                </div>
                <a
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-doxa-noir px-5 text-sm font-black text-white transition hover:bg-doxa-crimson"
                  href={shopUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ShoppingBag size={17} /> Shop this category
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
