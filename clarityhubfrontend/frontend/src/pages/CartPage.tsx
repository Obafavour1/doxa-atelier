import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { useCart } from "../features/cart/api/hooks";
import CartView from "../features/cart/components/CartView";

const CartPage = () => {
  const { data: cart = [] } = useCart();

  return (
    <div className="min-h-screen pb-20">
      <section className="border-b border-[var(--border-subtle)] bg-white/55">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="doxa-label flex items-center gap-2 text-[var(--primary)]"><ShoppingBag size={14} /> Your selection</p>
            <h1 className="mt-2 text-4xl font-medium text-[var(--text-primary)] md:text-5xl">A thoughtful gift, nearly ready.</h1>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {cart.length} {cart.length === 1 ? "beautiful item" : "beautiful items"} selected for your order
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
      </section>

      {cart.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-7 md:px-8">
          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-2 text-[var(--primary)]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--primary)] text-white"><Check size={13} /></span> Gift bag</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="inline-flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full border border-[var(--border-heavy)]">2</span> Payment</span>
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="inline-flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full border border-[var(--border-heavy)]">3</span> Complete</span>
          </div>
        </div>
      )}

      <CartView />
    </div>
  );
};

export default CartPage;
