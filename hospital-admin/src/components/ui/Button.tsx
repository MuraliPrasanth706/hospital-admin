import { forwardRef } from "react";
import { cn } from "@/src/lib/cn";

type Variant = "primary" | "secondary" | "danger" | "success" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#2563EB] text-white hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary:
    "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus-visible:ring-gray-400",
  danger:
    "border border-red-200 text-red-500 bg-white hover:bg-red-50 focus-visible:ring-red-400",
  success:
    "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-400",
  ghost:
    "text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
