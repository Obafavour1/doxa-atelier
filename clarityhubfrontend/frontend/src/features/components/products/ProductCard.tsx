// import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";
// import type { IProduct } from "../lib/utils";
import type { Product } from "./FeaturedProducts";
// import axiosInstance from "../lib/axios";
// import type { AxiosError } from "axios";

const ProductCard = ({ product }: { product: Product }) => {
  const { user } = useUserStore();
  const { addToCart, loading } = useCartStore();

  const handleAddCart = () => {
    addToCart(product?._id);
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-rose-400">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          disabled={loading}
          className={`${
            loading
              ? "bg-rose-300"
              : "bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300"
          } flex items-center justify-center rounded-lg  px-5 py-2.5 text-center text-sm font-medium
					 text-white  cursor-pointer `}
          onClick={handleAddCart}
          // onClick={() => addToCart(product._id)}
        >
          {user ? (
            <>
              <ShoppingCart size={22} className="mr-2" />
              Add to cart
            </>
          ) : (
            "Login to Add"
          )}
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
