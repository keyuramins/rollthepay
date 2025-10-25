// lib/format/million-currency.ts
import type { OccupationRecord } from "@/lib/data/types";
import { formatCurrency, getCurrencySymbol } from "./currency";

/**
 * Format a number as currency with million denotation (M) when amount exceeds 6 digits
 * This is specifically for occupation page hero section and bonus compensation
 * @param amount - The amount to format
 * @param country - The country slug (lowercase)
 * @param record - Optional occupation record for additional context
 * @param isHourly - Whether to format as hourly rate (adds /hr suffix)
 * @returns Formatted currency string with M denotation for amounts > 6 digits
 */
export function formatCurrencyWithMillion(
  amount: number | null, 
  country: string, 
  record?: OccupationRecord,
  isHourly?: boolean
): string {
  if (amount == null || isNaN(amount)) {
    return "N/A";
  }

  const countryLower = country.toLowerCase();
  
  // For amounts exceeding 6 digits (1,000,000+), use M denotation
  if (amount >= 1000000) {
    const symbol = getCurrencySymbol(countryLower);
    const millions = amount / 1000000;
    
    // Format millions with appropriate decimal places
    let formattedMillions: string;
    if (millions >= 100) {
      // For very large amounts (100M+), show no decimals
      formattedMillions = Math.round(millions).toString();
    } else if (millions >= 10) {
      // For amounts 10M-99M, show 1 decimal place
      formattedMillions = millions.toFixed(1);
    } else {
      // For amounts 1M-9M, show 2 decimal places
      formattedMillions = millions.toFixed(2);
    }
    
    // Remove trailing zeros and decimal point if not needed
    formattedMillions = formattedMillions.replace(/\.?0+$/, '');
    
    const result = `${symbol}${formattedMillions}M`;
    return isHourly ? `${result}/hr` : result;
  }
  
  // For amounts under 1 million, use the standard formatting
  return formatCurrency(amount, country, record, isHourly);
}

/**
 * Format a number as hourly rate with million denotation when appropriate
 * @param amount - The hourly amount to format
 * @param country - The country slug (lowercase)
 * @returns Formatted hourly rate string with M denotation for amounts > 6 digits
 */
export function formatHourlyRateWithMillion(amount: number | null, country: string): string {
  if (amount == null || isNaN(amount)) {
    return "N/A";
  }

  return formatCurrencyWithMillion(amount, country, undefined, true);
}
