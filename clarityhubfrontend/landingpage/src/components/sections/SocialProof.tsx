import { Star } from "lucide-react";
import { stats, testimonials } from "../../data/landingData";
import { SectionHeading } from "../ui/SectionHeading";

export function SocialProof() {
  return (
    <section className="mx-auto w-container pt-20 lg:pt-28" id="reviews">
      <div className="mb-14 grid gap-3 md:grid-cols-2 lg:mb-24 lg:grid-cols-4" aria-label="DOXA customer metrics">
        {stats.map((stat) => (
          <div className="rounded-lg border border-doxa-crimson/10 bg-white p-6 shadow-sm" key={stat.label}>
            <strong className="block font-display text-[38px] font-bold leading-none text-doxa-crimson lg:text-[52px]">{stat.value}</strong>
            <span className="mt-2 block font-extrabold text-doxa-slate">{stat.label}</span>
          </div>
        ))}
      </div>

      <SectionHeading eyebrow="Client reviews" title="Social proof that feels human, not generic." />
      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <blockquote className="flex min-h-[300px] flex-col rounded-lg bg-review-gradient p-6 text-white shadow-doxa-xl" key={testimonial.quote}>
            <div className="mb-6 flex gap-1 text-[#F5B942]" aria-label="Five star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="text-[17px] font-bold leading-relaxed text-white/85">{testimonial.quote}</p>
            <footer className="mt-auto">
              <strong className="block">{testimonial.name}</strong>
              <span className="mt-1 block text-[13px] font-bold text-white/60">{testimonial.detail}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
