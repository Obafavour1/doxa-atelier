
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, ShoppingBag, Loader, XCircle } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import { useCartStore } from "../../../stores/useCartStore";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { clearCart } = useCartStore();

  useEffect(() => {
    const handleCheckoutSuccess = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        await axiosInstance.post("/payments/checkout-success", { sessionId });
        clearCart();
        setIsSuccess(true);
      } catch (error) {
        console.error("Error processing checkout success:", error);
      } finally {
        setLoading(false);
      }
    };

    handleCheckoutSuccess();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader className="animate-spin h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-semibold">Processing your order...</h2>
        <p className="text-gray-400 mt-2">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (!isSuccess && !loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
            <XCircle className="text-red-500 w-24 h-24 mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-center">Payment Failed or Invalid Session</h1>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                We couldn't process your payment. Please try again or contact support if the issue persists.
            </p>
            <div className="flex space-x-4">
                <Link
                    to="/cart"
                    className="flex items-center px-6 py-3 bg-rose-600 rounded-lg hover:bg-rose-700 transition duration-300 font-semibold"
                >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Return to Cart
                </Link>
                <Link
                    to="/"
                    className="flex items-center px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold"
                >
                    <Home className="mr-2 h-5 w-5" />
                    Go Home
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
         <CheckCircle className="text-rose-500 w-24 h-24 mb-6 mx-auto" />
      </motion.div>
      
      <motion.h1
        className="text-4xl font-bold mb-4 text-center text-rose-400"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Order Confirmed!
      </motion.h1>
      
      <motion.p
        className="text-gray-300 mb-8 text-center max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Thank you for your purchase. We're processing your order and will ship it soon.
        A confirmation email has been sent to your inbox.
      </motion.p>
      
      <motion.div
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/orders"
          className="flex items-center justify-center px-6 py-3 bg-rose-600 rounded-lg hover:bg-rose-700 transition duration-300 font-semibold shadow-lg shadow-rose-500/20"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          View My Orders
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
        >
          <Home className="mr-2 h-5 w-5" />
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
