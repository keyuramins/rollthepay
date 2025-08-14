import type { OccupationRecord } from "@/lib/data/types";

// Country to currency and locale mapping
const COUNTRY_CONFIG: Record<string, { currency: string; locale: string }> = {
  australia: { currency: "AUD", locale: "en-AU" },
  india: { currency: "INR", locale: "en-IN" },
  "united states": { currency: "USD", locale: "en-US" },
  "united kingdom": { currency: "GBP", locale: "en-GB" },
  canada: { currency: "CAD", locale: "en-CA" },
  germany: { currency: "EUR", locale: "de-DE" },
  france: { currency: "EUR", locale: "fr-FR" },
  japan: { currency: "JPY", locale: "ja-JP" },
  brazil: { currency: "BRL", locale: "pt-BR" },
  "south africa": { currency: "ZAR", locale: "en-ZA" },
};

/**
 * Format a number as currency based on country
 * @param amount - The amount to format
 * @param country - The country (lowercase)
 * @param record - Optional occupation record for additional context
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | null, 
  country: string, 
  record?: OccupationRecord
): string {
  if (amount == null || isNaN(amount)) {
    return "N/A";
  }

  const countryLower = country.toLowerCase();
  const config = COUNTRY_CONFIG[countryLower];
  
  if (!config) {
    // Fallback to USD if country not configured
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Special handling for different locales
  if (config.locale === "en-IN") {
    // Indian numbering system (lakhs, crores)
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} crore`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} lakh`;
    }
  }

  // Standard currency formatting
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as hourly rate based on country
 * @param amount - The hourly amount to format
 * @param country - The country (lowercase)
 * @returns Formatted hourly rate string
 */
export function formatHourlyRate(amount: number | null, country: string): string {
  if (amount == null || isNaN(amount)) {
    return "N/A";
  }

  const formatted = formatCurrency(amount, country);
  return `${formatted}/hr`;
}

/**
 * Get currency code for a country
 * @param country - The country (lowercase)
 * @returns Currency code (e.g., "AUD", "INR")
 */
export function getCurrencyCode(country: string): string {
  const countryLower = country.toLowerCase();
  return COUNTRY_CONFIG[countryLower]?.currency || "USD";
}

/**
 * Get locale for a country
 * @param country - The country (lowercase)
 * @returns Locale string (e.g., "en-AU", "en-IN")
 */
export function getLocale(country: string): string {
  const countryLower = country.toLowerCase();
  return COUNTRY_CONFIG[countryLower]?.locale || "en-US";
}

