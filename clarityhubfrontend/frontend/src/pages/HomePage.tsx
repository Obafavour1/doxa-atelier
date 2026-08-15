import { ArrowRight, Gift, Heart, PackageCheck, Sparkles, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { categoriesData } from "../shared/lib/data";
import HomeProduct from "../features/products/components/HomeProduct";
import Seo from "../shared/components/Seo";
import ProductCard from "../features/products/components/ProductCard";
import { useFeaturedProducts } from "../features/products/api/hooks";
import LoadingSpinner from "../shared/components/LoadingSpinner";

const tags = [
  { label: "Birthday", slug: "birthday-gifts" },
  { label: "Curated boxes", slug: "gift-boxes" },
  { label: "Self-care", slug: "self-care" },
  { label: "Corporate", slug: "corporate-gifting" },
  { label: "Encouragement", slug: "faith-encouragement" },
  { label: "Personalized", slug: "personalized-gifts" },
];

const systemCards = [
  { icon: Gift, title: "Gift collection", text: "Personalized keepsakes, faith-infused collections, and timeless artistry." },
  { icon: Heart, title: "Curated with intention", text: "We craft experiences that spark joy, heal, and connect." },
  { icon: PackageCheck, title: "In stock seasonal", text: "Ready-to-adapt gift structures for quick, thoughtful ordering." },
  { icon: Truck, title: "Delivery-ready", text: "Built for elegant handoff, local delivery, and memorable unboxing." },
];

const HomePage = () => {
  const { data: featuredProducts = [], isLoading: featuredProductsLoading } = useFeaturedProducts();

  return (
    <div>
      <Seo description="Discover intentional gift boxes, personalized keepsakes, self-care collections, faith gifts, and corporate gifting curated by DOXA Atelier." />
      <section className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/80 px-3 py-2 doxa-label text-[var(--primary)]">
            <Sparkles size={14} />
            Gift Collection · Seasonal
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-[42px] font-medium leading-[0.98] text-[var(--text-primary)] md:text-[68px]">
              Gift Experiences curated with intention
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)]">
              We craft experiences that spark joy, heal, and connect. Build personalized gift boxes for birthdays, corporate moments, faith encouragement, self-care, and celebration.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#collection" className="brand-button">
              Shop collections <ArrowRight size={18} />
            </a>
            <Link
              to="/category/gift-boxes"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white px-5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--petal)]"
            >
              Build a box
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span key={tag.slug} className="rounded-full bg-[var(--petal)] px-3 py-1.5 doxa-caption text-[var(--primary)]">
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white p-3 shadow-lg">
            <img src="/doxa-hero.jpg" alt="DOXA curated gift set" className="h-[520px] w-full rounded-xl object-cover" />
          </div>
          <div className="absolute -bottom-5 left-5 right-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-lg backdrop-blur">
            {["New arrival", "In stock", "Faith collection"].map((item) => (
              <span key={item} className="rounded-xl bg-[var(--cream)] px-3 py-3 text-center doxa-label text-[var(--primary)]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-subtle)] bg-white/70 py-4">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 md:px-8">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              to={`/category/${tag.slug}`}
              className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="doxa-label text-[var(--primary)]">Gift product card</p>
            <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Every gift tells a story</h2>
          </div>
          <Link to="/category/gift-boxes" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            View catalogue <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredProductsLoading ? (
            <div className="col-span-full"><LoadingSpinner /></div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.slice(0, 3).map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="surface-card col-span-full rounded-xl p-8 text-center text-sm text-[var(--text-secondary)]">No featured gifts are available right now.</div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-12 md:grid-cols-4 md:px-8">
        {systemCards.map((card) => (
          <article key={card.title} className="surface-card rounded-xl p-5">
            <card.icon className="mb-5 text-[var(--primary)]" size={24} />
            <h3 className="doxa-h2 text-[var(--text-primary)]">{card.title}</h3>
            <p className="mt-2 doxa-caption text-[var(--text-secondary)]">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="bg-[var(--mist)] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="doxa-label text-[var(--primary)]">Recommended</p>
              <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Popular curated boxes</h2>
            </div>
            <div className="hidden items-center gap-1 text-[#f5a623] md:flex">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>
          <HomeProduct />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-6">
          <p className="doxa-label text-[var(--primary)]">Occasions</p>
          <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Shop by moment</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesData.map((category) => (
            <Link key={category.name} to={"/category" + category.href} className="group relative h-80 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white">
              <img src={category.imageUrl} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)]/80 via-[var(--noir)]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-2xl font-medium">{category.name}</h3>
                <p className="mt-2 doxa-caption text-white/80">Explore Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="brand-gradient rounded-2xl p-6 text-white shadow-lg md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="doxa-label text-white/75">Brand accent surface</p>
              <h2 className="mt-2 text-3xl font-medium">Need a custom gift box?</h2>
              <p className="mt-3 max-w-2xl text-white/80">Share recipient name, occasion, personal message, budget, and preferred delivery date. We will curate the story.</p>
            </div>
            <Link to="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[var(--primary)]">
              Start order <ArrowRight size={17} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
