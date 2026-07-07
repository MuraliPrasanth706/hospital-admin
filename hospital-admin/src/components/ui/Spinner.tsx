import { cn } from "@/src/lib/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "w-4 h-4 border-2",
  md: "w-7 h-7 border-[3px]",
  lg: "w-10 h-10 border-4",
} as const;

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-gray-200 border-t-[#2563EB] animate-spin",
        SIZE[size],
        className,
      )}
    />
  );
}
