import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Loader, ShieldCheck, RefreshCw, XCircle, ChevronLeft } from "lucide-react";
import { authService } from "../../services/auth.service";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { password: "", confirmPassword: "" }
  });
  
  const [isExpired, setIsExpired] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    if (!token) return;
    try {
      await authService.resetPassword(token, data);
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to reset password";
      toast.error(message);
      if (message.toLowerCase().includes("invalid or expired") || error.response?.status === 400) {
        setIsExpired(true);
      }
    }
  };

  const handleResend = async () => {
    if (!token) return;
    setIsResending(true);
    try {
      await authService.resendResetEmail(token);
      setResendSuccess(true);
      toast.success("A new verification link has been sent to your email.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend link. Please try again from forgot password page.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-24 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,rgba(10,80,60,0.05)_45%,transparent_100%)] pointer-events-none" />

      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-rose-500/10 p-4 rounded-3xl border border-rose-500/20">
            {isExpired ? <XCircle className="h-10 w-10 text-rose-500" /> : <ShieldCheck className="h-10 w-10 text-rose-500" />}
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          {isExpired ? (
            <>Link <span className="text-rose-500">Expired</span></>
          ) : (
            <>Reset <span className="text-rose-500">Password</span></>
          )}
        </h2>
        <p className="mt-2 text-center text-gray-400 font-medium">
          {isExpired 
            ? resendSuccess ? "Check your email for the new verification link." : "Your password reset link is invalid or has expired."
            : "Create a new, strong password for your account."}
        </p>
      </motion.div>

      <motion.div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-xl py-10 px-6 shadow-2xl rounded-[2.5rem] sm:px-12 border border-gray-700/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {isExpired ? (
              <motion.div
                key="expired-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {!resendSuccess ? (
                  <>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center">
                      <p className="text-sm text-rose-400 font-medium leading-relaxed">
                        For your security, password reset links expire after 24 hours. You can request a new one below.
                      </p>
                    </div>

                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="w-full flex items-center justify-center gap-3 bg-rose-500 text-black font-black py-4 rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
                    >
                      {isResending ? <Loader className="animate-spin" /> : <><RefreshCw size={20} /> Resend Verification Link</>}
                    </button>
                    
                    <div className="text-center pt-2">
                       <Link to="/forgot-password" className="text-gray-400 text-sm font-bold hover:text-white transition-colors">
                         Try with a different email
                       </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 pt-4">
                    <p className="text-rose-400 font-bold">New link sent successfully!</p>
                    <p className="text-sm text-gray-400">You can close this window and check your inbox.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="reset-form" 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 8, message: "Minimum 8 characters" }
                      })}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 outline-none transition-all placeholder:text-gray-600"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-rose-400 font-bold">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      {...register("confirmPassword", { 
                        required: "Please confirm your password",
                        validate: val => val === watch("password") || "Passwords do not match"
                      })}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 outline-none transition-all placeholder:text-gray-600"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-rose-400 font-bold">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-rose-500 text-black font-black py-4 rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : <>Update Password <ArrowRight size={20} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <Link to="/login" className="text-gray-400 font-bold hover:text-white transition-colors inline-flex items-center gap-2 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
