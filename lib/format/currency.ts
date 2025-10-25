// lib/format/currency.ts
import type { OccupationRecord } from "@/lib/data/types";
import { continents } from "@/app/constants/continents";

// Create a comprehensive country configuration from continents data
const createCountryConfig = () => {
  const config: Record<string, { currency: string; locale: string; symbol: string }> = {};
  
  // Flatten all countries from continents
  const allCountries = continents.flatMap(continent => continent.countries);
  
  // Map each country to its currency configuration
  allCountries.forEach(country => {
    const countrySlug = country.slug;
    const currencySymbol = country.currencySymbol;
    
    // Determine currency code and locale based on country
    let currencyCode: string;
    let locale: string;
    
    switch (countrySlug) {
      // Africa
      case 'algeria': currencyCode = 'DZD'; locale = 'ar-DZ'; break;
      case 'angola': currencyCode = 'AOA'; locale = 'pt-AO'; break;
      case 'botswana': currencyCode = 'BWP'; locale = 'en-BW'; break;
      case 'cameroon': currencyCode = 'XAF'; locale = 'fr-CM'; break;
      case 'ghana': currencyCode = 'GHS'; locale = 'en-GH'; break;
      case 'kenya': currencyCode = 'KES'; locale = 'en-KE'; break;
      case 'mauritius': currencyCode = 'MUR'; locale = 'en-MU'; break;
      case 'morocco': currencyCode = 'MAD'; locale = 'ar-MA'; break;
      case 'mozambique': currencyCode = 'MZN'; locale = 'pt-MZ'; break;
      case 'namibia': currencyCode = 'NAD'; locale = 'en-NA'; break;
      case 'nigeria': currencyCode = 'NGN'; locale = 'en-NG'; break;
      case 'swaziland': currencyCode = 'SZL'; locale = 'en-SZ'; break;
      case 'tunisia': currencyCode = 'TND'; locale = 'ar-TN'; break;
      case 'tanzania': currencyCode = 'TZS'; locale = 'en-TZ'; break;
      case 'uganda': currencyCode = 'UGX'; locale = 'en-UG'; break;
      case 'zambia': currencyCode = 'ZMW'; locale = 'en-ZM'; break;
      case 'zimbabwe': currencyCode = 'ZWL'; locale = 'en-ZW'; break;
      case 'south-africa': currencyCode = 'ZAR'; locale = 'en-ZA'; break;
      
      // Asia
      case 'afghanistan': currencyCode = 'AFN'; locale = 'fa-AF'; break;
      case 'azerbaijan': currencyCode = 'AZN'; locale = 'az-AZ'; break;
      case 'bahrain': currencyCode = 'BHD'; locale = 'ar-BH'; break;
      case 'bangladesh': currencyCode = 'BDT'; locale = 'bn-BD'; break;
      case 'british-indian-ocean-territory': currencyCode = 'USD'; locale = 'en-IO'; break;
      case 'cambodia': currencyCode = 'KHR'; locale = 'km-KH'; break;
      case 'china': currencyCode = 'CNY'; locale = 'zh-CN'; break;
      case 'hong-kong': currencyCode = 'HKD'; locale = 'en-HK'; break;
      case 'india': currencyCode = 'INR'; locale = 'en-IN'; break;
      case 'iran': currencyCode = 'IRR'; locale = 'fa-IR'; break;
      case 'iraq': currencyCode = 'IQD'; locale = 'ar-IQ'; break;
      case 'israel': currencyCode = 'ILS'; locale = 'he-IL'; break;
      case 'japan': currencyCode = 'JPY'; locale = 'ja-JP'; break;
      case 'jordan': currencyCode = 'JOD'; locale = 'ar-JO'; break;
      case 'kazakhstan': currencyCode = 'KZT'; locale = 'kk-KZ'; break;
      case 'korea': currencyCode = 'KRW'; locale = 'ko-KR'; break;
      case 'kuwait': currencyCode = 'KWD'; locale = 'ar-KW'; break;
      case 'lebanon': currencyCode = 'LBP'; locale = 'ar-LB'; break;
      case 'malaysia': currencyCode = 'MYR'; locale = 'ms-MY'; break;
      case 'myanmar': currencyCode = 'MMK'; locale = 'my-MM'; break;
      case 'nepal': currencyCode = 'NPR'; locale = 'ne-NP'; break;
      case 'oman': currencyCode = 'OMR'; locale = 'ar-OM'; break;
      case 'pakistan': currencyCode = 'PKR'; locale = 'ur-PK'; break;
      case 'qatar': currencyCode = 'QAR'; locale = 'ar-QA'; break;
      case 'philippines': currencyCode = 'PHP'; locale = 'en-PH'; break;
      case 'saudi-arabia': currencyCode = 'SAR'; locale = 'ar-SA'; break;
      case 'sri-lanka': currencyCode = 'LKR'; locale = 'si-LK'; break;
      case 'singapore': currencyCode = 'SGD'; locale = 'en-SG'; break;
      case 'brunei-darussalam': currencyCode = 'BND'; locale = 'ms-BN'; break;
      case 'thailand': currencyCode = 'THB'; locale = 'th-TH'; break;
      case 'turkey': currencyCode = 'TRY'; locale = 'tr-TR'; break;
      case 'taiwan': currencyCode = 'TWD'; locale = 'zh-TW'; break;
      case 'vietnam': currencyCode = 'VND'; locale = 'vi-VN'; break;
      case 'indonesia': currencyCode = 'IDR'; locale = 'id-ID'; break;
      
      // Europe
      case 'albania': currencyCode = 'ALL'; locale = 'sq-AL'; break;
      case 'austria': currencyCode = 'EUR'; locale = 'de-AT'; break;
      case 'belarus': currencyCode = 'BYN'; locale = 'be-BY'; break;
      case 'belgium': currencyCode = 'EUR'; locale = 'nl-BE'; break;
      case 'bulgaria': currencyCode = 'BGN'; locale = 'bg-BG'; break;
      case 'czech-republic': currencyCode = 'CZK'; locale = 'cs-CZ'; break;
      case 'denmark': currencyCode = 'DKK'; locale = 'da-DK'; break;
      case 'estonia': currencyCode = 'EUR'; locale = 'et-EE'; break;
      case 'finland': currencyCode = 'EUR'; locale = 'fi-FI'; break;
      case 'france': currencyCode = 'EUR'; locale = 'fr-FR'; break;
      case 'germany': currencyCode = 'EUR'; locale = 'de-DE'; break;
      case 'gibraltar': currencyCode = 'GBP'; locale = 'en-GI'; break;
      case 'greece': currencyCode = 'EUR'; locale = 'el-GR'; break;
      case 'hungary': currencyCode = 'HUF'; locale = 'hu-HU'; break;
      case 'italy': currencyCode = 'EUR'; locale = 'it-IT'; break;
      case 'latvia': currencyCode = 'EUR'; locale = 'lv-LV'; break;
      case 'lithuania': currencyCode = 'EUR'; locale = 'lt-LT'; break;
      case 'luxembourg': currencyCode = 'EUR'; locale = 'fr-LU'; break;
      case 'malta': currencyCode = 'EUR'; locale = 'mt-MT'; break;
      case 'netherlands': currencyCode = 'EUR'; locale = 'nl-NL'; break;
      case 'norway': currencyCode = 'NOK'; locale = 'nb-NO'; break;
      case 'poland': currencyCode = 'PLN'; locale = 'pl-PL'; break;
      case 'portugal': currencyCode = 'EUR'; locale = 'pt-PT'; break;
      case 'romania': currencyCode = 'RON'; locale = 'ro-RO'; break;
      case 'russia': currencyCode = 'RUB'; locale = 'ru-RU'; break;
      case 'slovakia': currencyCode = 'EUR'; locale = 'sk-SK'; break;
      case 'slovenia': currencyCode = 'EUR'; locale = 'sl-SI'; break;
      case 'sweden': currencyCode = 'SEK'; locale = 'sv-SE'; break;
      case 'switzerland': currencyCode = 'CHF'; locale = 'de-CH'; break;
      case 'ukraine': currencyCode = 'UAH'; locale = 'uk-UA'; break;
      case 'ireland': currencyCode = 'EUR'; locale = 'en-IE'; break;
      case 'spain': currencyCode = 'EUR'; locale = 'es-ES'; break;
      
      // Middle East
      case 'bahrain': currencyCode = 'BHD'; locale = 'ar-BH'; break;
      case 'cyprus': currencyCode = 'EUR'; locale = 'el-CY'; break;
      case 'egypt': currencyCode = 'EGP'; locale = 'ar-EG'; break;
      case 'iran': currencyCode = 'IRR'; locale = 'fa-IR'; break;
      case 'iraq': currencyCode = 'IQD'; locale = 'ar-IQ'; break;
      case 'israel': currencyCode = 'ILS'; locale = 'he-IL'; break;
      case 'jordan': currencyCode = 'JOD'; locale = 'ar-JO'; break;
      case 'kuwait': currencyCode = 'KWD'; locale = 'ar-KW'; break;
      case 'lebanon': currencyCode = 'LBP'; locale = 'ar-LB'; break;
      case 'oman': currencyCode = 'OMR'; locale = 'ar-OM'; break;
      case 'qatar': currencyCode = 'QAR'; locale = 'ar-QA'; break;
      case 'saudi-arabia': currencyCode = 'SAR'; locale = 'ar-SA'; break;
      case 'turkey': currencyCode = 'TRY'; locale = 'tr-TR'; break;
      case 'united-arab-emirates': currencyCode = 'AED'; locale = 'ar-AE'; break;
      
      // North America
      case 'barbados': currencyCode = 'BBD'; locale = 'en-BB'; break;
      case 'belize': currencyCode = 'BZD'; locale = 'en-BZ'; break;
      case 'bermuda': currencyCode = 'BMD'; locale = 'en-BM'; break;
      case 'costa-rica': currencyCode = 'CRC'; locale = 'es-CR'; break;
      case 'jamaica': currencyCode = 'JMD'; locale = 'en-JM'; break;
      case 'guatemala': currencyCode = 'GTQ'; locale = 'es-GT'; break;
      case 'dominican-republic': currencyCode = 'DOP'; locale = 'es-DO'; break;
      case 'puerto-rico': currencyCode = 'USD'; locale = 'en-PR'; break;
      case 'canada': currencyCode = 'CAD'; locale = 'en-CA'; break;
      case 'mexico': currencyCode = 'MXN'; locale = 'es-MX'; break;
      case 'bahamas': currencyCode = 'BSD'; locale = 'en-BS'; break;
      case 'guyana': currencyCode = 'GYD'; locale = 'en-GY'; break;
      case 'trinidad-and-tobago': currencyCode = 'TTD'; locale = 'en-TT'; break;
      
      // Oceania
      case 'australia': currencyCode = 'AUD'; locale = 'en-AU'; break;
      case 'fiji': currencyCode = 'FJD'; locale = 'en-FJ'; break;
      case 'guam': currencyCode = 'USD'; locale = 'en-GU'; break;
      case 'papua-new-guinea': currencyCode = 'PGK'; locale = 'en-PG'; break;
      case 'new-zealand': currencyCode = 'NZD'; locale = 'en-NZ'; break;
      
      // South America
      case 'brazil': currencyCode = 'BRL'; locale = 'pt-BR'; break;
      case 'argentina': currencyCode = 'ARS'; locale = 'es-AR'; break;
      case 'chile': currencyCode = 'CLP'; locale = 'es-CL'; break;
      case 'colombia': currencyCode = 'COP'; locale = 'es-CO'; break;
      case 'peru': currencyCode = 'PEN'; locale = 'es-PE'; break;
      case 'venezuela': currencyCode = 'VES'; locale = 'es-VE'; break;
      case 'ecuador': currencyCode = 'USD'; locale = 'es-EC'; break;
      case 'uruguay': currencyCode = 'UYU'; locale = 'es-UY'; break;
      
      default:
        // Fallback for any unmapped countries
        currencyCode = 'USD';
        locale = 'en-US';
        break;
    }
    
    config[countrySlug] = {
      currency: currencyCode,
      locale: locale,
      symbol: currencySymbol
    };
  });
  
  return config;
};

// Initialize the country configuration
const COUNTRY_CONFIG = createCountryConfig();

/**
 * Format a number as currency based on country using proper currency symbols
 * @param amount - The amount to format
 * @param country - The country slug (lowercase)
 * @param record - Optional occupation record for additional context
 * @param isHourly - Whether to format as hourly rate (adds /hr suffix)
 * @returns Formatted currency string with proper symbol
 */
export function formatCurrency(
  amount: number | null, 
  country: string, 
  record?: OccupationRecord,
  isHourly?: boolean
): string {
  if (amount == null || isNaN(amount)) {
    return "N/A";
  }

  const countryLower = country.toLowerCase();
  const config = COUNTRY_CONFIG[countryLower];
  
  if (!config) {
    // This should not happen as all countries in continents data are mapped
    // But provide a fallback just in case
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Special handling for Indian numbering system (lakhs, crores)
  if (countryLower === 'india' && !isHourly) {
    if (amount >= 10000000) {
      return `${config.symbol}${(amount / 10000000).toFixed(1)} crore`;
    } else if (amount >= 100000) {
      return `${config.symbol}${(amount / 100000).toFixed(1)} lakh`;
    }
  }

  // For most currencies, use the custom symbol with proper number formatting
  try {
    // For hourly rates, show more decimal places
    const fractionDigits = isHourly ? 2 : 0;
    
    // Format the number with proper locale-specific number formatting
    const formattedNumber = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
    
    // Combine the custom symbol with the formatted number
    const result = `${config.symbol}${formattedNumber}`;
    
    // Add hourly suffix if needed
    return isHourly ? `${result}/hr` : result;
  } catch (error) {
    // Fallback to simple formatting if locale is not supported
    const result = `${config.symbol}${amount.toLocaleString()}`;
    return isHourly ? `${result}/hr` : result;
  }
}

/**
 * Format a number as hourly rate based on country
 * @param amount - The hourly amount to format
 * @param country - The country slug (lowercase)
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
 * @param country - The country slug (lowercase)
 * @returns Currency code (e.g., "AUD", "INR")
 */
export function getCurrencyCode(country: string): string {
  const countryLower = country.toLowerCase();
  return COUNTRY_CONFIG[countryLower]?.currency || "USD";
}

/**
 * Get locale for a country
 * @param country - The country slug (lowercase)
 * @returns Locale string (e.g., "en-AU", "en-IN")
 */
export function getLocale(country: string): string {
  const countryLower = country.toLowerCase();
  return COUNTRY_CONFIG[countryLower]?.locale || "en-US";
}

/**
 * Get currency symbol for a country
 * @param country - The country slug (lowercase)
 * @returns Currency symbol (e.g., "$", "₹", "€")
 */
export function getCurrencySymbol(country: string): string {
  const countryLower = country.toLowerCase();
  return COUNTRY_CONFIG[countryLower]?.symbol || "$";
}

/**
 * Get complete currency configuration for a country
 * @param country - The country slug (lowercase)
 * @returns Complete currency configuration object
 */
export function getCurrencyConfig(country: string): { currency: string; locale: string; symbol: string } | null {
  const countryLower = country.toLowerCase();
  return COUNTRY_CONFIG[countryLower] || null;
}

