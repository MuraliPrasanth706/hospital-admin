"use client";

import { usePathname } from "next/navigation";
import { PAGE_META, APP_NAME, APP_TAGLINE } from "@/src/constants/app";

export function DashboardFooter() {
  const pathname = usePathname();
  const page = PAGE_META[pathname] ?? { label: "Dashboard", num: "01" };

  return (
    <footer className="flex-shrink-0 border-t border-gray-100 bg-white px-4 sm:px-4 sm:px-8 py-2.5 flex items-center justify-between">
      <span className="text-xs text-gray-400">
        {APP_NAME} · {APP_TAGLINE} · Desktop UI
      </span>
      <span className="text-xs text-gray-400">
        {page.label} · {page.num}
      </span>
    </footer>
  );
}
