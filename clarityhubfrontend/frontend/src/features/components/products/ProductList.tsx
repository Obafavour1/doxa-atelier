
import { useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard"; // Assuming I move ProductCard here
import { useProductStore } from "../../../stores/useProductStore";

const ProductList = () => {
  const { products, loading, fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h2 className="text-3xl font-extrabold text-rose-400 mb-8 text-center">
        Explore Our Products
      </h2>
      
      {products.length === 0 ? (
         <div className="text-center text-gray-400 text-xl">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
            <ProductCard key={product._id} product={product} />
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
