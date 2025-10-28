// lib/utils/cn (class name) utility function.ts
/**
 * Utility function for merging and cleaning class names
 * Helps in adding multiple class names to a single element conditionally using Tailwind Merge
 */ 
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | false | null | undefined)[]) {
  return twMerge(inputs.filter(Boolean).join(" "))
}