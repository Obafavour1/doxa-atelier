import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
};

export const Card = ({
  className,
  eyebrow,
  title,
  description,
  action,
  children,
  ...props
}: CardProps) => (
  <section className={cn("surface-card rounded-[28px] p-6", className)} {...props}>
    {(eyebrow || title || description || action) && (
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">{eyebrow}</p>
          ) : null}
          {title ? <h3 className="text-xl font-bold text-white">{title}</h3> : null}
          {description ? <p className="max-w-2xl text-sm text-ink-300">{description}</p> : null}
        </div>
        {action}
      </header>
    )}
    {children}
  </section>
);

export default Card;
