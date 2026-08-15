import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Gift,
  LoaderCircle,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../../features/auth/api/hooks/hooks";
import type { ForgotPasswordData } from "../../features/auth/api/auth.types";

const inputClass =
  "block h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-white pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-muted)]";

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : "We couldn’t send the reset link. Please try again.";
};

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({ defaultValues: { email: "" } });
  const forgotPasswordMutation = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const sendResetLink = async (email: string) => {
    await forgotPasswordMutation.mutateAsync({ email });
  };

  const onSubmit = async (data: ForgotPasswordData) => {
    const email = data.email.trim().toLowerCase();
    setRequestError(null);

    try {
      await sendResetLink(email);
      setSubmittedEmail(email);
      setIsSent(true);
      toast.success("Password reset link sent");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setRequestError(message);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    setIsResending(true);
    setRequestError(null);

    try {
      await sendResetLink(submittedEmail);
      toast.success("A fresh reset link has been sent");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setRequestError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  const changeEmail = () => {
    setIsSent(false);
    setRequestError(null);
    window.setTimeout(() => setFocus("email"), 100);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="relative min-h-[340px] overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--noir)] text-white shadow-lg lg:min-h-[650px]"
        >
          <img src="/doxa-luxe-box.jpg" alt="A carefully presented DOXA Atelier gift box" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--noir)] via-[var(--noir)]/55 to-[var(--indigo)]/20" />
          <div className="relative flex h-full min-h-[340px] flex-col justify-between p-6 md:p-8 lg:min-h-[650px]">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <span className="brand-gradient grid h-10 w-10 place-items-center rounded-lg text-sm font-bold text-white shadow-md">DG</span>
              <span className="text-sm font-semibold">DOXA Atelier</span>
            </Link>

            <div className="max-w-md">
              <span className="doxa-label inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-white backdrop-blur"><Sparkles size={13} /> Account care</span>
              <h1 className="mt-5 text-4xl font-medium leading-tight md:text-5xl">A gentle way back to your account.</h1>
              <p className="mt-4 text-sm leading-6 text-white/75">We’ll help you regain access securely, so your orders and thoughtfully chosen gifts stay protected.</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur"><ShieldCheck size={18} /><p className="mt-2 text-xs font-semibold">Secure reset link</p></div>
                <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur"><Clock3 size={18} /><p className="mt-2 text-xs font-semibold">Valid for 24 hours</p></div>
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
              {!isSent ? (
                <motion.div key="request" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                  <div className="mb-8">
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--primary-muted)] text-[var(--primary)]"><Mail size={21} /></span>
                    <p className="doxa-label mt-6 text-[var(--primary)]">Password recovery</p>
                    <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Reset your password</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">Enter the verified email connected to your account and we’ll send you secure reset instructions.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    <div>
                      <label htmlFor="recovery-email" className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">Email address</label>
                      <div className="group relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><Mail className="h-4 w-4 text-[var(--text-tertiary)] transition group-focus-within:text-[var(--primary)]" /></span>
                        <input
                          id="recovery-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          aria-invalid={Boolean(errors.email)}
                          {...register("email", {
                            required: "Email address is required",
                            validate: (value) => value.trim().length > 0 || "Email address is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                          })}
                          className={inputClass}
                        />
                      </div>
                      {errors.email && <p className="ml-1 mt-1.5 text-xs font-medium text-[var(--danger)]">{errors.email.message}</p>}
                    </div>

                    {requestError && (
                      <div role="alert" className="rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-muted)] px-4 py-3 text-xs font-semibold text-[var(--danger)]">{requestError}</div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="brand-button group w-full px-6 text-sm disabled:cursor-not-allowed disabled:opacity-60">
                      {isSubmitting ? <><LoaderCircle className="h-5 w-5 animate-spin" /> Sending secure link</> : <>Send reset instructions <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                    </button>
                  </form>

                  <div className="mt-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--cream)] p-4">
                    <div className="flex items-start gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" /><div><p className="text-xs font-bold text-[var(--text-primary)]">Private and protected</p><p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">Reset instructions are sent only to the verified email address on your DOXA account.</p></div></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="sent" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="text-center">
                  <div className="brand-gradient mx-auto grid h-20 w-20 place-items-center rounded-2xl text-white shadow-lg"><CheckCircle2 size={38} /></div>
                  <p className="doxa-label mt-7 text-[var(--primary)]">Instructions sent</p>
                  <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Check your inbox</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">We sent a secure password-reset link to:</p>
                  <div className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--petal)] px-4 py-2 text-sm font-bold text-[var(--primary)]"><Mail size={15} /><span className="truncate">{submittedEmail}</span></div>

                  <div className="mt-7 space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--cream)] p-5 text-left">
                    <div className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white"><Check size={13} /></span><p className="text-xs font-semibold text-[var(--text-primary)]">Open the link in the email from DOXA Atelier</p></div>
                    <div className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[var(--primary)] shadow-sm"><Clock3 size={13} /></span><p className="text-xs font-semibold text-[var(--text-secondary)]">Complete your password reset within 24 hours</p></div>
                  </div>

                  {requestError && <div role="alert" className="mt-4 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-muted)] px-4 py-3 text-xs font-semibold text-[var(--danger)]">{requestError}</div>}

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={handleResend} disabled={isResending} className="brand-button w-full disabled:cursor-not-allowed disabled:opacity-60">{isResending ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />} {isResending ? "Sending again" : "Resend link"}</button>
                    <button type="button" onClick={changeEmail} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-heavy)] bg-white px-5 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--petal)]"><Mail size={15} /> Change email</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 text-center">
              <Link to="/login" className="group inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"><ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Back to login</Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[var(--text-tertiary)]"><Gift size={12} /> Thoughtful gifting, securely protected</div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
