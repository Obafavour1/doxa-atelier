import { ChevronRight } from "lucide-react";
import { collections } from "../../data/landingData";
import { SectionHeading } from "../ui/SectionHeading";

export function Categories() {
  return (
    <section className="mx-auto w-container pt-20 lg:pt-28" id="collections">
      <SectionHeading eyebrow="Featured categories" title="Gift edits with an editorial eye and a deeply personal finish." />
      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((item) => (
          <article className="group relative min-h-[360px] overflow-hidden rounded-lg shadow-doxa lg:min-h-[430px]" key={item.title}>
            <img className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" src={item.image} alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-b from-doxa-noir/5 from-10% to-doxa-noir/85" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
              <span className="mb-3.5 inline-flex rounded-full bg-doxa-petal/20 px-2.5 py-1 text-[11px] font-extrabold tracking-wide backdrop-blur">
                {item.badge}
              </span>
              <h3 className="mb-2.5 text-2xl font-bold leading-tight">{item.title}</h3>
              <p className="mb-4 leading-relaxed text-white/80">{item.text}</p>
              <a className="inline-flex items-center gap-1.5 font-black" href={`/gifts?category=${item.id}`} aria-label={`Explore ${item.title}`}>
                Explore <ChevronRight size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
