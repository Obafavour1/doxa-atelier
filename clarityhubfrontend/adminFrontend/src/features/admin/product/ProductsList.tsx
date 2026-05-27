import { motion } from "framer-motion";
import { Trash, Star, Loader } from "lucide-react";
import { useProducts, useDeleteProduct, useToggleFeatured } from "../../products/api/hooks";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const ProductsList = () => {
  const { data: products = [], isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleFeatured();

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-2xl overflow-hidden max-w-5xl mx-auto border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Featured
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-transparent divide-y divide-gray-700/50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-500 font-medium">
                  No products found. Start by creating one!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-rose-500/5 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 relative">
                        <img
                          className="h-12 w-12 rounded-xl object-cover border border-gray-700 group-hover:border-rose-500/30 transition-colors"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-rose-400">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-bold bg-gray-700 text-gray-300 rounded-full uppercase tracking-wider group-hover:bg-gray-600 transition-colors">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleMutation.mutate(product._id)}
                      disabled={toggleMutation.isPending}
                      className={`p-2 rounded-xl transition-all duration-300 transform active:scale-95 ${
                        product.isFeatured
                          ? "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"
                          : "bg-gray-700/50 text-gray-500 hover:bg-gray-700 hover:text-gray-400"
                      }`}
                      title={product.isFeatured ? "Unfeature Product" : "Feature Product"}
                    >
                      {toggleMutation.isPending && toggleMutation.variables === product._id ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Star className={`h-5 w-5 ${product.isFeatured ? "fill-current" : ""}`} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          deleteMutation.mutate(product._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 disabled:opacity-50 transform active:scale-95"
                    >
                      {deleteMutation.isPending && deleteMutation.variables === product._id ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsList;
