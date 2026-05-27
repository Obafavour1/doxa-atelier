import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { 
  Mail, 
  ArrowRight, 
  Loader, 
  ChevronLeft, 
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: "" }
  });
  
  const [isSent, setIsSent] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const userEmail = watch("email");

  const onSubmit = async (data: { email: string }) => {
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.forgotPassword(userEmail);
      toast.success("Reset link resent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend link");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-24 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,rgba(10,80,60,0.05)_45%,transparent_100%)] pointer-events-none" />

      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-rose-500/10 p-4 rounded-3xl border border-rose-500/20">
            <Mail className="h-10 w-10 text-rose-500" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Forgot <span className="text-rose-500">Password?</span>
        </h2>
        <p className="mt-2 text-center text-gray-400 font-medium">
          No worries, we'll send you reset instructions.
        </p>
      </motion.div>

      <motion.div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-xl py-10 px-6 shadow-2xl rounded-[2.5rem] sm:px-12 border border-gray-700/50">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                      })}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 outline-none transition-all placeholder:text-gray-600"
                      placeholder="user@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-rose-400 font-bold">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-rose-500 text-black font-black py-4 rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : <>Send Reset Instructions <ArrowRight size={20} /></>}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Check your email</h3>
                  <p className="text-gray-400 font-medium">
                    We've sent a password reset link to <span className="text-rose-500 font-bold">{userEmail}</span>.
                  </p>
                  <p className="text-xs text-gray-500 font-bold italic">Link is valid for 24 hours.</p>
                </div>

                <div className="pt-4 space-y-4">
                  <button 
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full flex items-center justify-center gap-2 text-rose-500 font-black px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                  >
                    {isResending ? <Loader size={18} className="animate-spin" /> : <><RefreshCw size={18} /> Resend verification link</>}
                  </button>
                  
                  <button 
                    onClick={() => setIsSent(false)}
                    className="text-gray-400 text-sm font-bold hover:text-white transition-colors"
                  >
                    Wrong email? Try another
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <Link
              to="/login"
              className="text-gray-400 font-bold hover:text-white transition-colors inline-flex items-center gap-2 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
