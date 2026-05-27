import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, icon, id, ...props },
  ref,
) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      {label ? <span className="text-sm font-semibold text-ink-100">{label}</span> : null}
      <span
        className={cn(
          "surface-card flex h-12 items-center gap-3 rounded-2xl px-4 transition",
          error ? "border-danger-500/60" : "focus-within:border-brand-400/60",
        )}
      >
        {icon ? <span className="text-ink-300">{icon}</span> : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-transparent text-sm text-white outline-none placeholder:text-ink-400",
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </span>
      {error ? <span className="text-sm text-red-300">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-ink-400">{hint}</span> : null}
    </label>
  );
});

export default Input;
