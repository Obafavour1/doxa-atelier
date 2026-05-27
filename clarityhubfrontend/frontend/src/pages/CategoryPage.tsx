import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../features/products/components/ProductCard";
import LoadingSpinner from "../shared/components/LoadingSpinner";
import { useProductsByCategory } from "../features/products/api/hooks";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { data: products = [], isLoading } = useProductsByCategory(category || "");

  const title = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Products";

  return (
    <div className="min-h-screen pt-20">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-rose-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {products.length === 0 ? (
              <h2 className="text-3xl font-semibold text-white/50 text-center col-span-full py-20">
                No products found in this category
              </h2>
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
