import { cn } from "@/src/lib/cn";
import type { AppointmentStatus } from "@/src/types";

interface BadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig: Record<
  AppointmentStatus,
  { label: string; classes: string }
> = {
  "In Progress": {
    label: "In Progress",
    classes: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  Waiting: {
    label: "Waiting",
    classes: "bg-amber-50 text-amber-600 border border-amber-100",
  },
  Emergency: {
    label: "Emergency",
    classes: "bg-red-50 text-red-500 border border-red-100",
  },
  Completed: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
};

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
