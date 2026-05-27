import { ArrowRight } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-brand-gradient text-white shadow-brand hover:shadow-brand-lg",
  secondary: "border border-doxa-crimson/15 bg-white/75 text-doxa-noir shadow-sm hover:bg-doxa-petal/45",
  ghost: "border border-white/25 bg-white/10 text-white hover:bg-white/15",
};

export function Button({ children, href, variant = "primary" }: ButtonProps) {
  return (
    <a
      className={`inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-5 text-sm font-black transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] ${variants[variant]}`}
      href={href}
    >
      <span>{children}</span>
      <ArrowRight size={18} strokeWidth={2.2} />
    </a>
  );
}
