import { motion } from "framer-motion";
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
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center mt-6">
          {recommendations.map((product: IProduct) => (
            <div key={product._id} className="shadow-xl w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-rose-500/50 transition-all duration-300">
              <div className="overflow-hidden h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="px-4 py-4 bg-gray-900/40">
                <h3 className="text-white font-medium mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-rose-400 font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    disabled={addToCartMutation.isPending}
                    type="button"
                    onClick={() => handleAddCart(product._id)}
                    className="bg-rose-600 hover:bg-rose-500 rounded-full cursor-pointer px-4 py-1.5 text-xs text-white font-bold transition-colors duration-200 disabled:opacity-50"
                  >
                    {addToCartMutation.isPending ? "..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeProduct;
