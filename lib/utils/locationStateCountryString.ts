/**
 * Formats location string properly by filtering out empty, null, or "Unknown" values
 * @param location - The city/location name
 * @param state - The state/province name
 * @param country - The country name
 * @returns Properly formatted location string with commas
 */
export function locationStateCountryString(location?: string, state?: string, country?: string): string {
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