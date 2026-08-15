import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Sparkles } from "lucide-react";
import ProductCard from "../features/products/components/ProductCard";
import ProductCardSkeleton from "../features/products/components/ProductCardSkeleton";
import { useProductsByCategory } from "../features/products/api/hooks";
import { categoriesData } from "../shared/lib/data";
import Seo from "../shared/components/Seo";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { data: products = [], isLoading } = useProductsByCategory(category || "");

  const categoryDetails = categoriesData.find((item) => item.slug === category);
  const title = categoryDetails?.name || category?.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Products";

  return (
    <div className="min-h-screen">
      <Seo title={title} description={categoryDetails?.description || `Shop thoughtful ${title.toLowerCase()} curated by DOXA Atelier.`} image={categoryDetails?.imageUrl} />
      <section className="border-b border-[var(--border-subtle)] bg-white/55">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] transition hover:text-[var(--primary)]"><ArrowLeft size={14} /> Back to collections</Link>
          <motion.div
          className="mt-7 grid gap-5 md:grid-cols-[1fr_auto] md:items-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
            <div><p className="doxa-label text-[var(--primary)]">DOXA gift collection</p><h1 className="mt-2 text-4xl font-medium text-[var(--text-primary)] sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{categoryDetails?.description || "Thoughtfully selected gifts for meaningful moments."}</p></div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--cream)] px-4 py-2 text-xs font-semibold text-[var(--primary)]"><Sparkles size={14} /> {isLoading ? "Curating gifts…" : `${products.length} curated ${products.length === 1 ? "gift" : "gifts"}`}</span>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label={`Loading ${title}`}>
            {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
            <span className="sr-only">Loading {title}</span>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {products.length === 0 ? (
              <div className="col-span-full mx-auto max-w-md py-20 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--primary-muted)] text-[var(--primary)]"><Gift size={22} /></span><h2 className="mt-5 text-2xl font-medium text-[var(--text-primary)]">This collection is being curated</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">Come back soon, or explore our signature gift boxes in the meantime.</p><Link to="/category/gift-boxes" className="brand-button mt-6">Explore gift boxes</Link></div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
