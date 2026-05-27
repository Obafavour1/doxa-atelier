import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRecommendations } from "../api/hooks";
import { useAddToCart } from "../../cart/api/hooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import type { IProduct } from "../api/product.types";

const HomeProduct = () => {
  const { data: recommendations = [], isLoading } = useRecommendations();
  const addToCartMutation = useAddToCart();

  const handleAddCart = (id: string) => {
    addToCartMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product: IProduct) => (
          <article key={product._id} className="surface-card overflow-hidden rounded-xl bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative h-56 overflow-hidden bg-[var(--petal)]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 doxa-label text-[var(--primary)]">Seasonal</span>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h3 className="doxa-h2 line-clamp-1 text-[var(--text-primary)]">{product.name}</h3>
                <p className="doxa-caption text-[var(--text-secondary)]">Personalized keepsake · Gift-ready</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-[var(--primary)]">${product.price.toFixed(2)} CAD</p>
                <button
                  disabled={addToCartMutation.isPending}
                  type="button"
                  onClick={() => handleAddCart(product._id)}
                  className="brand-button min-h-10 px-4 disabled:opacity-50"
                >
                  <ShoppingCart size={16} />
                  {addToCartMutation.isPending ? "..." : "Add"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
};

export default HomeProduct;
