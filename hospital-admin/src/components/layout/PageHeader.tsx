import React from "react";
import { cn } from "@/src/lib/cn";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import Link from "next/link";

// ─── Search Icon ──────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

// ─── Bell Icon ────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-white border-b border-gray-100 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between flex-shrink-0",
        className,
      )}
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3" role="toolbar" aria-label="Page actions">
        <div className="hidden md:block">
          <Input
            leadingIcon={<SearchIcon />}
            placeholder="Search patients, doctors…"
            aria-label="Search patients or doctors"
            className="w-48 lg:w-64 bg-white"
          />
        </div>
        <button
          aria-label="Notifications"
          className="hidden sm:flex p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <BellIcon />
        </button>
        <Link
          href="/queue"
          className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors text-sm px-4 py-2.5 bg-[#2563EB] text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
        >
          Live queue
        </Link>
      </div>
    </header>
  );
}
