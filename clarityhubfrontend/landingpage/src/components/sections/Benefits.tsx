import { benefits } from "../../data/landingData";

export function Benefits() {
  return (
    <section className="mx-auto mt-20 grid w-container gap-3 rounded-lg border border-doxa-crimson/15 bg-white/70 p-3.5 shadow-doxa backdrop-blur lg:mt-24 lg:grid-cols-4" aria-label="Why choose DOXA">
      {benefits.map((benefit) => (
        <article className="min-h-[190px] rounded-md bg-gradient-to-b from-white to-doxa-petal/40 p-5" key={benefit.title}>
          <benefit.icon className="text-doxa-crimson" size={22} />
          <h3 className="mb-2 mt-5 text-lg font-bold text-doxa-noir">{benefit.title}</h3>
          <p className="leading-relaxed text-doxa-slate">{benefit.text}</p>
        </article>
      ))}
    </section>
  );
}
