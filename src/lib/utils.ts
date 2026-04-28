import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution.
 * Use in every component for conditional class composition.
 *
 * @example
 * cn("text-text-primary", isActive && "text-neon-cyan")
 * cn("btn-primary", size === "sm" && "px-4 py-2")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}