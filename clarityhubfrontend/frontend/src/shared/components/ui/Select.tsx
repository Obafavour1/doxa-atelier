import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
};

export const Select = ({
  children,
  className,
  label,
  error,
  hint,
  icon,
  id,
  ...props
}: SelectProps) => (
  <label className="block space-y-2" htmlFor={id}>
    {label ? <span className="text-sm font-semibold text-ink-100">{label}</span> : null}
    <span
      className={cn(
        "surface-card flex h-12 items-center gap-3 rounded-2xl px-4",
        error ? "border-danger-500/60" : "focus-within:border-brand-400/60",
      )}
    >
      {icon ? <span className="text-ink-300">{icon}</span> : null}
      <select
        id={id}
        className={cn(
          "w-full appearance-none bg-transparent text-sm text-white outline-none",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="h-4 w-4 text-ink-400" />
    </span>
    {error ? <span className="text-sm text-red-300">{error}</span> : null}
    {!error && hint ? <span className="text-sm text-ink-400">{hint}</span> : null}
  </label>
);

export default Select;
