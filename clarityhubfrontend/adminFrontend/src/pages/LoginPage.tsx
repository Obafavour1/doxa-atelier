import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader,
  ArrowRight,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { useSignIn, useMe } from "../features/auth/api/hooks/hooks";
import { toast } from "react-hot-toast";
import type { SignInData } from "../features/auth/api/auth.types";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();

  const { data: user, isLoading: checkingMe } = useMe();
  const loginMutation = useSignIn();
  const navigate = useNavigate();

  const handleLoginSubmit = async (data: SignInData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Welcome back!");
        navigate("/dashboard");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Invalid credentials");
      },
    });
  };

  if (checkingMe) return null;
  if (user) return <Navigate to="/dashboard" />;

  const isPending = loginMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col justify-center py-24 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />

      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-8">
          <div className="bg-rose-500/10 p-5 rounded-[2.5rem] border border-rose-500/20 shadow-2xl shadow-rose-500/10">
            <LogIn className="h-10 w-10 text-rose-500" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Welcome <span className="text-rose-500">Back</span>
        </h2>
        <p className="mt-2 text-center text-gray-400 font-medium">
          Enter your credentials to access your account
        </p>
      </motion.div>

      <motion.div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800/40 backdrop-blur-2xl py-10 px-6 shadow-2xl sm:rounded-[3rem] sm:px-12 border border-white/5">
          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className="block w-full pl-14 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 font-medium ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  // size={16}
                  className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="block w-full pl-14 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 font-medium ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full relative flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl text-lg font-black text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all shadow-xl shadow-rose-600/20 disabled:opacity-50 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-rose-400/0 via-white/10 to-rose-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isPending ? (
                <Loader className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Enter Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 font-medium flex items-center justify-center gap-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-rose-400 font-bold hover:text-rose-300 transition-colors inline-flex items-center gap-1 group"
              >
                Create one now{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 text-center relative z-10">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-3">
          <ShieldCheck size={14} className="text-rose-500" />
          Encrypted & Secure Login
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
