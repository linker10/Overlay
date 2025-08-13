import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Compose class names with Tailwind-merge awareness.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
