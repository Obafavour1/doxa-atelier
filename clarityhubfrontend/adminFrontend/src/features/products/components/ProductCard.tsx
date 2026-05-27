import { ShoppingCart } from "lucide-react";
import { useMe } from "../../auth/api/hooks/hooks";
import { useAddToCart } from "../../cart/api/hooks";
import type { IProduct } from "../api/product.types";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: IProduct }) => {
  const { data: user } = useMe();
  const addToCartMutation = useAddToCart();
  const navigate = useNavigate();

  const handleAddCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCartMutation.mutate(product._id);
  };

  const isLoading = addToCartMutation.isPending;

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-800">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white line-clamp-1">
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
          disabled={isLoading}
          className={`${
            isLoading
              ? "bg-rose-800 cursor-not-allowed"
              : "bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300"
          } flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200`}
          onClick={handleAddCart}
        >
          {user ? (
            <>
              <ShoppingCart size={22} className="mr-2" />
              {isLoading ? "Adding..." : "Add to cart"}
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
