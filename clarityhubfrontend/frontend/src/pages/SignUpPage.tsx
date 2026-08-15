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
  Gift,
  PackageCheck,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useSignUp } from "../features/auth/api/hooks/hooks";
import { toast } from "react-hot-toast";
import type { SignUpData } from "../features/auth/api/auth.types";

const getBackendErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || "Failed to create account";

const inputClass =
  "block h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-white/90 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-muted)]";

const labelClass = "mb-2 block text-sm font-semibold text-[var(--text-primary)]";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    setError,
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignupSubmit = (
    data: SignUpData & { confirmPassword: string },
  ) => {
    const normalizedData = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
    };

    if (
      !normalizedData.firstName ||
      !normalizedData.lastName ||
      !normalizedData.email ||
      !normalizedData.phone ||
      !normalizedData.password ||
      !normalizedData.confirmPassword
    ) {
      const message = "Complete every sign up field before submitting.";
      console.error("Signup validation error:", { message, payload: normalizedData });
      toast.error(message);
      return;
    }

    if (normalizedData.password.length < 8) {
      const message = "Password must be at least 8 characters long.";
      setError("password", { type: "manual", message });
      console.error("Signup validation error:", { message, payload: normalizedData });
      toast.error(message);
      return;
    }

    if (normalizedData.password !== normalizedData.confirmPassword) {
      const message = "Passwords do not match.";
      setError("confirmPassword", { type: "manual", message });
      console.error("Signup validation error:", { message, payload: normalizedData });
      toast.error(message);
      return;
    }

    const { confirmPassword: _confirmPassword, ...signupData } = normalizedData;

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
        console.error("Signup request failed:", {
          status: err?.response?.status,
          data: err?.response?.data,
          payload: signupData,
        });
        toast.error(getBackendErrorMessage(err));
      },
    });
  };

  const isPending = signupMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-stretch">
        <motion.section
          className="flex items-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="surface-card w-full rounded-lg p-5 md:p-8 lg:p-10">
            <div className="mb-8">
              <p className="doxa-label text-[var(--primary)]">Create account</p>
              <h1 className="mt-2 text-3xl font-medium text-[var(--text-primary)] md:text-4xl">
                Start a personal gifting profile
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                Save recipient details, track curated boxes, and verify your account for secure checkout.
              </p>
            </div>

          <form
            onSubmit={handleSubmit(handleSignupSubmit)}
            className="space-y-6"
          >
            <input type="hidden" {...register("verificationMethod")} />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-[var(--text-primary)]">
                  Verification Method
                </label>
                <span className="text-xs font-medium text-[var(--text-tertiary)]">
                  OTP delivery
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--cream)] p-1.5"
                role="radiogroup"
                aria-label="Verification method"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={verificationMethod === "email"}
                  onClick={() => setValue("verificationMethod", "email")}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
                    verificationMethod === "email"
                      ? "bg-[var(--primary)] text-white shadow-md"
                      : "text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email OTP
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked="false"
                  aria-disabled="true"
                  disabled
                  title="Phone verification is currently unavailable"
                  className="flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-[var(--text-tertiary)] opacity-50"
                >
                  <Phone className="h-4 w-4" />
                  Phone OTP (Unavailable)
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">
                {verificationMethod === "email"
                  ? "We will send a verification code to your email address."
                  : "We will send a verification code to your phone number."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  First Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <User className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                      validate: (value) =>
                        value.trim().length > 0 || "First name is required",
                    })}
                    className={inputClass}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Last Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <User className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                      validate: (value) =>
                        value.trim().length > 0 || "Last name is required",
                    })}
                    className={inputClass}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-4 w-4 text-[var(--text-tertiary)]" />
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
              <label className={labelClass}>
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Phone className="h-4 w-4 text-[var(--text-tertiary)]" />
                </div>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone is required",
                    validate: (value) =>
                      value.trim().length > 0 || "Phone is required",
                  })}
                  className={inputClass}
                  placeholder="+234..."
                />
              </div>
              {errors.phone && (
                <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                  {errors.phone.message}
                </p>
              )}
            </div>

            

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      validate: (value) =>
                        value.trim().length > 0 || "Password is required",
                    })}
                    className={`${inputClass} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (val) =>
                        val.trim().length === 0
                          ? "Please confirm password"
                          : val === watch("password") || "Passwords do not match",
                    })}
                    className={`${inputClass} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="brand-button group w-full px-6 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 text-center">
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              Already have an account?
              <Link
                to="/login"
                className="group inline-flex items-center gap-1 font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
              >
                Login
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </p>
          </div>
        </div>
        </motion.section>

        <motion.section
          className="relative min-h-[360px] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--noir)] text-white shadow-lg xl:min-h-[760px]"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <img
            src="/doxa-personalized-box.jpg"
            alt="DOXA personalized gift box"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)] via-[var(--noir)]/45 to-transparent" />
          <div className="relative flex h-full min-h-[360px] flex-col justify-between p-6 md:p-8 xl:min-h-[760px]">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg brand-gradient text-sm font-bold text-white shadow-md">DG</span>
              <span className="text-sm font-semibold">DOXA Atelier</span>
            </Link>

            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 doxa-label text-white">
                <Gift size={14} />
                Curated gifting
              </span>
              <h2 className="max-w-md text-4xl font-medium leading-tight md:text-5xl">
                Gifts built around people, not templates.
              </h2>
              <div className="grid max-w-lg gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <PackageCheck className="mb-4 text-white" size={22} />
                  <p className="text-sm font-semibold">Track every order from curation to handoff.</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <Sparkles className="mb-4 text-white" size={22} />
                  <p className="text-sm font-semibold">Keep recipient notes ready for the next moment.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="mx-auto mt-6 max-w-7xl text-center">
        <p className="flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
          <Sparkles size={12} className="text-[var(--primary)]" />
          By joining, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
