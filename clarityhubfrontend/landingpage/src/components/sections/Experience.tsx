import { useMemo, useState } from "react";
import { BadgeCheck, CreditCard } from "lucide-react";

export function Experience() {
  const giftModes = useMemo(() => ["Romantic", "Faith", "Luxury", "Wellness"], []);
  const [activeMode, setActiveMode] = useState(giftModes[0]);

  return (
    <section className="mx-auto mt-20 grid w-container gap-8 rounded-lg bg-doxa-petal-gradient p-4 shadow-doxa lg:mt-28 lg:grid-cols-[0.9fr_1.1fr]" id="experience">
      <div className="p-6 lg:p-11">
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">Interactive showcase</p>
        <h2 className="font-display text-[32px] font-bold leading-[1.02] text-doxa-noir md:text-[44px] lg:text-[54px]">
          Choose the feeling. DOXA styles the gift around the recipient story.
        </h2>
        <p className="mt-5 max-w-[570px] leading-relaxed text-doxa-slate">
          A premium gifting experience needs more than a product grid. This flow previews how a shopper can shape the mood, urgency, card message, and final presentation before checkout.
        </p>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Gift mood">
          {giftModes.map((mode) => (
            <button
              className={`min-h-[39px] rounded-full border border-doxa-crimson/15 px-3.5 text-[13px] font-black transition hover:-translate-y-px ${
                activeMode === mode ? "bg-doxa-crimson text-white" : "bg-white text-doxa-slate hover:bg-doxa-crimson hover:text-white"
              }`}
              key={mode}
              type="button"
              onClick={() => setActiveMode(mode)}
              aria-pressed={activeMode === mode}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[480px] overflow-hidden rounded-lg bg-white lg:grid-cols-[1fr_0.82fr]" aria-live="polite">
        <div className="min-h-[330px] overflow-hidden">
          <img className="h-full w-full object-cover" src="/assets/client-review.jpg" alt="DOXA styled gift moment" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <span className="w-fit rounded-full bg-doxa-sky px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-doxa-indigo">{activeMode} edit</span>
          <h3 className="mb-3 mt-5 font-display text-4xl font-bold leading-tight text-doxa-noir">{activeMode} Gift Concierge</h3>
          <p className="leading-relaxed text-doxa-slate">Includes card styling, occasion matching, add-on recommendations, and delivery-ready presentation.</p>
          <div className="mt-5 grid gap-2.5">
            <span className="inline-flex items-center gap-2 text-[13px] font-black text-doxa-noir">
              <BadgeCheck className="text-doxa-crimson" size={16} /> Personalized card
            </span>
            <span className="inline-flex items-center gap-2 text-[13px] font-black text-doxa-noir">
              <CreditCard className="text-doxa-crimson" size={16} /> Checkout ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
