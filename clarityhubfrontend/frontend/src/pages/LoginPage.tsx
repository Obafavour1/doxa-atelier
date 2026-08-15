import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader,
  ArrowRight,
  Gift,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { useSignIn, useMe } from "../features/auth/api/hooks/hooks";
import { toast } from "react-hot-toast";
import type { SignInData } from "../features/auth/api/auth.types";

const getBackendErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || "Invalid credentials";

const inputClass =
  "block h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-white/90 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-muted)]";

const labelClass = "mb-2 block text-sm font-semibold text-[var(--text-primary)]";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInData>();

  const { data: user, isLoading: checkingMe } = useMe();
  const loginMutation = useSignIn();
  const navigate = useNavigate();

  const handleLoginSubmit = async (data: SignInData) => {
    const sanitizedData = {
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
    };

    if (!sanitizedData.email || !sanitizedData.password) {
      const message = "Email and password are required.";
      if (!sanitizedData.email) {
        setError("email", { type: "manual", message: "Email is required" });
      }
      if (!sanitizedData.password) {
        setError("password", { type: "manual", message: "Password is required" });
      }
      console.error("Login validation error:", { message, payload: sanitizedData });
      toast.error(message);
      return;
    }

    loginMutation.mutate(sanitizedData, {
      onSuccess: () => {
        toast.success("Welcome back!");
        navigate("/");
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const message = getBackendErrorMessage(err);
        if (status === 403 && message.toLowerCase().includes("verify")) {
          toast("Verify your email to continue.", { icon: "✉️" });
          navigate(`/verify-otp?email=${encodeURIComponent(sanitizedData.email)}&method=email`, {
            state: { fromLogin: true },
          });
          return;
        }
        console.error("Login request failed:", {
          status,
          data: err?.response?.data,
          payload: { email: sanitizedData.email },
        });
        toast.error(message);
      },
    });
  };

  if (checkingMe) return null;
  if (user) return <Navigate to="/" />;

  const isPending = loginMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <motion.section
          className="relative min-h-[360px] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--noir)] text-white shadow-lg lg:min-h-[680px]"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <img
            src="/doxa-luxe-box.jpg"
            alt="DOXA luxury gift box"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)] via-[var(--noir)]/45 to-transparent" />
          <div className="relative flex h-full min-h-[360px] flex-col justify-between p-6 md:p-8 lg:min-h-[680px]">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg brand-gradient text-sm font-bold text-white shadow-md">DG</span>
              <span className="text-sm font-semibold">DOXA Atelier</span>
            </Link>

            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 doxa-label text-white">
                <Gift size={14} />
                Member access
              </span>
              <h1 className="mt-5 text-4xl font-medium leading-tight md:text-5xl">
                Welcome back to thoughtful gifting.
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/78">
                Sign in to continue curating orders, saved details, and delivery-ready gift moments.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="flex items-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="surface-card w-full rounded-lg p-5 md:p-8 lg:p-10">
            <div className="mb-8">
              <p className="doxa-label text-[var(--primary)]">Login</p>
              <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Access your account</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                Continue to your cart, orders, and personalized gift collections.
              </p>
            </div>

          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="space-y-6"
          >
            <div>
              <label className={labelClass}>
                Email Address
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-4 w-4 text-[var(--text-tertiary)] transition-colors group-focus-within:text-[var(--primary)]" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    validate: (value) =>
                      value.trim().length > 0 || "Email is required",
                  })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-[var(--text-primary)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-4 w-4 text-[var(--text-tertiary)] transition-colors group-focus-within:text-[var(--primary)]" />
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) =>
                      value.trim().length > 0 || "Password is required",
                  })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="brand-button group relative w-full overflow-hidden px-6 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Enter account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 text-center">
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              Don't have an account?
              <Link
                to="/signup"
                className="group inline-flex items-center gap-1 font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
              >
                Create one now
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--cream)] px-4 py-3">
              <ShieldCheck size={18} className="shrink-0 text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Encrypted account session</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--petal)] px-4 py-3">
              <PackageCheck size={18} className="shrink-0 text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Orders and saved details</span>
            </div>
          </div>
        </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LoginPage;
