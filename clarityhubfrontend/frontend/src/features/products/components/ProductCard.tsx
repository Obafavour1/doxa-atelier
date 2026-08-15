import { Gift, ShoppingCart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../auth/api/hooks/hooks";
import { useAddToCart } from "../../cart/api/hooks";
import type { IProduct } from "../api/product.types";

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
    <article className="surface-card group flex w-full flex-col overflow-hidden rounded-xl bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-60 overflow-hidden bg-[var(--petal)]">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 doxa-label text-[var(--primary)] shadow-sm">
          <Sparkles size={12} />
          {product.isFeatured ? "Featured" : "Available"}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h3 className="doxa-h1 line-clamp-1 text-[var(--text-primary)]">{product.name}</h3>
          <p className="doxa-caption line-clamp-2 text-[var(--text-secondary)]">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-[var(--primary)]">${product.price} CAD</p>
          <button
            disabled={isLoading}
            className="brand-button min-h-10 px-4 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleAddCart}
          >
            {user && isLoading ? <Gift size={17} /> : <ShoppingCart size={17} />}
            {user && isLoading ? "Adding" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
