import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="mx-auto mt-20 grid w-container items-center gap-8 rounded-lg border border-doxa-crimson/15 bg-white p-7 shadow-doxa-xl lg:mt-28 lg:grid-cols-[1fr_0.74fr] lg:p-14" id="order">
      <div>
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">VIP access</p>
        <h2 className="font-display text-[32px] font-bold leading-[1.02] text-doxa-noir md:text-[44px] lg:text-[54px]">
          Unlock exclusive drops, early gifting slots, and private collection edits.
        </h2>
      </div>
      <form className="w-full">
        <label className="mb-2 block text-xs font-black text-doxa-noir" htmlFor="email">
          Email address
        </label>
        <div className="grid min-h-[58px] grid-cols-[auto_1fr] items-center gap-2.5 rounded-lg border border-doxa-border bg-doxa-warm-white p-2 pl-4 md:grid-cols-[auto_1fr_auto] md:rounded-full">
          <Mail className="text-doxa-crimson" size={18} />
          <input className="min-w-0 bg-transparent text-doxa-noir outline-none placeholder:text-doxa-muted" id="email" type="email" placeholder="you@example.com" />
          <button className="col-span-2 min-h-[44px] rounded-full bg-brand-gradient px-5 font-black text-white md:col-span-1" type="submit">
            Join
          </button>
        </div>
      </form>
    </section>
  );
}
