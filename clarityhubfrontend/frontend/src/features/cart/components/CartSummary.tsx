import { motion } from "framer-motion";
import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader,
  LockKeyhole,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/client";
import { useCart, useCartTotals, useCoupon, usePaystackQuote, useValidateCoupon } from "../api/hooks";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const paymentMethods = [
  { id: "stripe" as const, name: "Stripe", detail: "Cards & wallets", icon: CreditCard },
  { id: "paystack" as const, name: "Paystack", detail: "Card, bank & transfer", icon: Landmark },
];

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const formatNgn = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : fallback;
};

const CartSummary = () => {
  const { data: cart = [] } = useCart();
  const { data: coupon } = useCoupon();
  const { subtotal, total, discount } = useCartTotals();
  const validateCouponMutation = useValidateCoupon();
  const [couponCode, setCouponCode] = useState("");
  const [provider, setProvider] = useState<"stripe" | "paystack">("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutPayload = useMemo(() => ({
    products: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
    couponCode: coupon?.code ?? null,
  }), [cart, coupon?.code]);
  const paystackQuoteQuery = usePaystackQuote(
    checkoutPayload,
    provider === "paystack" && cart.length > 0,
  );
  const paystackQuote = paystackQuoteQuery.data;
  const isPaystackQuotePending = provider === "paystack" && paystackQuoteQuery.isPending;

  const handleApplyCoupon = (event: FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim();
    if (!code) return;
    validateCouponMutation.mutate(code, { onSuccess: () => setCouponCode("") });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const payload = checkoutPayload;
      if (provider === "paystack") {
        if (!paystackQuote) throw new Error("The naira payment total is not ready yet");
        const res = await axiosInstance.post("/payments/paystack/initialize", payload);
        const transaction = res.data?.data ?? res.data;
        window.location.assign(transaction.authorizationUrl);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");
      const res = await axiosInstance.post("/payments/create-checkout-session", payload);
      const session = res.data?.data ?? res.data;
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) toast.error(result.error.message || "Payment redirect failed");
    } catch (err: unknown) {
      console.error(err);
      toast.error(getErrorMessage(err, "Unable to start checkout"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.aside
      className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[var(--shadow-md)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="brand-gradient px-6 py-5 text-white">
        <p className="doxa-label text-white/70">Order overview</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-medium">Your total</h2>
          <p className="text-right text-3xl font-semibold">
            {provider === "paystack"
              ? (isPaystackQuotePending ? <Loader className="h-7 w-7 animate-spin" /> : paystackQuote ? formatNgn(paystackQuote.convertedAmount) : "—")
              : formatUsd(total)}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4 text-[var(--text-secondary)]"><dt>Gift subtotal</dt><dd className="font-semibold text-[var(--text-primary)]">${subtotal.toFixed(2)}</dd></div>
          <div className="flex items-center justify-between gap-4 text-[var(--text-secondary)]"><dt>Delivery</dt><dd className="font-semibold text-[var(--primary)]">Calculated at checkout</dd></div>
          {discount > 0 && <div className="flex items-center justify-between gap-4 rounded-lg bg-[var(--primary-muted)] px-3 py-2 text-[var(--primary)]"><dt className="inline-flex items-center gap-2"><Tag size={14} /> Savings</dt><dd className="font-bold">−${discount.toFixed(2)}</dd></div>}
          <div className="flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
            <dt className="font-semibold text-[var(--text-primary)]">Total due</dt>
            <dd className="text-right text-xl font-semibold text-[var(--primary)]">
              {provider === "paystack"
                ? (isPaystackQuotePending ? "Converting…" : paystackQuote ? formatNgn(paystackQuote.convertedAmount) : "Unavailable")
                : formatUsd(total)}{" "}
              <span className="text-[10px] font-bold text-[var(--text-tertiary)]">{provider === "paystack" ? "NGN" : "USD"}</span>
            </dd>
          </div>
        </dl>

        <div>
          <div className="mb-2 flex items-center justify-between"><label htmlFor="coupon-code" className="text-xs font-bold text-[var(--text-primary)]">Gift or promo code</label>{coupon && <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)]"><CheckCircle2 size={13} /> {coupon.code} applied</span>}</div>
          <form onSubmit={handleApplyCoupon} className="flex rounded-full border border-[var(--border-subtle)] bg-[var(--cream)] p-1 focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary-muted)]">
            <input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="WELCOME20" className="min-w-0 flex-1 bg-transparent px-3 text-xs font-semibold uppercase text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]" />
            <button type="submit" disabled={!couponCode.trim() || validateCouponMutation.isPending} className="inline-flex min-h-9 items-center justify-center rounded-full bg-white px-4 text-xs font-bold text-[var(--primary)] shadow-sm transition hover:bg-[var(--petal)] disabled:opacity-50">{validateCouponMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Apply"}</button>
          </form>
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-bold text-[var(--text-primary)]">Choose how to pay</legend>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const selected = provider === method.id;
              return (
                <label key={method.id} className={`relative cursor-pointer rounded-lg border p-3 transition ${selected ? "border-[var(--primary)] bg-[var(--primary-muted)] shadow-sm" : "border-[var(--border-subtle)] bg-white hover:border-[var(--border-heavy)]"}`}>
                  <input type="radio" name="payment-provider" value={method.id} checked={selected} onChange={() => setProvider(method.id)} className="sr-only" />
                  <span className="flex items-start justify-between gap-2"><span className={`grid h-9 w-9 place-items-center rounded-lg ${selected ? "bg-[var(--primary)] text-white" : "bg-[var(--cream)] text-[var(--text-secondary)]"}`}><Icon size={17} /></span>{selected && <CheckCircle2 size={16} className="text-[var(--primary)]" />}</span>
                  <span className="mt-3 block text-sm font-bold text-[var(--text-primary)]">{method.name}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-[var(--text-secondary)]">{method.detail}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {provider === "paystack" && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--cream)] p-4" aria-live="polite">
            {isPaystackQuotePending ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]"><Loader size={15} className="animate-spin" /> Converting your total to naira securely…</div>
            ) : paystackQuote ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4 text-xs text-[var(--text-secondary)]"><span>USD order total</span><strong className="text-[var(--text-primary)]">{formatUsd(paystackQuote.baseAmount)}</strong></div>
                <div className="flex items-center justify-between gap-4 text-xs text-[var(--text-secondary)]"><span>Conversion rate</span><strong className="text-[var(--text-primary)]">$1 = {formatNgn(paystackQuote.exchangeRate)}</strong></div>
                <div className="mt-2 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-2 text-sm"><span className="font-semibold text-[var(--text-primary)]">Paystack charge</span><strong className="text-base text-[var(--primary)]">{formatNgn(paystackQuote.convertedAmount)}</strong></div>
                <p className="pt-1 text-[10px] leading-4 text-[var(--text-tertiary)]">Your final Paystack payment is securely calculated and charged in Nigerian naira.</p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-[var(--danger)]">{getErrorMessage(paystackQuoteQuery.error, "Unable to calculate the naira total.")}</p>
                <button type="button" onClick={() => paystackQuoteQuery.refetch()} className="shrink-0 text-xs font-bold text-[var(--primary)]">Try again</button>
              </div>
            )}
          </div>
        )}

        <motion.button
          className="brand-button group w-full disabled:cursor-not-allowed disabled:opacity-55"
          whileTap={!isProcessing ? { scale: 0.98 } : undefined}
          onClick={handlePayment}
          disabled={isProcessing || cart.length === 0 || (provider === "paystack" && !paystackQuote)}
        >
          {isProcessing ? <><Loader className="h-5 w-5 animate-spin" /> Preparing checkout</> : <>Continue with {provider === "stripe" ? "Stripe" : "Paystack"}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
        </motion.button>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-[var(--cream)] p-3"><ShieldCheck size={16} className="shrink-0 text-[var(--primary)]" /><span className="text-[10px] font-semibold leading-4 text-[var(--text-secondary)]">Secure provider checkout</span></div>
          <div className="flex items-center gap-2 rounded-lg bg-[var(--petal)] p-3"><Truck size={16} className="shrink-0 text-[var(--primary)]" /><span className="text-[10px] font-semibold leading-4 text-[var(--text-secondary)]">Order confirmation next</span></div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-tertiary)]"><LockKeyhole size={12} /> Your payment details never touch our servers</div>
        <Link to="/" className="flex items-center justify-center gap-2 border-t border-[var(--border-subtle)] pt-5 text-xs font-bold text-[var(--primary)] transition hover:text-[var(--primary-hover)]">Add another thoughtful gift <ArrowRight size={14} /></Link>
      </div>
    </motion.aside>
  );
};

export default CartSummary;
