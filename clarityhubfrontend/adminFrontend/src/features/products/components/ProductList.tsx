import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useProducts } from "../api/hooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const ProductList = () => {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-rose-400 text-center mb-4">
          Explore Our Products
        </h2>
        <div className="h-1.5 w-24 bg-rose-500/30 rounded-full" />
      </div>
      
      {products.length === 0 ? (
         <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800">
           <p className="text-gray-500 text-xl font-medium italic">No products found in our catalog yet.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
