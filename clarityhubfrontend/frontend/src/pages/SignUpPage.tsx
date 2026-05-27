import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader,
  ArrowRight,
  User,
  Phone,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { useSignUp } from "../features/auth/api/hooks/hooks";
import { toast } from "react-hot-toast";
import type { SignUpData } from "../features/auth/api/auth.types";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpData & { confirmPassword: string }>({
    defaultValues: {
      verificationMethod: "email",
    },
  });

  const signupMutation = useSignUp();
  const navigate = useNavigate();
  const verificationMethod = watch("verificationMethod");

  const handleSignupSubmit = (
    data: SignUpData & { confirmPassword: string },
  ) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData, {
      onSuccess: () => {
        toast.success(
          `Account created successfully! Please verify your ${signupData.verificationMethod}.`,
        );
        const searchParams = new URLSearchParams({
          email: signupData.email,
          method: signupData.verificationMethod,
        });

        navigate(`/verify-otp?${searchParams.toString()}`, {
          state: {
            signUpData: signupData,
          },
        });
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to create account");
      },
    });
  };

  const isPending = signupMutation.isPending;

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
            <UserPlus className="h-10 w-10 text-rose-500" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight">
          Join <span className="text-rose-500">DOXAHub</span>
        </h2>
        <p className="mt-2 text-center text-gray-400 font-medium">
          Create your account and start shopping sustainable
        </p>
      </motion.div>

      <motion.div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-xl py-10 px-6 shadow-2xl sm:rounded-[2.5rem] sm:px-12 border border-gray-700/50">
          <form
            onSubmit={handleSubmit(handleSignupSubmit)}
            className="space-y-6"
          >
            <input type="hidden" {...register("verificationMethod")} />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-bold text-gray-300">
                  Verification Method
                </label>
                <span className="text-xs font-medium text-gray-500">
                  Choose where we send your OTP
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-700 bg-gray-900/60 p-2"
                role="radiogroup"
                aria-label="Verification method"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={verificationMethod === "email"}
                  onClick={() => setValue("verificationMethod", "email")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    verificationMethod === "email"
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email OTP
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={verificationMethod === "phone"}
                  onClick={() => setValue("verificationMethod", "phone")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    verificationMethod === "phone"
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  Phone OTP
                </button>
              </div>

              <p className="text-xs text-gray-500">
                {verificationMethod === "email"
                  ? "We will send a verification code to your email address."
                  : "We will send a verification code to your phone number."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400 font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400 font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                  className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                  placeholder="+234..."
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (val) =>
                        val === watch("password") || "Passwords do not match",
                    })}
                    className="block w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
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
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-rose-400 font-bold hover:text-rose-300 transition-colors inline-flex items-center gap-1 group"
              >
                Login{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-center relative z-10">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-rose-500" />
          By joining, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
