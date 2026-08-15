import { Gift } from "lucide-react";
import { NavLinkData } from "../shared/lib/data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-white/70 px-5 py-10 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div>
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl brand-gradient text-white">
              <Gift size={20} />
            </span>
            <div>
              <h2 className="doxa-display text-[var(--text-primary)]">DOXA Atelier</h2>
              <p className="doxa-caption text-[var(--text-secondary)]">Where every gift becomes an experience</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--text-secondary)]">
            Personalized keepsakes · Faith-infused collections · Timeless artistry
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {NavLinkData.map((nav, index) => {
            return (
              <Link
                to={nav.href}
                key={index}
                className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)]"
              >
                {nav.name}
              </Link>
            );
          })}
        </div>
        <ul className="flex gap-5 text-sm font-semibold text-[var(--text-secondary)] md:flex-col">
          <li>
            <a href="https://instagram.com/doxa.atelier">Instagram</a>
          </li>
          <li>
            <a href="mailto:doxagiftatelier@gmail.com">Email</a>
          </li>
          <li>
            <a href="tel:+13065390230">Call</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
