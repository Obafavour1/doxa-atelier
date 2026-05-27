import { ShieldCheck, Sparkles, Star, Timer } from "lucide-react";
import { Button } from "../ui/Button";

const trustItems = [
  { icon: Star, label: "4.9 average rating", fill: true },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Timer, label: "Limited May gift slots" },
];

export function Hero() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-76px)] w-container items-center gap-10 py-10 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
      <div className="max-w-[690px] animate-reveal">
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">DOXA Gift Atelier</p>
        <h1 className="font-display text-[42px] font-bold leading-[1.02] text-doxa-noir md:text-[64px] xl:text-[84px]">
          Luxury gifting, curated for the people you cannot celebrate casually.
        </h1>
        <p className="mt-6 max-w-[610px] text-base leading-relaxed text-doxa-slate md:text-lg">
          Premium personalized gift boxes for birthdays, faith moments, gratitude, wellness, celebrations, and every message that deserves to be felt.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#products">Shop signature gifts</Button>
          <Button href="#collections" variant="secondary">
            Explore collections
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Trust highlights">
          {trustItems.map((item) => (
            <span
              className="inline-flex min-h-[34px] items-center gap-2 rounded-full border border-doxa-crimson/15 bg-white/65 px-3 text-xs font-extrabold text-doxa-slate"
              key={item.label}
            >
              <item.icon className="text-doxa-crimson" size={15} fill={item.fill ? "currentColor" : "none"} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[430px] animate-reveal [animation-delay:150ms] [perspective:900px] md:min-h-[520px] lg:min-h-[570px]" aria-label="Curated DOXA gift presentation">
        <div className="absolute inset-4 overflow-hidden rounded-[24px] border border-white/70 bg-doxa-petal shadow-[0_34px_90px_rgba(26,10,18,0.2)] lg:inset-y-7 lg:left-8 lg:right-0 lg:rotate-[1.5deg]">
          <img className="h-full w-full animate-soft-zoom object-cover" src="/assets/hero-gift-set.jpg" alt="DOXA curated gift box with premium items" />
          <div className="absolute inset-0 bg-gradient-to-b from-doxa-noir/0 from-55% to-doxa-noir/60" />
        </div>
        <div className="absolute left-2 top-0 z-10 flex max-w-[calc(100%-34px)] animate-float items-center gap-2.5 rounded-lg border border-white/75 bg-white/80 p-4 text-[13px] font-extrabold leading-snug text-doxa-noir shadow-doxa backdrop-blur md:left-0 md:top-20 md:max-w-[290px]">
          <Sparkles className="text-doxa-crimson" size={17} />
          <span>Hand-selected by occasion, mood, and recipient story.</span>
        </div>
        <div className="absolute bottom-0 right-2 z-10 flex max-w-[calc(100%-34px)] animate-float items-center gap-2.5 rounded-lg border border-white/75 bg-white/80 p-4 text-[13px] font-extrabold leading-snug text-doxa-noir shadow-doxa backdrop-blur [animation-delay:1s] md:bottom-12 md:right-5 md:max-w-[290px]">
          <span className="font-display text-3xl font-bold text-doxa-crimson">24h</span>
          <span>Atelier response for custom requests</span>
        </div>
      </div>
    </section>
  );
}
