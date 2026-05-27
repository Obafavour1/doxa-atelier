import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSignUp, useVerifyOTP } from "../../features/auth/api/hooks/hooks";
import type { SignUpData } from "../../features/auth/api/auth.types";

type VerificationFormData = {
  otp: string;
};

type VerificationLocationState = {
  signUpData?: SignUpData;
};

const RESEND_COOLDOWN_SECONDS = 30;

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const verifyOtpMutation = useVerifyOTP();
  const signUpMutation = useSignUp();
  const [secondsRemaining, setSecondsRemaining] = useState(
    RESEND_COOLDOWN_SECONDS,
  );

  const state = location.state as VerificationLocationState | null;
  const email = searchParams.get("email") ?? state?.signUpData?.email ?? "";
  const verificationMethod =
    searchParams.get("method") ??
    state?.signUpData?.verificationMethod ??
    "email";
  const signUpData = state?.signUpData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>();

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsRemaining]);

  const destinationLabel = useMemo(() => {
    if (verificationMethod === "phone") {
      return signUpData?.phone
        ? `phone number ${signUpData.phone}`
        : "phone number";
    }

    return email;
  }, [email, signUpData?.phone, verificationMethod]);

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  const handleVerifyOtp = ({ otp }: VerificationFormData) => {
    verifyOtpMutation.mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          toast.success("Verification complete. You can now sign in.");
          navigate("/login", { replace: true });
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Invalid or expired OTP code",
          );
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (!signUpData) {
      toast.error(
        "Please return to sign up to request a new verification code.",
      );
      return;
    }

    signUpMutation.mutate(signUpData, {
      onSuccess: () => {
        setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
        toast.success(
          `A new OTP has been sent to your ${signUpData.verificationMethod}.`,
        );
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to resend OTP code");
      },
    });
  };

  const isSubmitting = verifyOtpMutation.isPending;
  const isResending = signUpMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16)_0%,rgba(10,80,60,0.06)_42%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="rounded-[2.5rem] border border-gray-700/60 bg-gray-800/50 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10">
              {verificationMethod === "phone" ? (
                <Smartphone className="h-8 w-8 text-rose-400" />
              ) : (
                <Mail className="h-8 w-8 text-rose-400" />
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-400/80">
              One-Time Verification
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Confirm your {verificationMethod === "phone" ? "phone" : "email"}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
              Enter the 6-digit code we just sent to{" "}
              <span className="font-semibold text-white">
                {destinationLabel}
              </span>
              .
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-rose-500/15 bg-rose-500/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-rose-400" />
              <div>
                <p className="text-sm font-bold text-white">
                  Verification keeps your account secure
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  If you do not see the code, wait a moment and then request
                  another one.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleVerifyOtp)}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                {...register("otp", {
                  required: "OTP code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter a valid 6-digit code",
                  },
                })}
                className="block w-full rounded-2xl border border-gray-600 bg-gray-900/60 px-5 py-4 text-center text-2xl font-black tracking-[0.5em] text-white placeholder:text-gray-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/40 outline-none transition-all"
                placeholder="123456"
              />
              {errors.otp && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative flex justify-center items-center py-4 px-6 rounded-2xl text-lg font-black text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all shadow-xl shadow-rose-600/20 disabled:opacity-50 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-rose-400/0 via-white/10 to-rose-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isSubmitting ? (
                <Loader className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-gray-700/60 bg-gray-900/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">
                  Didn&apos;t receive a code?
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Request another OTP if the first one expired or never arrived.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={secondsRemaining > 0 || isResending}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-600 px-4 py-3 text-sm font-bold text-white transition-all hover:border-rose-500 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {secondsRemaining > 0
                  ? `Resend in ${secondsRemaining}s`
                  : "Resend OTP"}
              </button>
            </div>

            {!signUpData && (
              <p className="text-xs text-amber-300/90">
                Resend works only when this page is reached immediately after
                sign up because the API contract does not expose a dedicated
                resend endpoint.
              </p>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            Need to change your{" "}
            {verificationMethod === "phone" ? "phone number" : "email"}?{" "}
            <Link
              to="/signup"
              className="font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Return to sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerificationPage;
