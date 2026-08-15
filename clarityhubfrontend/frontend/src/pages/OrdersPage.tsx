import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Gift,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { orderService } from "../services/order.service";
import LoadingSpinner from "../shared/components/LoadingSpinner";
import type { Order } from "../types/api";

const statusConfig: Record<
  Order["status"],
  { label: string; className: string; icon: typeof Clock3 }
> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700", icon: Clock3 },
  processing: { label: "Preparing", className: "bg-blue-50 text-blue-700", icon: PackageCheck },
  shipped: { label: "On its way", className: "bg-violet-50 text-violet-700", icon: Truck },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700", icon: XCircle },
  returned: { label: "Returned", className: "bg-slate-100 text-slate-700", icon: RefreshCw },
};

const formatUsd = (amountInCents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amountInCents / 100);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === "string") {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : "We couldn’t load your orders right now.";
};

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}>
      <Icon size={12} /> {config.label}
    </span>
  );
};

const OrdersPage = () => {
  const ordersQuery = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: orderService.getMyOrders,
    staleTime: 30_000,
  });
  const orders = ordersQuery.data ?? [];
  const activeOrders = orders.filter((order) => ["pending", "processing", "shipped"].includes(order.status)).length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;

  if (ordersQuery.isLoading) {
    return <LoadingSpinner label="Gathering your orders" />;
  }

  return (
    <div className="relative overflow-hidden px-4 py-10 md:px-8 md:py-14">
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-[var(--periwinkle)]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-72 h-96 w-96 rounded-full bg-[var(--blush)]/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-md)]"
        >
          <div className="brand-gradient relative overflow-hidden px-6 py-8 text-white md:px-9 md:py-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/15" />
            <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/15" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="doxa-label inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur">
                  <Sparkles size={13} /> Your gifting journey
                </span>
                <h1 className="mt-5 text-4xl font-medium leading-tight md:text-5xl">Orders, beautifully kept in one place.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">Follow every thoughtful selection from payment confirmation to its final delivery.</p>
              </div>
              <Link to="/" className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-[var(--primary)] shadow-lg transition hover:-translate-y-0.5">
                <Gift size={16} /> Discover more gifts
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[var(--border-subtle)] bg-white">
            <div className="px-4 py-5 text-center md:px-6"><p className="text-2xl font-semibold text-[var(--text-primary)]">{orders.length}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Total orders</p></div>
            <div className="px-4 py-5 text-center md:px-6"><p className="text-2xl font-semibold text-[var(--primary)]">{activeOrders}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">In progress</p></div>
            <div className="px-4 py-5 text-center md:px-6"><p className="text-2xl font-semibold text-emerald-700">{deliveredOrders}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Delivered</p></div>
          </div>
        </motion.header>

        {ordersQuery.isError ? (
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="surface-card mt-7 rounded-2xl p-7 text-center md:p-10">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--danger-muted)] text-[var(--danger)]"><XCircle size={28} /></span>
            <p className="doxa-label mt-6 text-[var(--danger)]">Orders unavailable</p>
            <h2 className="mt-2 text-2xl font-medium text-[var(--text-primary)]">We couldn’t open your order history</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">{getErrorMessage(ordersQuery.error)}</p>
            <button type="button" onClick={() => ordersQuery.refetch()} className="brand-button mt-6"><RefreshCw size={16} /> Try again</button>
          </motion.section>
        ) : orders.length === 0 ? (
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="surface-card mt-7 rounded-2xl px-6 py-14 text-center md:py-18">
            <div className="relative mx-auto w-fit">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--primary-muted)] text-[var(--primary)]"><ShoppingBag size={32} /></span>
              <Sparkles className="absolute -right-2 -top-1 text-[var(--primary)]" size={20} />
            </div>
            <p className="doxa-label mt-7 text-[var(--primary)]">Your order story starts here</p>
            <h2 className="mt-2 text-3xl font-medium text-[var(--text-primary)]">No orders yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">When you complete a purchase, its confirmation and delivery progress will appear here.</p>
            <Link to="/" className="brand-button mt-7">Explore gift collections <ArrowRight size={16} /></Link>
          </motion.section>
        ) : (
          <section className="mt-8 space-y-4" aria-label="Order history">
            <div className="flex items-end justify-between gap-4 px-1">
              <div><p className="doxa-label text-[var(--primary)]">Order history</p><h2 className="mt-1 text-2xl font-medium text-[var(--text-primary)]">Your recent orders</h2></div>
              <span className="hidden text-xs font-semibold text-[var(--text-tertiary)] sm:block">Newest first</span>
            </div>

            {orders.map((order, index) => {
              const orderId = order._id || order.id || "";
              const items = Array.isArray(order.products) ? order.products : [];
              const itemCount = items.reduce((count, item) => count + item.quantity, 0);

              return (
                <motion.article
                  key={orderId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.06, 0.3) }}
                  className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-sm)] transition hover:border-[var(--border-heavy)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--primary-muted)] text-[var(--primary)]"><Package size={22} /></span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="doxa-label text-[var(--text-tertiary)]">DOXA-{orderId.slice(-8).toUpperCase()}</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Placed on {formatDate(order.createdAt)}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                          <span className="inline-flex items-center gap-1.5"><ReceiptText size={13} /> {order.paymentMethod === "paystack" ? "Paystack" : "Stripe"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 border-t border-[var(--border-subtle)] pt-4 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                      <div className="md:text-right"><p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Order total</p><p className="mt-1 text-xl font-semibold text-[var(--primary)]">{formatUsd(order.totalAmount)}</p></div>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="flex items-center gap-3 border-t border-[var(--border-subtle)] bg-[var(--cream)]/65 px-5 py-4 md:px-6">
                      <div className="flex -space-x-2">
                        {items.slice(0, 4).map((item, itemIndex) => (
                          <div key={`${orderId}-${item.product?._id || item.product?.id || itemIndex}`} className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-[var(--petal)] shadow-sm">
                            {item.product?.image ? <img src={item.product.image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center text-[var(--primary)]"><Gift size={16} /></span>}
                          </div>
                        ))}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--text-secondary)]">
                        {items.map((item) => item.product?.name).filter(Boolean).join(", ") || "Gift selection"}
                      </p>
                      {items.length > 4 && <span className="shrink-0 text-xs font-bold text-[var(--primary)]">+{items.length - 4}</span>}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
