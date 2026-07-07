"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { cn } from "@/src/lib/cn";
import {
  NAV_ITEMS,
  APP_NAME,
  HOSPITAL_NAME,
  ADMIN_NAME,
  ADMIN_EMAIL,
} from "@/src/constants/app";

// ─── Logo icon ────────────────────────────────────────────────────────────────
function QueueCareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <polyline
        points="3,12 6,12 8,6 11,18 13,9 15,14 17,12 21,12"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Sign out icon ────────────────────────────────────────────────────────────
function SignOutIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleSignOut() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <aside
      aria-label="Main navigation"
      className="w-64 h-full bg-white border-r border-gray-100 flex flex-col flex-shrink-0"
    >
      {/* Logo + mobile close */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center flex-shrink-0">
            <QueueCareIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-sm leading-tight">
              {APP_NAME}
            </div>
            <div className="text-xs text-gray-500 leading-tight">
              {HOSPITAL_NAME}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isActive
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
              )}
              onClick={onClose}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  isActive ? "bg-white" : "border-2 border-gray-300",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-50"
          role="status"
          aria-label="Signed in as Apollo Admin"
        >
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {ADMIN_NAME}
            </div>
            <div className="text-xs text-gray-500 truncate leading-tight">
              {ADMIN_EMAIL}
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className={cn(
            "mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 w-full rounded-lg",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          )}
          aria-label="Sign out"
        >
          <SignOutIcon />
          Sign out
        </button>
      </div>
    </aside>
  );
}
