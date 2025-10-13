/**
 * Utility functions for removing "Average" prefix from occupation titles while preserving location information
 */

/**
 * Removes "Average" prefix from occupation titles but keeps location information
 * @param title - The full occupation title (e.g., "Average Software Engineer Salary in Sydney, Australia")
 * @returns Title without "Average" prefix (e.g., "Software Engineer Salary in Sydney, Australia")
 */
export function removeAveragePrefix(title: string): string {
  if (!title) return '';
  
  // Remove "Average" from the beginning only
  return title.replace(/^Average\s+/i, '').trim();
}
