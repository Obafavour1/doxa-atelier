import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Gift,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ResetPasswordData } from "../../features/auth/api/auth.types";
import { authService } from "../../services/auth.service";

type ApiErrorPayload = { message?: string };

const inputClass =
  "block h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-white pl-11 pr-12 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-muted)]";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorPayload>(error) && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }

  return error instanceof Error ? error.message : fallback;
};

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [isExpired, setIsExpired] = useState(!token);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const password = watch("password");
  const passwordChecks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Upper & lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "Number or symbol", met: /[\d\W]/.test(password) },
  ];
  const strength = passwordChecks.filter((item) => item.met).length;
  const strengthLabel = ["Start typing", "Keep going", "Good", "Strong"][strength];

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setIsExpired(true);
      return;
    }

    setRequestError(null);

    try {
      await authService.resetPassword(token, data);
      toast.success("Password updated successfully");
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      const message = getErrorMessage(error, "We couldn’t update your password. Please try again.");
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;

      setRequestError(message);
      toast.error(message);

      if (status === 400 || message.toLowerCase().includes("invalid or expired")) {
        setIsExpired(true);
      }
    }
  };

  const handleResend = async () => {
    if (!token) return;

    setIsResending(true);
    setRequestError(null);

    try {
      await authService.resendResetEmail(token);
      setResendSuccess(true);
      toast.success("A fresh password reset link has been sent");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "We couldn’t resend the link. Request a new one from the forgot-password page.",
      );
      setRequestError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="relative min-h-[360px] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--noir)] text-white shadow-lg lg:min-h-[680px]"
        >
          <img
            src="/doxa-personalized-box.jpg"
            alt="A personalized gift box prepared by DOXA Atelier"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)] via-[var(--noir)]/60 to-[var(--indigo)]/20" />
          <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-[var(--crimson)]/25 blur-3xl" />

          <div className="relative flex h-full min-h-[360px] flex-col justify-between p-6 md:p-8 lg:min-h-[680px]">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="brand-gradient grid h-10 w-10 place-items-center rounded-lg text-sm font-bold text-white shadow-md">DG</span>
              <span className="text-sm font-semibold">DOXA Atelier</span>
            </Link>

            <div className="max-w-md">
              <span className="doxa-label inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-white backdrop-blur">
                <Sparkles size={13} /> Account protection
              </span>
              <h1 className="mt-5 text-4xl font-medium leading-tight md:text-5xl">
                A fresh password. A protected account.
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Secure your DOXA account and return to the thoughtful gifts, orders, and details you’ve saved.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <ShieldCheck size={18} />
                  <p className="mt-2 text-xs font-semibold">Secure account update</p>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <Clock3 size={18} />
                  <p className="mt-2 text-xs font-semibold">Protected reset session</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex items-center"
        >
          <div className="surface-card w-full overflow-hidden rounded-lg p-5 md:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {isExpired ? (
                <motion.div
                  key="expired"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="text-center"
                >
                  {resendSuccess ? (
                    <>
                      <div className="brand-gradient mx-auto grid h-20 w-20 place-items-center rounded-2xl text-white shadow-lg">
                        <CheckCircle2 size={38} />
                      </div>
                      <p className="doxa-label mt-7 text-[var(--primary)]">Fresh link sent</p>
                      <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Check your inbox</h2>
                      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                        We’ve sent a new secure link. Open the latest DOXA Atelier email to choose your password.
                      </p>
                      <div className="mx-auto mt-7 max-w-md rounded-xl border border-[var(--border-subtle)] bg-[var(--cream)] p-5 text-left">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white"><Check size={14} /></span>
                          <p className="text-xs font-semibold leading-5 text-[var(--text-primary)]">Use only the most recent password-reset email—the previous link is no longer active.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[var(--danger-muted)] text-[var(--danger)]">
                        <XCircle size={26} />
                      </span>
                      <p className="doxa-label mt-6 text-[var(--danger)]">Link unavailable</p>
                      <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">This reset link has expired</h2>
                      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                        Password links are time-sensitive for your protection. Request a fresh one to continue securely.
                      </p>

                      {requestError && (
                        <div role="alert" className="mt-5 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-muted)] px-4 py-3 text-left text-xs font-semibold text-[var(--danger)]">
                          {requestError}
                        </div>
                      )}

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {token && (
                          <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="brand-button w-full disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isResending ? <LoaderCircle size={17} className="animate-spin" /> : <RefreshCw size={16} />}
                            {isResending ? "Sending fresh link" : "Resend reset link"}
                          </button>
                        )}
                        <Link
                          to="/forgot-password"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-heavy)] bg-white px-5 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--petal)]"
                        >
                          <KeyRound size={15} /> Start a new request
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="reset-form"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                >
                  <div className="mb-8">
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--primary-muted)] text-[var(--primary)]">
                      <LockKeyhole size={21} />
                    </span>
                    <p className="doxa-label mt-6 text-[var(--primary)]">Secure password reset</p>
                    <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Choose a new password</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                      Make it memorable to you, difficult for anyone else to guess, and different from passwords you use elsewhere.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">New password</label>
                      <div className="group relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <LockKeyhole className="h-4 w-4 text-[var(--text-tertiary)] transition group-focus-within:text-[var(--primary)]" />
                        </span>
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={Boolean(errors.password)}
                          placeholder="Enter your new password"
                          {...register("password", {
                            required: "New password is required",
                            minLength: { value: 8, message: "Use at least 8 characters" },
                          })}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[var(--text-tertiary)] transition hover:text-[var(--primary)]"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.password && <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">{errors.password.message}</p>}
                    </div>

                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--cream)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-[var(--text-primary)]">Password strength</p>
                        <p className="text-xs font-bold text-[var(--primary)]">{strengthLabel}</p>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden="true">
                        {[1, 2, 3].map((level) => (
                          <span key={level} className={`h-1.5 rounded-full transition ${strength >= level ? "brand-gradient" : "bg-[var(--border-subtle)]"}`} />
                        ))}
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {passwordChecks.map((item) => (
                          <div key={item.label} className={`flex items-center gap-2 text-[11px] font-semibold ${item.met ? "text-[var(--primary)]" : "text-[var(--text-tertiary)]"}`}>
                            <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${item.met ? "bg-[var(--primary)] text-white" : "border border-[var(--border-heavy)]"}`}>
                              {item.met && <Check size={10} />}
                            </span>
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Confirm new password</label>
                      <div className="group relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <ShieldCheck className="h-4 w-4 text-[var(--text-tertiary)] transition group-focus-within:text-[var(--primary)]" />
                        </span>
                        <input
                          id="confirm-password"
                          type={showConfirmation ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={Boolean(errors.confirmPassword)}
                          placeholder="Repeat your new password"
                          {...register("confirmPassword", {
                            required: "Please confirm your new password",
                            validate: (value) => value === password || "Passwords do not match",
                          })}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmation((value) => !value)}
                          aria-label={showConfirmation ? "Hide confirmed password" : "Show confirmed password"}
                          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[var(--text-tertiary)] transition hover:text-[var(--primary)]"
                        >
                          {showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">{errors.confirmPassword.message}</p>}
                    </div>

                    {requestError && (
                      <div role="alert" className="rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-muted)] px-4 py-3 text-xs font-semibold text-[var(--danger)]">
                        {requestError}
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="brand-button group w-full px-6 text-sm disabled:cursor-not-allowed disabled:opacity-60">
                      {isSubmitting ? (
                        <><LoaderCircle className="h-5 w-5 animate-spin" /> Securing your account</>
                      ) : (
                        <>Update password <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                      )}
                    </button>
                  </form>

                  <div className="mt-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--petal)] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">Your security comes first</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">DOXA Atelier will never ask you to share your password by email, phone, or message.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 text-center">
              <Link to="/login" className="group inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]">
                <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Back to login
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[var(--text-tertiary)]">
              <Gift size={12} /> Thoughtful gifting, securely protected
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
