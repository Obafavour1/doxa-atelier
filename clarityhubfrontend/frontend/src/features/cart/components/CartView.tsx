import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gift, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "../api/hooks";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const EmptyCartUI = () => (
  <motion.div
    className="surface-card mx-auto flex max-w-3xl flex-col items-center rounded-xl px-6 py-16 text-center md:py-20"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative mb-6"><span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--primary-muted)] text-[var(--primary)]"><ShoppingBag size={32} /></span><Sparkles className="absolute -right-2 -top-1 text-[var(--primary)]" size={19} /></div>
    <p className="doxa-label text-[var(--primary)]">Your gift bag</p>
    <h3 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">There’s room for something thoughtful.</h3>
    <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">Explore curated boxes made for celebration, care, encouragement, and all the people who matter.</p>
    <Link
      to="/"
      className="brand-button mt-7"
    >
      <Gift size={17} /> Explore gift collections <ArrowRight size={16} />
    </Link>
  </motion.div>
);

const CartView = () => {
  const { data: cart = [], isLoading } = useCart();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:gap-10">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-4"><div><p className="doxa-label text-[var(--primary)]">Selected gifts</p><h2 className="mt-1 text-2xl font-medium text-[var(--text-primary)]">Your gift bag</h2></div><span className="rounded-full bg-[var(--petal)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">{cart.length} {cart.length === 1 ? "item" : "items"}</span></div>
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
          </motion.div>

          {cart.length > 0 && (
            <motion.div
              className="w-full lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CartSummary />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartView;
