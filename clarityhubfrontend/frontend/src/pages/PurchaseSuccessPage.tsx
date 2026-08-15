import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Gift,
  LoaderCircle,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCheckoutSuccess } from "../features/cart/api/hooks";

type ConfirmationState = "verifying" | "success" | "error";

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : "We could not confirm this payment yet.";
};

const PurchaseSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paystackReference = searchParams.get("reference") || searchParams.get("trxref");
  const provider = searchParams.get("provider") === "paystack" ? "paystack" : "stripe";
  const paymentReference = provider === "paystack" ? paystackReference : sessionId;
  const { data: confirmationData, mutate: verifyPayment } = useCheckoutSuccess();
  const attemptedReference = useRef<string | null>(null);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>("verifying");
  const [error, setError] = useState<string | null>(null);

  const confirmPayment = useCallback((force = false) => {
    if (!paymentReference) {
      setError("No payment reference was found. Return to your orders to check the payment status.");
      setConfirmationState("error");
      return;
    }

    const attemptKey = `${provider}:${paymentReference}`;
    if (!force && attemptedReference.current === attemptKey) return;

    attemptedReference.current = attemptKey;
    setError(null);
    setConfirmationState("verifying");
    verifyPayment(
      { provider, reference: paymentReference },
      {
        onSuccess: (result) => {
          if (!result?.orderId) {
            setError("The payment was verified, but the order number was not returned. Please review your orders.");
            setConfirmationState("error");
            return;
          }
          setConfirmationState("success");
        },
        onError: (requestError: unknown) => {
          setError(getErrorMessage(requestError));
          setConfirmationState("error");
        },
      },
    );
  }, [paymentReference, provider, verifyPayment]);

  useEffect(() => {
    confirmPayment();
  }, [confirmPayment]);

  if (confirmationState === "verifying") {
    return (
      <section className="relative grid min-h-[calc(100vh-72px)] place-items-center overflow-hidden px-4 py-16 sm:px-6">
        <div className="absolute left-[8%] top-[16%] h-64 w-64 rounded-full bg-[var(--periwinkle)]/35 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-[var(--blush)]/70 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="surface-card relative w-full max-w-lg rounded-2xl p-7 text-center shadow-[var(--shadow-lg)] sm:p-10">
          <div className="brand-gradient mx-auto grid h-20 w-20 place-items-center rounded-2xl text-white shadow-lg"><LoaderCircle className="h-9 w-9 animate-spin" /></div>
          <p className="doxa-label mt-7 text-[var(--primary)]">Secure confirmation</p>
          <h1 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">We’re confirming your payment</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">Please keep this page open while DOXA Atelier verifies the transaction and prepares your order.</p>
          <div className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[var(--cream)] px-4 py-3 text-xs font-semibold text-[var(--text-secondary)]"><ShieldCheck size={16} className="text-[var(--primary)]" /> Protected payment verification</div>
        </motion.div>
      </section>
    );
  }

  if (confirmationState === "error") {
    return (
      <section className="relative grid min-h-[calc(100vh-72px)] place-items-center overflow-hidden px-4 py-16 sm:px-6">
        <div className="absolute left-[5%] top-[12%] h-72 w-72 rounded-full bg-[var(--periwinkle)]/30 blur-3xl" />
        <div className="absolute bottom-[8%] right-[6%] h-80 w-80 rounded-full bg-[var(--blush)]/70 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="surface-card relative w-full max-w-xl overflow-hidden rounded-2xl shadow-[var(--shadow-lg)]">
          <div className="brand-gradient px-7 py-8 text-white sm:px-10">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/15 backdrop-blur"><TriangleAlert size={27} /></div>
            <p className="doxa-label mt-6 text-white/70">Confirmation needs attention</p>
            <h1 className="mt-2 text-3xl font-medium">We couldn’t finish confirming your order</h1>
          </div>
          <div className="p-7 sm:p-10">
            <p className="text-sm leading-6 text-[var(--text-secondary)]">Your payment record is not lost. Try confirmation again, or review your orders before attempting another payment.</p>
            <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--cream)] p-4">
              <p className="doxa-label text-[var(--text-tertiary)]">Technical detail</p>
              <p className="mt-2 break-words text-sm font-semibold text-[var(--text-primary)]">{error}</p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => confirmPayment(true)} className="brand-button w-full"><RefreshCw size={16} /> Try confirmation again</button>
              <Link to="/my-orders" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-heavy)] bg-white px-5 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--petal)]"><ReceiptText size={16} /> View my orders</Link>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  const displayOrderId = `DOXA-${confirmationData!.orderId.slice(-8).toUpperCase()}`;
  const providerName = provider === "paystack" ? "Paystack" : "Stripe";

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-[var(--periwinkle)]/30 blur-3xl" />
      <div className="absolute -right-16 bottom-8 h-96 w-96 rounded-full bg-[var(--blush)]/75 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-lg)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="brand-gradient relative overflow-hidden p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/15" />
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/15" />
          <div className="relative">
            <span className="doxa-label inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur"><Sparkles size={13} /> Payment received</span>
            <div className="mt-9 grid h-20 w-20 place-items-center rounded-2xl bg-white text-[var(--primary)] shadow-xl"><CheckCircle2 size={42} strokeWidth={1.8} /></div>
            <h1 className="mt-7 max-w-md text-4xl font-medium leading-tight sm:text-5xl">Thoughtfully chosen. Beautifully on its way.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/75">Thank you for choosing DOXA Atelier. Your payment is confirmed and your gift is moving into preparation.</p>

            <div className="mt-9 space-y-4 border-t border-white/15 pt-7">
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[var(--primary)]"><Check size={15} /></span><div><p className="text-sm font-bold">Payment verified</p><p className="text-xs text-white/60">Completed securely with {providerName}</p></div></div>
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white"><PackageCheck size={15} /></span><div><p className="text-sm font-bold">Order preparation</p><p className="text-xs text-white/60">Our team is preparing your selection</p></div></div>
              <div className="flex items-center gap-3 opacity-65"><span className="grid h-8 w-8 place-items-center rounded-full border border-white/30"><Clock3 size={14} /></span><div><p className="text-sm font-bold">Delivery updates</p><p className="text-xs text-white/60">Track progress from your orders page</p></div></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <p className="doxa-label text-[var(--primary)]">Order confirmation</p>
          <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">Your order is confirmed</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">Everything is in place. You can review the order and follow its progress from your account.</p>

          <div className="mt-7 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between gap-4 bg-[var(--cream)] px-4 py-4 sm:px-5"><span className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]"><Gift size={15} className="text-[var(--primary)]" /> Order number</span><strong className="text-sm text-[var(--text-primary)]">{displayOrderId}</strong></div>
            <div className="flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] px-4 py-4 sm:px-5"><span className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]"><ShieldCheck size={15} className="text-[var(--primary)]" /> Payment method</span><strong className="text-sm text-[var(--text-primary)]">{providerName}</strong></div>
            {paymentReference && <div className="flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] px-4 py-4 sm:px-5"><span className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]"><ReceiptText size={15} className="text-[var(--primary)]" /> Reference</span><strong className="max-w-[55%] truncate text-xs text-[var(--text-primary)]">{paymentReference.toUpperCase()}</strong></div>}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link to="/my-orders" className="brand-button w-full"><ShoppingBag size={16} /> View my orders</Link>
            <Link to="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-heavy)] bg-white px-5 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--petal)]">Continue shopping <ArrowRight size={16} /></Link>
          </div>

          <p className="mt-7 flex items-center justify-center gap-2 text-center text-[10px] leading-4 text-[var(--text-tertiary)]"><ShieldCheck size={13} /> Payment confirmation is securely verified by our server.</p>
        </div>
      </motion.div>
    </section>
  );
};

export default PurchaseSuccessPage;
