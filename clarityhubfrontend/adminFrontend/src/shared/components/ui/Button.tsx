import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--doxa-indigo),var(--doxa-crimson))] text-white hover:opacity-95 shadow-[var(--shadow-md)]",
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]",
  ghost: "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
  destructive:
    "bg-[var(--danger)] text-white hover:opacity-90 shadow-[0_16px_40px_rgba(223,92,85,0.25)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 rounded-xl px-4 text-sm",
  md: "h-11 rounded-2xl px-5 text-sm",
  lg: "h-13 rounded-2xl px-6 text-base",
};

export const Button = ({
  className,
  children,
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {leadingIcon}
    <span>{children}</span>
    {trailingIcon}
  </button>
);

export default Button;
