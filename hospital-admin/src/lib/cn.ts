/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx for this project size.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
