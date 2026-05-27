import { XCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl home-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-[3rem] shadow-2xl overflow-hidden relative z-10 p-8 sm:p-12 text-center"
      >
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <XCircle className="text-red-500 w-24 h-24 relative" />
        </div>

        <h1 className="text-4xl font-black text-white mb-4">
          Checkout <span className="text-red-500">Cancelled</span>
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Your order has been cancelled, and no charges have been made. We're here if you decide to come back!
        </p>

        <div className="bg-gray-900/50 rounded-3xl p-6 mb-10 border border-gray-700/50">
          <p className="text-sm font-medium text-gray-400 text-center leading-relaxed">
            Did you encounter any issues? Our support team is ready to help you complete your purchase smoothly.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Return to Shop
          </Link>
          
          <button className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2 text-sm font-bold">
            <MessageSquare size={18} className="text-rose-500" />
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
