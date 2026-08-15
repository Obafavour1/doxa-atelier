import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gift,
  Loader,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useResendOTP, useVerifyOTP } from "../../features/auth/api/hooks/hooks";
import type { SignUpData } from "../../features/auth/api/auth.types";

type VerificationFormData = { otp: string };
type VerificationLocationState = { signUpData?: SignUpData; fromLogin?: boolean };

const RESEND_COOLDOWN_SECONDS = 30;

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const verifyOtpMutation = useVerifyOTP();
  const resendOtpMutation = useResendOTP();
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_COOLDOWN_SECONDS);

  const state = location.state as VerificationLocationState | null;
  const email = searchParams.get("email") ?? state?.signUpData?.email ?? "";
  const verificationMethod = searchParams.get("method") === "phone" ? "phone" : "email";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>();

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = window.setTimeout(() => setSecondsRemaining((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsRemaining]);

  if (!email) return <Navigate to="/signup" replace />;

  const handleVerifyOtp = ({ otp }: VerificationFormData) => {
    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("Your email is verified. Welcome to DOXA.");
          navigate("/login", { replace: true });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "That code is invalid or has expired.");
        },
      },
    );
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(
      { email, verificationMethod },
      {
        onSuccess: () => {
          setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
          toast.success("A fresh verification code is on its way.");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "We could not resend the code.");
        },
      },
    );
  };

  const isSubmitting = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] lg:grid-cols-[0.88fr_1.12fr]">
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="relative hidden min-h-[680px] overflow-hidden bg-[var(--noir)] text-white lg:block"
        >
          <img
            src="/doxa-personalized-box.jpg"
            alt="A personalized DOXA gift box"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)] via-[var(--noir)]/55 to-[var(--noir)]/15" />
          <div className="relative flex h-full min-h-[680px] flex-col justify-between p-8">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="brand-gradient grid h-10 w-10 place-items-center rounded-lg text-sm font-bold shadow-md">DG</span>
              <span className="text-sm font-semibold">DOXA Atelier</span>
            </Link>

            <div className="max-w-md">
              <span className="doxa-label inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-white backdrop-blur">
                <Gift size={14} /> One thoughtful step
              </span>
              <h2 className="mt-5 text-4xl font-medium leading-tight">
                Your gifting space is almost ready.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Verify your email to protect your orders, saved recipients, and every detail behind the perfect gift.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <ShieldCheck size={20} />
                  <p className="mt-3 text-sm font-semibold">Private by design</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <Sparkles size={20} />
                  <p className="mt-3 text-sm font-semibold">Ready in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="flex min-h-[620px] items-center p-6 sm:p-10 lg:p-14"
        >
          <div className="mx-auto w-full max-w-lg">
            <Link
              to="/login"
              className="mb-10 inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
            >
              <ArrowLeft size={15} /> Back to login
            </Link>

            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--primary-muted)] text-[var(--primary)]">
                <Mail size={22} />
              </span>
              <div>
                <p className="doxa-label text-[var(--primary)]">Email verification</p>
                <p className="mt-1 text-xs font-medium text-[var(--text-tertiary)]">Step 2 of 2</p>
              </div>
            </div>

            <h1 className="text-3xl font-medium leading-tight text-[var(--text-primary)] sm:text-4xl">
              Check your inbox.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              We sent a six-digit code to
              <span className="ml-1 font-bold text-[var(--text-primary)]">{email}</span>. Enter it below to activate your account.
            </p>

            {state?.fromLogin && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--petal)] p-4">
                <LockKeyhole className="mt-0.5 shrink-0 text-[var(--primary)]" size={18} />
                <p className="text-sm leading-5 text-[var(--text-secondary)]">
                  We found your account, but it still needs email verification before you can sign in.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(handleVerifyOtp)} className="mt-8 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="otp" className="text-sm font-semibold text-[var(--text-primary)]">Verification code</label>
                  <span className="text-xs text-[var(--text-tertiary)]">Expires in 10 minutes</span>
                </div>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  {...register("otp", {
                    required: "Enter the verification code",
                    pattern: { value: /^\d{6}$/, message: "Enter all six digits" },
                  })}
                  className="h-16 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--cream)] px-5 text-center text-2xl font-semibold tracking-[0.55em] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-muted)]"
                  placeholder="000000"
                />
                {errors.otp && <p className="mt-2 text-xs font-medium text-[var(--danger)]">{errors.otp.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-button group w-full px-6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader className="h-5 w-5 animate-spin" /> : (
                  <><Check className="h-4 w-4" /> Verify and continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
            </form>

            <div className="mt-7 flex flex-col items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--cream)] px-4 py-4 sm:flex-row">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Code not in your inbox?</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Check spam, or request a fresh code.</p>
              </div>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={secondsRemaining > 0 || isResending}
                className="inline-flex min-w-32 items-center justify-center gap-2 rounded-full border border-[var(--border-heavy)] px-4 py-2 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--primary-muted)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {secondsRemaining > 0 ? `Resend in ${secondsRemaining}s` : "Resend code"}
              </button>
            </div>

            <p className="mt-7 text-center text-xs text-[var(--text-secondary)]">
              Wrong email? <Link to="/signup" className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]">Create your account again</Link>
            </p>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
