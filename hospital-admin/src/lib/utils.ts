import { AVATAR_COLOR_MAP, DEFAULT_AVATAR_COLOR } from "@/src/constants/app";

/** Returns a deterministic Tailwind bg class for a patient/doctor initial. */
export function getAvatarColor(initial: string): string {
  return AVATAR_COLOR_MAP[initial.toUpperCase()] ?? DEFAULT_AVATAR_COLOR;
}

/** Formats minutes into a compact string: "8m", "15m". */
export function formatMinutes(minutes: number): string {
  return `${minutes}m`;
}

/** Filters a list by name/specialty search query (case-insensitive). */
export function filterByNameOrSpecialty<T extends { name: string; specialty: string }>(
  items: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.specialty.toLowerCase().includes(q),
  );
}
