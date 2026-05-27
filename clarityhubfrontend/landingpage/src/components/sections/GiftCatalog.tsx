import { ExternalLink, ShoppingBag, Star } from "lucide-react";
import { giftCategories, products } from "../../data/landingData";
import { SectionHeading } from "../ui/SectionHeading";

const shopUrl = "https://doxa-atelier.vercel.app/";

export function GiftCatalog() {
  return (
    <section className="mx-auto w-container pt-20 lg:pt-28" id="gifts">
      <SectionHeading eyebrow="Gift catalog" title="Explore every gift by category, mood, and occasion." />

      <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
        {giftCategories.map((category) => (
          <a
            className="whitespace-nowrap rounded-full border border-doxa-crimson/15 bg-white px-4 py-2 text-sm font-black text-doxa-slate shadow-sm transition hover:border-doxa-crimson hover:text-doxa-crimson"
            href={`#gifts-${category.id}`}
            key={category.id}
          >
            {category.label}
          </a>
        ))}
      </div>

      <div className="grid gap-8">
        {giftCategories
          .filter((category) => category.id !== "all")
          .map((category) => {
            const categoryProducts = products.filter((product) => product.categoryId === category.id);

            return (
              <section className="scroll-mt-28" id={`gifts-${category.id}`} key={category.id}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-doxa-crimson">Category</p>
                    <h3 className="font-display text-3xl font-bold leading-tight text-doxa-noir">{category.label}</h3>
                  </div>
                  <a className="hidden items-center gap-1.5 text-sm font-black text-doxa-indigo md:inline-flex" href={shopUrl} target="_blank" rel="noreferrer">
                    Shop full store <ExternalLink size={15} />
                  </a>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryProducts.map((gift) => (
                    <article className="grid overflow-hidden rounded-lg border border-doxa-crimson/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-doxa" key={gift.title}>
                      <div className="relative aspect-[1.35] overflow-hidden bg-doxa-petal">
                        <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={gift.image} alt={gift.title} loading="lazy" />
                        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-extrabold text-doxa-crimson backdrop-blur">
                          {gift.badge}
                        </span>
                      </div>
                      <div className="grid gap-4 p-5">
                        <div>
                          <p className="mb-1 text-xs font-extrabold text-doxa-muted">{gift.category}</p>
                          <h4 className="text-lg font-bold leading-snug text-doxa-noir">{gift.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-doxa-slate">{gift.description}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-black text-doxa-crimson">
                            <Star size={15} fill="currentColor" /> {gift.rating}
                          </span>
                          <a
                            className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full bg-doxa-noir px-4 text-[13px] font-black text-white transition hover:bg-doxa-crimson"
                            href={shopUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ShoppingBag size={16} /> Shop
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
      </div>
    </section>
  );
}
