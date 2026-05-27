import { Button } from "../ui/Button";

export function Editorial() {
  return (
    <section className="mx-auto mt-20 grid w-container items-center gap-8 rounded-lg bg-editorial-gradient p-5 text-white lg:mt-28 lg:grid-cols-[0.85fr_1fr] lg:gap-16 lg:p-12">
      <div className="overflow-hidden rounded-lg shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <img className="aspect-[0.92] w-full object-cover" src="/assets/luxe-box.jpg" alt="Luxury DOXA gift box" loading="lazy" />
      </div>
      <div>
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">Collection showcase</p>
        <h2 className="font-display text-[32px] font-bold leading-[1.02] text-white md:text-[44px] lg:text-[54px]">
          The art of gifting, styled like a modern atelier.
        </h2>
        <p className="my-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
          DOXA blends premium packaging, intimate copywriting, thoughtful product pairing, and a warm concierge process so every gift feels made, not picked from a shelf.
        </p>
        <Button href="#order" variant="ghost">
          Build a custom box
        </Button>
      </div>
    </section>
  );
}
