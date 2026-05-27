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
    "bg-brand-500 text-white hover:bg-brand-400 shadow-[0_16px_40px_rgba(29,168,111,0.32)]",
  secondary:
    "border border-white/10 bg-white/6 text-white hover:bg-white/10",
  ghost: "text-ink-100 hover:bg-white/6",
  destructive:
    "bg-danger-500 text-white hover:bg-[#ee726b] shadow-[0_16px_40px_rgba(223,92,85,0.25)]",
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
