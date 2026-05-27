import { ExternalLink, ShoppingBag, Star, Timer } from "lucide-react";
import { products, type Product } from "../../data/landingData";
import { SectionHeading } from "../ui/SectionHeading";

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-doxa-crimson/10 bg-white/90 shadow-doxa transition duration-200 hover:-translate-y-1 hover:shadow-doxa-xl">
      <div className="relative aspect-[0.92] overflow-hidden bg-doxa-petal">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:saturate-105" src={product.image} alt={product.title} loading="lazy" />
        <span className="absolute left-3 top-3 inline-flex rounded-full bg-doxa-petal px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-doxa-crimson">
          {product.badge}
        </span>
      </div>
      <div className="grid gap-4 p-4">
        <div>
          <p className="mb-1.5 text-xs font-extrabold text-doxa-muted">{product.category}</p>
          <h3 className="min-h-[46px] text-[17px] font-bold leading-snug text-doxa-noir">{product.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-doxa-slate">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-black text-doxa-crimson">
            <Star size={15} fill="currentColor" /> {product.rating}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-doxa-indigo">
            Ready to shop <ExternalLink size={14} />
          </span>
        </div>
        <a
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-doxa-noir text-[13px] font-black text-white transition hover:-translate-y-px hover:bg-doxa-crimson"
          href="https://doxa-atelier.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          <ShoppingBag size={17} /> Quick add
        </a>
      </div>
    </article>
  );
}

export function Products() {
  return (
    <section className="mx-auto w-container pt-20 lg:pt-28" id="products">
      <SectionHeading
        eyebrow="Featured products"
        title="Signature boxes ready for thoughtful, fast conversion."
        action={
          <div className="inline-flex min-h-[42px] w-fit items-center gap-2 rounded-full bg-doxa-sky px-3.5 text-[13px] font-black text-doxa-indigo">
            <Timer size={17} />
            <span>Spring drop closes in 02:18:44</span>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </section>
  );
}
