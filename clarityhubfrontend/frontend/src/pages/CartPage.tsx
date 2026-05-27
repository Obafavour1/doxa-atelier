import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../features/cart/api/hooks";
import CartView from "../features/cart/components/CartView";

const CartPage = () => {
  const { data: cart = [] } = useCart();

  return (
    <div className="min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <h1 className="text-3xl font-black text-white md:text-5xl">
              Your <span className="text-rose-400">Cart</span>
            </h1>
            <p className="mt-2 flex items-center gap-2 text-gray-400">
              <ShoppingBag size={16} className="text-rose-400/60" />
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-rose-300 transition hover:text-rose-200"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </motion.div>

        <CartView />
      </div>
    </div>
  );
};

export default CartPage;
