import { ArrowRight, Sparkles } from "lucide-react";
import { occasions } from "../../data/landingData";

export function Occasions() {
  return (
    <section className="mx-auto mt-20 grid w-container gap-6 rounded-lg border border-doxa-crimson/10 bg-white/80 p-6 shadow-doxa backdrop-blur lg:mt-24 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
      <div>
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">Occasion-ready</p>
        <h2 className="font-display text-[32px] font-bold leading-[1.02] text-doxa-noir md:text-[44px]">
          A faster path from “I need a gift” to “this feels perfect.”
        </h2>
        <p className="mt-5 leading-relaxed text-doxa-slate">
          DOXA can guide shoppers by mood, recipient, and moment, then send them into the ecommerce store when they are ready to purchase.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {occasions.map((occasion) => (
          <a
            className="group flex min-h-[82px] items-center justify-between gap-4 rounded-lg bg-doxa-petal/55 p-4 text-doxa-noir transition hover:-translate-y-1 hover:bg-doxa-sky"
            href="#gifts"
            key={occasion}
          >
            <span className="inline-flex items-center gap-3 font-black">
              <Sparkles className="text-doxa-crimson" size={18} />
              {occasion}
            </span>
            <ArrowRight className="text-doxa-indigo transition group-hover:translate-x-1" size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}
