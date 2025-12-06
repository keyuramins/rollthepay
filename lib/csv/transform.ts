// lib/csv/transform.ts
import type { RawCsvRow } from '@/lib/data/types';

/**
 * CSV Transformation Utilities
 * 
 * IMPORTANT: CSV headers must use snake_case format (e.g., avg_annual_salary, not avgAnnualSalary)
 * 
 * Required CSV columns:
 * - title (required)
 * - slug_url (required)
 * - country (required)
 * 
 * Optional CSV columns (all snake_case):
 * - occ_name, company_name, state, location
 * - avg_annual_salary, avg_hourly_salary, hourly_low_value, hourly_high_value
 * - fortnightly_salary, monthly_salary, total_pay_min, total_pay_max
 * - bonus_range_min, bonus_range_max, profit_sharing_min, profit_sharing_max
 * - commission_min, commission_max
 * - gender_male, gender_female
 * - one_yr, one_four_yrs, five_nine_yrs, ten_nineteen_yrs, twenty_yrs_plus
 * - percentile_10, percentile_25, percentile_50, percentile_75, percentile_90
 * - skills (JSON string array: [{"name": "Python", "percentage": 85}])
 * 
 * Skills format:
 * - Must be a JSON string array
 * - Supports double-encoded JSON (will be parsed automatically)
 * - Only skills with both name and percentage (non-null) are imported
 * - Maximum 10 skills per record
 */

// Helpers shared between CLI CSV import and admin API CSV import

export function isInvalidToken(value: unknown): boolean {
  if (value == null) return true;
  const v = String(value).trim();
  return v.length === 0 || v.toUpperCase() === '#REF!';
}

export function safeString(value: unknown): string | null {
  if (isInvalidToken(value)) return null;
  return String(value).trim();
}

export function coerceNumber(value: unknown): number | null {
  if (isInvalidToken(value)) return null;
  const normalized = String(value).replace(/[^0-9+\-.]/g, '');
  if (normalized.length === 0) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

// Shared mapping: RawCsvRow (snake_case headers) -> OccupationRecord-compatible shape
export function transformCsvRowToDb(row: RawCsvRow): any {
  const title = safeString(row.title);
  const slug = safeString(row.slug_url);
  const country = safeString(row.country);

  if (!title || !slug || !country) return null;

  return {
    // Core identity
    slug_url: slug,
    title,
    occ_name: safeString(row.occ_name),
    company_name: safeString(row.company_name),
    country,
    state: safeString(row.state),
    location: safeString(row.location),

    // Salary fields
    avgAnnualSalary: coerceNumber((row as any).avg_annual_salary),
    avgHourlySalary: coerceNumber((row as any).avg_hourly_salary),
    hourlyLowValue: coerceNumber((row as any).hourly_low_value),
    hourlyHighValue: coerceNumber((row as any).hourly_high_value),
    fortnightlySalary: coerceNumber((row as any).fortnightly_salary),
    monthlySalary: coerceNumber((row as any).monthly_salary),
    totalPayMin: coerceNumber((row as any).total_pay_min),
    totalPayMax: coerceNumber((row as any).total_pay_max),

    // Additional compensation
    bonusRangeMin: coerceNumber((row as any).bonus_range_min),
    bonusRangeMax: coerceNumber((row as any).bonus_range_max),
    profitSharingMin: coerceNumber((row as any).profit_sharing_min),
    profitSharingMax: coerceNumber((row as any).profit_sharing_max),
    commissionMin: coerceNumber((row as any).commission_min),
    commissionMax: coerceNumber((row as any).commission_max),

    // Gender distribution
    genderMale: coerceNumber((row as any).gender_male),
    genderFemale: coerceNumber((row as any).gender_female),

    // Years of experience salaries
    oneYr: coerceNumber((row as any).one_yr),
    oneFourYrs: coerceNumber((row as any).one_four_yrs),
    fiveNineYrs: coerceNumber((row as any).five_nine_yrs),
    tenNineteenYrs: coerceNumber((row as any).ten_nineteen_yrs),
    twentyYrsPlus: coerceNumber((row as any).twenty_yrs_plus),

    // Salary percentiles
    '10P': coerceNumber((row as any).percentile_10),
    '25P': coerceNumber((row as any).percentile_25),
    '50P': coerceNumber((row as any).percentile_50),
    '75P': coerceNumber((row as any).percentile_75),
    '90P': coerceNumber((row as any).percentile_90),

    // Skills JSONB → array of {name, percentage}
    // Skills JSONB → array of {name, percentage}
skills: (() => {
    const skillsStr = safeString((row as any).skills);
    if (!skillsStr) return null;
  
    let parsed: any;
  
    try {
      // First parse
      parsed = JSON.parse(skillsStr);
  
      // If CSV contained double-encoded JSON → parse again
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
    } catch {
      return null;
    }
  
    if (!Array.isArray(parsed)) return null;
  
    return parsed.slice(0, 10)
      .map(s => ({
        name: safeString(s?.name),
        percentage: coerceNumber(s?.percentage)
      }))
      .filter(s => s.name !== null && s.percentage !== null);
  })(),      
  };
}
