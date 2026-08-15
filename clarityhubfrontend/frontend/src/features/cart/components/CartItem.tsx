import { Gift, Loader, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../api/cart.types";
import { useRemoveFromCart, useUpdateCartQuantity } from "../api/hooks";

const CartItem = ({ item }: { item: CartItemType }) => {
  const removeMutation = useRemoveFromCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const isUpdating = updateQuantityMutation.isPending;
  const lineTotal = item.price * item.quantity;

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantityMutation.mutate({ productId: item._id, quantity: newQuantity });
  };

  return (
    <article className="surface-card group overflow-hidden rounded-xl transition hover:border-[var(--border-heavy)] hover:shadow-[var(--shadow-md)]">
      <div className="grid gap-0 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="relative min-h-52 overflow-hidden bg-[var(--petal)] sm:min-h-full">
          <img className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" src={item.image} alt={item.name} />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 doxa-label text-[var(--primary)] shadow-sm backdrop-blur"><Gift size={11} /> Curated</span>
        </div>

        <div className="flex min-w-0 flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="doxa-label text-[var(--text-tertiary)]">DOXA Atelier</p>
                <h3 className="mt-1 text-xl font-medium text-[var(--text-primary)]">{item.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => removeMutation.mutate(item._id)}
                disabled={removeMutation.isPending}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border-subtle)] text-[var(--text-tertiary)] transition hover:border-[var(--danger)] hover:bg-[var(--danger-muted)] hover:text-[var(--danger)] disabled:opacity-50"
                aria-label={`Remove ${item.name} from cart`}
              >
                {removeMutation.isPending ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border-subtle)] pt-5">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Quantity</p>
              <div className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--cream)] p-1">
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-secondary)] transition hover:bg-white hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-35"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  aria-label={`Decrease ${item.name} quantity`}
                ><Minus size={14} /></button>
                <span className="min-w-9 text-center text-sm font-bold text-[var(--text-primary)]" aria-live="polite">{isUpdating ? <Loader className="mx-auto h-4 w-4 animate-spin" /> : item.quantity}</span>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-secondary)] transition hover:bg-white hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-35"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={isUpdating}
                  aria-label={`Increase ${item.name} quantity`}
                ><Plus size={14} /></button>
              </div>
            </div>

            <div className="text-right">
              {item.quantity > 1 && <p className="text-xs text-[var(--text-tertiary)]">${item.price.toFixed(2)} each</p>}
              <p className="mt-1 text-xl font-semibold text-[var(--primary)]">${lineTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
