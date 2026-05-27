import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader,
  ArrowRight,
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
    <div className="min-h-screen flex flex-col justify-center py-24 sm:px-6 lg:px-8 relative overflow-hidden bg-[var(--bg-main)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,88,167,0.18),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(148,26,69,0.16),transparent_44%)] pointer-events-none" />

      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 p-4 rounded-3xl border border-[var(--border-subtle)] shadow-[var(--shadow-md)] backdrop-blur">
            <img src="/doxa-logo-wide.png" alt="DOXA Gift Atelier" className="h-12 w-36 object-contain" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-[var(--text-primary)] tracking-tight">
          Welcome <span className="text-[var(--primary)]">Back</span>
        </h2>
        <p className="mt-2 text-center text-[var(--text-secondary)] font-medium">
          Enter your credentials to access the DOXA admin studio
        </p>
      </motion.div>

      <motion.div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-white/82 backdrop-blur-2xl py-10 px-6 shadow-[var(--shadow-lg)] rounded-3xl sm:px-12 border border-[var(--border-subtle)]">
          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--primary)] transition-colors" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className="block w-full pl-14 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all outline-none"
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
                <label className="block text-sm font-bold text-[var(--text-primary)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  // size={16}
                  className="text-xs font-bold text-[var(--primary)] hover:opacity-80 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--primary)] transition-colors" />
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="block w-full pl-14 pr-4 py-4 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all outline-none"
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
              className="w-full relative flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl text-lg font-black text-white bg-[linear-gradient(135deg,var(--doxa-indigo),var(--doxa-crimson))] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all shadow-[var(--shadow-md)] disabled:opacity-50 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
            <p className="text-[var(--text-secondary)] font-medium flex items-center justify-center gap-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[var(--primary)] font-bold hover:opacity-80 transition-colors inline-flex items-center gap-1 group"
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
        <p className="text-xs text-[var(--text-tertiary)] flex items-center justify-center gap-3">
          <ShieldCheck size={14} className="text-[var(--primary)]" />
          Encrypted & Secure Login
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
