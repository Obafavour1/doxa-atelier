import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight, ShieldCheck, Loader } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../../shared/lib/apiClient";
import { useCart, useCartTotals, useCoupon } from "../../cart/api/hooks";
import { useState } from "react";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51S1QXlIqrZZtQ8MkOQre0hHaZwT1Hi9MHeua1TG8mUOBE7wY3jhEMpQ7kXcfOUI73l5sZUUcIXYkVoXO32rHKUQv00WXO5MbTX"
);

const OrderSummary = () => {
  const { data: cart = [] } = useCart();
  const { data: coupon = null } = useCoupon();
  const { subtotal, total, discount } = useCartTotals();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const res = await axiosInstance.post("/payments/create-checkout-session", {
        products: cart.map((item: any) => ({
          _id: item._id,
          quantity: item.quantity
        })),
        couponCode: coupon ? coupon.code : null,
      });

      const session = res.data;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        toast.error(result.error.message || "Payment redirect failed");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Something went wrong during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="space-y-6 rounded-3xl border border-gray-700 bg-gray-800/50 backdrop-blur-md p-6 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        Order <span className="text-rose-400">Summary</span>
      </h3>

      <div className="space-y-4">
        <div className="space-y-3">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-medium text-gray-400">Subtotal</dt>
            <dd className="text-base font-bold text-white">${subtotal.toFixed(2)}</dd>
          </dl>

          {discount > 0 && (
            <dl className="flex items-center justify-between gap-4 py-2 bg-rose-500/10 px-3 rounded-xl border border-rose-500/20">
              <dt className="text-sm font-medium text-rose-300">
                Discount {coupon ? `(${coupon.code})` : ''}
              </dt>
              <dd className="text-sm font-bold text-rose-400">-${discount.toFixed(2)}</dd>
            </dl>
          )}

          <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
            <dt className="text-xl font-bold text-white">Total</dt>
            <dd className="text-2xl font-black text-rose-400">${total.toFixed(2)}</dd>
          </div>
        </div>

        <motion.button
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 py-4 text-lg font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isProcessing ? { scale: 1.02 } : {}}
          whileTap={!isProcessing ? { scale: 0.98 } : {}}
          onClick={handlePayment}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader className="h-6 w-6 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </motion.button>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <ShieldCheck size={16} className="text-rose-500" />
            Secure checkout powered by Stripe
          </div>
          
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-rose-400 transition-colors group"
          >
            Continue Shopping
            <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
