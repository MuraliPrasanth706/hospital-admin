export const BRAND_COLOR = "#2563EB" as const;

export const AVATAR_COLOR_MAP: Record<string, string> = {
  R: "bg-blue-600",
  M: "bg-violet-500",
  V: "bg-teal-500",
  S: "bg-amber-500",
  K: "bg-cyan-600",
  A: "bg-indigo-500",
  N: "bg-pink-500",
  P: "bg-emerald-600",
};

export const DEFAULT_AVATAR_COLOR = "bg-blue-600" as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Queue", href: "/queue" },
  { label: "Doctors", href: "/doctors" },
  { label: "Settings", href: "/settings" },
] as const;

export const PAGE_META: Record<string, { label: string; num: string }> = {
  "/dashboard": { label: "Dashboard", num: "01" },
  "/queue": { label: "Queue Management", num: "02" },
  "/doctors": { label: "Doctor Management", num: "03" },
  "/settings": { label: "Settings", num: "04" },
};

export const APP_NAME = "QueueCare" as const;
export const APP_TAGLINE = "Hospital Queue Management" as const;
export const HOSPITAL_NAME = "Apollo Hospital" as const;
export const ADMIN_NAME = "Apollo Admin" as const;
export const ADMIN_EMAIL = "admin@apollo.com" as const;
