import { useEffect, useState } from "react";
import { useCartStore } from "../../stores/useCartStore";
import { motion } from "framer-motion";
import type { IProduct } from "../../lib/utils";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import axiosInstance from "../../lib/axios";

const HomeProduct = () => {
  const { addToCart, loading } = useCartStore();

  const handleAddCart = (id: string) => {
    addToCart(id);
  };

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

  console.log(recommendations);
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center mt-6">
            {recommendations.map((product: IProduct) => (
              <div key={product._id} className=" shadow-xl w-full">
                <div className="bg-gray-400 rounded-t-lg ">
                  <img
                    src={product.image}
                    alt=""
                    className="rounded-t-lg bg-contain  w-full mx-auto h-96"
                  />
                </div>

                <div className="px-4 py-4 rounded-b-lg bg-gray-200/50">
                  {/* <p className="text-base  text-black w-[85%]">
          {product.desc.split(" ").slice(0, 5).join(" ") + "..."}
        </p> */}
                  <div className="flex items-center justify-between">
                    <p className="text-base text-black font-semibold">
                      {" "}
                      ${product.price}
                    </p>
                    <button
                      disabled={loading}
                      type="button"
                      onClick={() => handleAddCart(product._id)}
                      className={`${
                        loading ? "bg-gray-400" : "bg-gray-800"
                      } rounded-2xl cursor-pointer px-3 py-1 text-sm text-white/80 font-semibold `}
                    >
                      Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomeProduct;
