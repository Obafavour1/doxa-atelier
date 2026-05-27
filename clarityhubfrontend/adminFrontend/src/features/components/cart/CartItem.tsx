import { Minus, Plus, Trash, Loader } from "lucide-react";
import { useRemoveFromCart, useUpdateCartQuantity } from "../../../cart/api/hooks";
import type { CartItem as CartItemType } from "../../../cart/api/cart.types";

const CartItem = ({ item }: { item: CartItemType }) => {
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCartQuantity();

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate({ productId: item._id, quantity });
  };

  const isPending = removeMutation.isPending || updateMutation.isPending;

  return (
    <div className="rounded-2xl border p-4 shadow-xl border-gray-700 bg-gray-800/50 backdrop-blur-sm md:p-6 transition-all hover:bg-gray-800 group">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1 relative overflow-hidden rounded-xl border border-gray-700">
          <img 
            className="h-24 w-24 md:h-32 md:w-32 object-cover group-hover:scale-110 transition-transform duration-500" 
            src={item.image} 
            alt={item.name}
          />
        </div>

        <div className="flex items-center justify-between md:order-3 md:justify-end gap-6">
          <div className="flex items-center gap-3 bg-gray-900/50 p-1.5 rounded-xl border border-gray-700">
            <button
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-600 bg-gray-700 hover:bg-rose-600 hover:border-rose-500 transition-all text-gray-300 disabled:opacity-50"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isPending || item.quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold text-white text-lg">{item.quantity}</span>
            <button
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-600 bg-gray-700 hover:bg-rose-600 hover:border-rose-500 transition-all text-gray-300 disabled:opacity-50"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isPending}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-xl font-bold text-rose-400">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
          <h4 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
            {item.name}
          </h4>
          <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-4 mt-4">
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors group/delete"
              onClick={() => removeMutation.mutate(item._id)}
              disabled={isPending}
            >
              {removeMutation.isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4 transform group-hover/delete:scale-110 transition-transform" />
              )}
              Remove from cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
