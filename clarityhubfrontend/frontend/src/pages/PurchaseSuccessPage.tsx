import { ArrowRight, CheckCircle, HandHeart, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCheckoutSuccess } from "../features/cart/api/hooks";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const checkoutMutation = useCheckoutSuccess();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      checkoutMutation.mutate(sessionId, {
        onError: (err: any) => {
          setError(err.response?.data?.message || "Failed to confirm purchase");
        },
      });
    } else {
      setError("No session ID found in the URL");
    }
  }, [sessionId]);

  if (checkoutMutation.isPending) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader className="h-12 w-12 animate-spin text-rose-500" />
        <p className="text-xl font-bold text-white">
          Confirming your purchase...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-red-500/10 p-8 rounded-4xl border border-red-500/20 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-all"
          >
            Go back Home
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={500}
        recycle={false}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-[3rem] border border-gray-700 shadow-2xl overflow-hidden relative z-10 p-8 sm:p-12 text-center"
      >
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full" />
          <CheckCircle className="text-rose-400 w-24 h-24 relative" />
        </div>

        <h1 className="text-4xl font-black text-white mb-4">Success!</h1>

        <p className="text-gray-400 text-lg mb-8">
          Thank you for your order. We've received your payment and are
          preparing your package with care.
        </p>

        <div className="bg-gray-900/50 rounded-3xl p-6 mb-10 border border-gray-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Status</span>
            <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full uppercase tracking-wider">
              Confirmed
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              Order Number
            </span>
            <span className="text-sm font-bold text-white">
              #HUB-{Math.floor(Math.random() * 900000) + 100000}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 group"
          >
            Continue Shopping
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <button className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2 text-sm font-bold">
            <HandHeart size={18} className="text-pink-500" />
            Join our loyalty program
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseSuccessPage;
