export function Footer() {
  return (
    <footer className="mx-auto grid w-container gap-7 py-12 lg:grid-cols-[1fr_auto_auto] lg:items-center">
      <div>
        <img className="h-[52px] w-[140px] object-contain object-left" src="/assets/doxa-atelier-logo-wide.png" alt="DOXA Atelier" />
        <p className="mt-1.5 text-[13px] font-bold text-doxa-muted">Regina, Saskatchewan, Canada · +1 306 539 0230</p>
      </div>
      <div className="flex flex-wrap gap-3" aria-label="Footer navigation">
        {["Collections", "Products", "Experience", "VIP access"].map((item) => (
          <a className="text-[13px] font-black text-doxa-slate" href={item === "VIP access" ? "#order" : `#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </div>
      <div className="flex flex-wrap gap-3" aria-label="Payment and support">
        {["Visa", "Mastercard", "Stripe", "Support"].map((item) => (
          <span className="rounded-md border border-doxa-border-light bg-white px-2.5 py-1.5 text-[13px] font-black text-doxa-slate" key={item}>
            {item}
          </span>
        ))}
      </div>
    </footer>
  );
}
