import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

import toast from "react-hot-toast";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { AxiosError } from "axios";
import type { IProduct } from "../api/product.types";
import axiosInstance from "../../../shared/lib/apiClient";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.get("/products/recommendations");
        setRecommendations(res.data.products);
        console.log(res.data);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          err?.response?.data.message ||
            "An error occurred while fetching recommendations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner label="Finding thoughtful pairings" compact />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-rose-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommendations.map((product: IProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
