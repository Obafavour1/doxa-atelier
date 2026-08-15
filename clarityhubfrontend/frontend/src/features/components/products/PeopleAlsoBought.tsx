import ProductCard from "./ProductCard";
import ProductCardSkeleton from "../../products/components/ProductCardSkeleton";
import { useRecommendations } from "../../products/api/hooks";
import type { IProduct } from "../../products/api/product.types";

const PeopleAlsoBought = () => {
  const { data: recommendations = [], isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading recommended products">
        {Array.from({ length: 3 }, (_, index) => <ProductCardSkeleton key={index} />)}
        <span className="sr-only">Loading recommended products</span>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-gray-900/20 rounded-3xl p-8 border border-gray-800">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-2 h-8 bg-rose-500 rounded-full" />
        People also <span className="text-rose-400">bought</span>
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.slice(0, 3).map((product: IProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {recommendations.length === 0 && (
          <p className="text-gray-500 italic col-span-full py-4 text-center">No recommendations available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
