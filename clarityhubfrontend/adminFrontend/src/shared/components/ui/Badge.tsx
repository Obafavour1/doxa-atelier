import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "default" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-white/8 text-ink-100",
  success: "bg-brand-500/15 text-brand-200",
  warning: "bg-warning-500/15 text-[#ffd781]",
  danger: "bg-danger-500/15 text-[#ffb1ac]",
};

export const Badge = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) => {
  const tone = (props as { tone?: BadgeTone }).tone ?? "default";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
