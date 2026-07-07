import { memo } from "react";
import { cn } from "@/src/lib/cn";

interface DoctorTabsProps {
  doctors: { id: string; name: string; specialty: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const DoctorTabs = memo(function DoctorTabs({
  doctors,
  activeId,
  onSelect,
}: DoctorTabsProps) {
  return (
    <div role="tablist" aria-label="Select doctor" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none overflow-x-auto pb-1 scrollbar-none">
      {doctors.map((doc) => {
        const isActive = activeId === doc.id;
        return (
          <button
            key={doc.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`queue-panel-${doc.id}`}
            id={`tab-${doc.id}`}
            onClick={() => onSelect(doc.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive
                ? "bg-[#2563EB] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
            )}
          >
            {doc.name}
          </button>
        );
      })}
    </div>
  );
});
