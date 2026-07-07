import { cn } from "@/src/lib/cn";
import { getAvatarColor } from "@/src/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  initial: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-xl",
};

export function Avatar({ initial, size = "sm", className }: AvatarProps) {
  return (
    <div
      aria-label={`Avatar for ${initial}`}
      className={cn(
        "rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
        getAvatarColor(initial),
        sizeClasses[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
