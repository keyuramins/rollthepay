/**
 * Utility functions for cleaning and formatting occupation titles
 */

/**
 * Cleans occupation titles by removing "Average" prefix and location information
 * @param title - The full occupation title (e.g., "Average Software Engineer Salary in Sydney, Australia")
 * @returns Clean occupation title (e.g., "Software Engineer")
 */
export function cleanTitle(title: string): string {
  if (!title) return '';
  
  // Remove "Average" from the beginning
  let cleaned = title.replace(/^Average\s+/i, '');
  
  // Remove everything from "Salary" onwards (including location info)
  const salaryIndex = cleaned.toLowerCase().indexOf(' salary');
  if (salaryIndex !== -1) {
    cleaned = cleaned.substring(0, salaryIndex);
  }
  
  return cleaned.trim();
}

/**
 * Alternative name for the same function - for backward compatibility
 */
export const cleanOccupationTitle = cleanTitle;

/**
 * Formats location string properly by filtering out empty, null, or "Unknown" values
 * @param location - The city/location name
 * @param state - The state/province name
 * @param country - The country name
 * @returns Properly formatted location string with commas
 */
export function formatLocationString(location?: string, state?: string, country?: string): string {
  const parts = [];
  
  if (location && location.trim() && location !== 'Unknown Location') {
    parts.push(location.trim());
  }
  
  if (state && state.trim() && state !== 'Unknown State') {
    parts.push(state.trim());
  }
  
  if (country && country.trim()) {
    parts.push(country.trim());
  }
  
  return parts.join(', ');
}
