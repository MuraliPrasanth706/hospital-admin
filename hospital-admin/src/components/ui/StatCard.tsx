import { cn } from "@/src/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel: string;
  dotColor: string;
  /** When true renders a smaller compact variant (Queue page) */
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  subLabel,
  dotColor,
  compact = false,
}: StatCardProps) {
  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
        <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", dotColor)} />
        <div>
          <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={cn("w-3 h-3 rounded-full", dotColor)} />
        <span className="text-xs font-semibold text-gray-400 tracking-widest">
          TODAY
        </span>
      </div>
      <p className="text-4xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-2">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{subLabel}</p>
    </div>
  );
}
