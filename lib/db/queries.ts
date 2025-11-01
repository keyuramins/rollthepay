// lib/db/queries.ts
import 'dotenv/config';
import { cache } from 'react';
import { pool } from './client';
import type { OccupationRecord } from '@/lib/data/types';
import type { DbOccupationRow, SalaryUpdateData } from './types';
import { transformDbRowToOccupationRecord, transformOccupationRecordToDb } from './types';
import type { OccupationListItem } from '@/lib/types/occupation-list';
import { slugify } from '@/lib/format/slug';
// Cursor utilities for keyset pagination
function encodeCursor(parts: any[]): string {
  try { return Buffer.from(JSON.stringify(parts), 'utf8').toString('base64'); } catch { return ''; }
}
function decodeCursor<T = any[]>(cursor?: string): T | undefined {
  if (!cursor) return undefined;
  try { return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8')) as T; } catch { return undefined; }
}

const ORDER_BY_KEYSET = `
  LOWER(COALESCE(title, occ_name, '')),
  LOWER(COALESCE(company_name, '')),
  slug_url
`;

export const getOccupationsForCountryCursor = cache(async ({
  country,
  q,
  letter,
  limit = 50,
  cursor,
}: {
  country: string;
  q?: string;
  letter?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ items: OccupationListItem[]; nextCursor?: string }> => {
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return { items: [], nextCursor: undefined };
  }

  const poolInstance = requirePool();
  const dbCountryName = country.replace(/-/g, ' ');
  const values: any[] = [dbCountryName.toLowerCase()];
  let param = 2;
  const where: string[] = [`LOWER(country) = LOWER($1)`];

  if (q && q.trim()) {
    const s = `%${q.trim().toLowerCase()}%`;
    where.push(`(LOWER(COALESCE(title,'')) LIKE $${param} OR LOWER(COALESCE(occ_name,'')) LIKE $${param} OR LOWER(COALESCE(company_name,'')) LIKE $${param})`);
    values.push(s); param++;
  }
  if (letter && letter.trim().length === 1) {
    where.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${param}`);
    values.push(letter.trim().toLowerCase()); param++;
  }

  const decoded = decodeCursor<[string, string, string]>(cursor);
  if (decoded) {
    const [t, c, s] = decoded;
    where.push(`(LOWER(COALESCE(title, occ_name, '')), LOWER(COALESCE(company_name, '')), slug_url) > ($${param}, $${param+1}, $${param+2})`);
    values.push(t, c, s); param += 3;
  }

  const sql = `
    SELECT slug_url as slug, title, occ_name, location, state, company_name, avg_annual_salary, country
    FROM occupations
    WHERE ${where.join(' AND ')}
    ORDER BY ${ORDER_BY_KEYSET}
    LIMIT $${param}
  `;
  values.push(limit + 1);

  const result = await poolInstance.query(sql, values);
  const rows = result.rows;
  const hasNext = rows.length > limit;
  const slice = hasNext ? rows.slice(0, limit) : rows;

  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;

  const items: OccupationListItem[] = slice.map(row => {
    const baseTitle = row.title || row.occ_name || '';
    const atCompany = row.company_name ? ` at ${row.company_name}` : '';
    const place = row.location || row.state || countryName;
    const inPlace = place ? ` in ${place}` : '';
    return {
      id: row.slug,
      title: baseTitle,
      displayName: `${baseTitle}${atCompany}${inPlace}`,
      slug_url: row.slug,
      location: row.location || undefined,
      state: row.state || undefined,
      avgAnnualSalary: row.avg_annual_salary || undefined,
      countrySlug: slugify(row.country || country),
      company_name: row.company_name || undefined,
    };
  });

  let nextCursor: string | undefined = undefined;
  if (hasNext && slice.length > 0) {
    const last = slice[slice.length - 1];
    nextCursor = encodeCursor([
      (last.title || last.occ_name || '').toLowerCase(),
      (last.company_name || '').toLowerCase(),
      last.slug,
    ]);
  }

  return { items, nextCursor };
});

export const getOccupationsForStateCursor = cache(async ({
  country,
  state,
  q,
  letter,
  limit = 50,
  cursor,
}: {
  country: string;
  state: string;
  q?: string;
  letter?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ items: OccupationListItem[]; nextCursor?: string }> => {
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return { items: [], nextCursor: undefined };
  }
  const poolInstance = requirePool();
  const values: any[] = [country.toLowerCase(), state.toLowerCase()];
  let param = 3;
  const where: string[] = [`LOWER(country) = LOWER($1)`, `LOWER(state) = LOWER($2)`];

  if (q && q.trim()) {
    const s = `%${q.trim().toLowerCase()}%`;
    where.push(`(LOWER(COALESCE(title,'')) LIKE $${param} OR LOWER(COALESCE(occ_name,'')) LIKE $${param} OR LOWER(COALESCE(company_name,'')) LIKE $${param})`);
    values.push(s); param++;
  }
  if (letter && letter.trim().length === 1) {
    where.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${param}`);
    values.push(letter.trim().toLowerCase()); param++;
  }

  const decoded = decodeCursor<[string, string, string]>(cursor);
  if (decoded) {
    const [t, c, s] = decoded;
    where.push(`(LOWER(COALESCE(title, occ_name, '')), LOWER(COALESCE(company_name, '')), slug_url) > ($${param}, $${param+1}, $${param+2})`);
    values.push(t, c, s); param += 3;
  }

  const sql = `
    SELECT slug_url as slug, title, occ_name, location, state, company_name, avg_annual_salary, country
    FROM occupations
    WHERE ${where.join(' AND ')}
    ORDER BY ${ORDER_BY_KEYSET}
    LIMIT $${param}
  `;
  values.push(limit + 1);

  const result = await poolInstance.query(sql, values);
  const rows = result.rows;
  const hasNext = rows.length > limit;
  const slice = hasNext ? rows.slice(0, limit) : rows;

  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;

  const items: OccupationListItem[] = slice.map(row => {
    const baseTitle = row.title || row.occ_name || '';
    const atCompany = row.company_name ? ` at ${row.company_name}` : '';
    const place = row.location || state || countryName;
    const inPlace = place ? ` in ${place}` : '';
    return {
      id: row.slug,
      title: baseTitle,
      displayName: `${baseTitle}${atCompany}${inPlace}`,
      slug_url: row.slug,
      location: row.location || undefined,
      state: row.state || undefined,
      avgAnnualSalary: row.avg_annual_salary || undefined,
      countrySlug: country,
      company_name: row.company_name || undefined,
    };
  });

  let nextCursor: string | undefined = undefined;
  if (hasNext && slice.length > 0) {
    const last = slice[slice.length - 1];
    nextCursor = encodeCursor([
      (last.title || last.occ_name || '').toLowerCase(),
      (last.company_name || '').toLowerCase(),
      last.slug,
    ]);
  }
  return { items, nextCursor };
});

export const getOccupationsForLocationCursor = cache(async ({
  country,
  state,
  location,
  q,
  letter,
  limit = 50,
  cursor,
}: {
  country: string;
  state: string;
  location: string;
  q?: string;
  letter?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ items: OccupationListItem[]; nextCursor?: string }> => {
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return { items: [], nextCursor: undefined };
  }
  const poolInstance = requirePool();
  const values: any[] = [country.toLowerCase(), state.toLowerCase(), location.toLowerCase()];
  let param = 4;
  const where: string[] = [
    `LOWER(country) = LOWER($1)`,
    `LOWER(state) = LOWER($2)`,
    `LOWER(location) = LOWER($3)`
  ];

  if (q && q.trim()) {
    const s = `%${q.trim().toLowerCase()}%`;
    where.push(`(LOWER(COALESCE(title,'')) LIKE $${param} OR LOWER(COALESCE(occ_name,'')) LIKE $${param} OR LOWER(COALESCE(company_name,'')) LIKE $${param})`);
    values.push(s); param++;
  }
  if (letter && letter.trim().length === 1) {
    where.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${param}`);
    values.push(letter.trim().toLowerCase()); param++;
  }

  const decoded = decodeCursor<[string, string, string]>(cursor);
  if (decoded) {
    const [t, c, s] = decoded;
    where.push(`(LOWER(COALESCE(title, occ_name, '')), LOWER(COALESCE(company_name, '')), slug_url) > ($${param}, $${param+1}, $${param+2})`);
    values.push(t, c, s); param += 3;
  }

  const sql = `
    SELECT slug_url as slug, title, occ_name, location, state, company_name, avg_annual_salary, country
    FROM occupations
    WHERE ${where.join(' AND ')}
    ORDER BY ${ORDER_BY_KEYSET}
    LIMIT $${param}
  `;
  values.push(limit + 1);

  const result = await poolInstance.query(sql, values);
  const rows = result.rows;
  const hasNext = rows.length > limit;
  const slice = hasNext ? rows.slice(0, limit) : rows;

  const countryData = await getCountryData(country);
  const countryName = countryData?.countryName || country;

  const items: OccupationListItem[] = slice.map(row => {
    const baseTitle = row.title || row.occ_name || '';
    const atCompany = row.company_name ? ` at ${row.company_name}` : '';
    const place = row.location || state || countryName;
    const inPlace = place ? ` in ${place}` : '';
    return {
      id: row.slug,
      title: baseTitle,
      displayName: `${baseTitle}${atCompany}${inPlace}`,
      slug_url: row.slug,
      location: row.location || undefined,
      state: row.state || undefined,
      avgAnnualSalary: row.avg_annual_salary || undefined,
      countrySlug: country,
      company_name: row.company_name || undefined,
    };
  });

  let nextCursor: string | undefined = undefined;
  if (hasNext && slice.length > 0) {
    const last = slice[slice.length - 1];
    nextCursor = encodeCursor([
      (last.title || last.occ_name || '').toLowerCase(),
      (last.company_name || '').toLowerCase(),
      last.slug,
    ]);
  }
  return { items, nextCursor };
});

// Short-lived cache for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions - Next.js 16 compatible
function getCached<T>(key: string): T | null {
  const cached = queryCache.get(key);
  if (cached) {
    return cached.data; // Return cached value (Next.js 16 handles cache invalidation)
  }
  return null;
}

function setCached<T>(key: string, data: T): void {
  queryCache.set(key, { data, timestamp: 0 }); // Simplified for Next.js 16
}

// Structured logging with levels
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

const LOG_LEVEL = process.env.LOG_LEVEL ? 
  parseInt(process.env.LOG_LEVEL) : 
  (process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG);

function log(level: LogLevel, message: string, ...args: any[]) {
  if (level <= LOG_LEVEL) {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    console[level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log'](
      `[${timestamp}] [${levelName}] [DB] ${message}`,
      ...args
    );
  }
}

const logger = {
  error: (message: string, ...args: any[]) => log(LogLevel.ERROR, message, ...args),
  warn: (message: string, ...args: any[]) => log(LogLevel.WARN, message, ...args),
  info: (message: string, ...args: any[]) => log(LogLevel.INFO, message, ...args),
  debug: (message: string, ...args: any[]) => log(LogLevel.DEBUG, message, ...args)
};

// Field validation for SQL injection prevention
const ALLOWED_OCCUPATION_FIELDS = new Set([
  'title', 'occ_name', 'country', 'state', 'location', 'currency_code',
  'avg_annual_salary', 'low_salary', 'high_salary', 'avg_hourly_salary', 'hourly_low_value', 'hourly_high_value',
  'weekly_salary', 'fortnightly_salary', 'monthly_salary', 'total_pay_min', 'total_pay_max',
  'total_hourly_low_value', 'total_hourly_high_value', 'bonus_range_min', 'bonus_range_max',
  'profit_sharing_min', 'profit_sharing_max', 'commission_min', 'commission_max',
  'gender_male', 'gender_female', 'entry_level', 'early_career', 'mid_career', 'experienced', 'late_career',
  'one_yr', 'one_four_yrs', 'five_nine_yrs', 'ten_nineteen_yrs', 'twenty_yrs_plus',
  'percentile_10', 'percentile_25', 'percentile_50', 'percentile_75', 'percentile_90', 'skills'
]);

// Numeric field validation with type and range checks
const NUMERIC_FIELDS = new Set([
  'avg_annual_salary', 'low_salary', 'high_salary', 'avg_hourly_salary', 'hourly_low_value', 'hourly_high_value',
  'weekly_salary', 'fortnightly_salary', 'monthly_salary', 'total_pay_min', 'total_pay_max',
  'total_hourly_low_value', 'total_hourly_high_value', 'bonus_range_min', 'bonus_range_max',
  'profit_sharing_min', 'profit_sharing_max', 'commission_min', 'commission_max',
  'gender_male', 'gender_female', 'entry_level', 'early_career', 'mid_career', 'experienced', 'late_career',
  'one_yr', 'one_four_yrs', 'five_nine_yrs', 'ten_nineteen_yrs', 'twenty_yrs_plus',
  'percentile_10', 'percentile_25', 'percentile_50', 'percentile_75', 'percentile_90'
]);

const SALARY_RANGES = {
  // Annual salaries: $0 - $100M (reasonable upper bound)
  'avg_annual_salary': { min: 0, max: 100000000 },
  'low_salary': { min: 0, max: 100000000 },
  'high_salary': { min: 0, max: 100000000 },
  'entry_level': { min: 0, max: 100000000 },
  'early_career': { min: 0, max: 100000000 },
  'mid_career': { min: 0, max: 100000000 },
  'experienced': { min: 0, max: 100000000 },
  'late_career': { min: 0, max: 100000000 },
  'one_yr': { min: 0, max: 100000000 },
  'one_four_yrs': { min: 0, max: 100000000 },
  'five_nine_yrs': { min: 0, max: 100000000 },
  'ten_nineteen_yrs': { min: 0, max: 100000000 },
  'twenty_yrs_plus': { min: 0, max: 100000000 },
  'percentile_10': { min: 0, max: 100000000 },
  'percentile_25': { min: 0, max: 100000000 },
  'percentile_50': { min: 0, max: 100000000 },
  'percentile_75': { min: 0, max: 100000000 },
  'percentile_90': { min: 0, max: 100000000 },
  
  // Hourly rates: $0 - $10,000/hour
  'avg_hourly_salary': { min: 0, max: 10000 },
  'hourly_low_value': { min: 0, max: 10000 },
  'hourly_high_value': { min: 0, max: 10000 },
  'total_hourly_low_value': { min: 0, max: 10000 },
  'total_hourly_high_value': { min: 0, max: 10000 },
  
  // Gender percentages: 0-100
  'gender_male': { min: 0, max: 100 },
  'gender_female': { min: 0, max: 100 },
  
  // Other salary fields: $0 - $100M
  'weekly_salary': { min: 0, max: 100000000 },
  'fortnightly_salary': { min: 0, max: 100000000 },
  'monthly_salary': { min: 0, max: 100000000 },
  'total_pay_min': { min: 0, max: 100000000 },
  'total_pay_max': { min: 0, max: 100000000 },
  'bonus_range_min': { min: 0, max: 100000000 },
  'bonus_range_max': { min: 0, max: 100000000 },
  'profit_sharing_min': { min: 0, max: 100000000 },
  'profit_sharing_max': { min: 0, max: 100000000 },
  'commission_min': { min: 0, max: 100000000 },
  'commission_max': { min: 0, max: 100000000 }
};

function validateFields(fields: string[]): string[] {
  const validFields = fields.filter(field => ALLOWED_OCCUPATION_FIELDS.has(field));
  if (validFields.length !== fields.length) {
    const invalidFields = fields.filter(field => !ALLOWED_OCCUPATION_FIELDS.has(field));
    throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
  }
  return validFields;
}

function validateNumericValue(field: string, value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(numValue)) {
    throw new Error(`Invalid numeric value for field '${field}': ${value}`);
  }
  
  if (NUMERIC_FIELDS.has(field)) {
    const range = SALARY_RANGES[field as keyof typeof SALARY_RANGES];
    if (range) {
      if (numValue < range.min || numValue > range.max) {
        throw new Error(`Value for field '${field}' (${numValue}) is outside valid range [${range.min}, ${range.max}]`);
      }
    }
  }
  
  return numValue;
}

function validateSalaryData(salaryData: Record<string, any>): Record<string, any> {
  const validated: Record<string, any> = {};
  
  for (const [field, value] of Object.entries(salaryData)) {
    if (NUMERIC_FIELDS.has(field)) {
      validated[field] = validateNumericValue(field, value);
    } else {
      validated[field] = value;
    }
  }
  
  return validated;
}

// Clean up old cache entries periodically - Next.js 16 compatible
setInterval(() => {
  let cleaned = 0;
  for (const [key, value] of queryCache.entries()) {
    // Simplified cleanup - remove entries with timestamp 0 (Next.js 16 compatible)
    if (value.timestamp === 0) {
      queryCache.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    logger.debug(`Cleaned up ${cleaned} expired cache entries`);
  }
}, CACHE_DURATION);

// Helper wrapper to ensure pool is initialized
function requirePool() {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
}

// Get all countries (lightweight operation) - Next.js 16 cached
export const getAllCountries = cache(async (): Promise<string[]> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return [];
  }

  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query('SELECT DISTINCT country FROM occupations ORDER BY country');
    const countries = result.rows.map(row => row.country);
    return countries;
  } catch (error) {
    logger.error('Error fetching countries:', error);
    throw error;
  }
});

// Get homepage statistics (lightweight operation with caching) - Next.js 16 cached
export const getHomepageStats = cache(async (): Promise<{
  totalRecords: number;
  uniqueCountries: number;
}> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return {
      totalRecords: 300000,
      uniqueCountries: 100,
    };
  }
  const poolInstance = requirePool();
  const cacheKey = 'homepage:stats';
    const cached = getCached<{totalRecords: number; uniqueCountries: number;}>(cacheKey);
    if (cached) {
      return cached;
    }

  try {
    const result = await poolInstance.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT country) as unique_countries
      FROM occupations
    `);
    
    const row = result.rows[0];
    const stats = {
      totalRecords: parseInt(row.total_records),
      uniqueCountries: parseInt(row.unique_countries),
    };
    
    setCached(cacheKey, stats);
    return stats;
  } catch (error) {
    logger.error('Error fetching homepage stats:', error);
    return { totalRecords: 302000, uniqueCountries: 102 }; // fallback
  }
});

export interface OccupationSearchResult {
  title: string;
  occ_name: string;
  slug: string;
  state: string | null;
  location: string | null;
  avg_salary: number | null;
  currency_code: string | null;
}

export const searchOccupationsServer = cache(async (
  country: string,
  query: string,
  limit: number = 50
): Promise<OccupationSearchResult[]> => {
  const pool = requirePool();

  // Use LIKE for partial matching to support "acc" -> "accountant"
  const result = await pool.query(
    `
    SELECT 
      title,
      occ_name,
      slug_url AS slug,
      state,
      location,
      avg_annual_salary AS avg_salary,
      currency_code,
      company_name
    FROM occupations
    WHERE LOWER(country) = LOWER($1)
      AND LOWER(occ_name) LIKE LOWER($2)
    ORDER BY 
      CASE 
        WHEN LOWER(occ_name) LIKE LOWER($3) THEN 1
        WHEN LOWER(occ_name) LIKE LOWER($4) THEN 2
        ELSE 3
      END,
      occ_name
    LIMIT $5
    `,
    [country, `%${query}%`, `${query}%`, `%${query}%`, limit]
  );

  return result.rows;
});

// Get occupations for search (lightweight - only essential fields, no ORDER BY for performance) - Next.js 16 cached
export const getAllOccupationsForSearch = cache(async (country?: string, limit: number = 1000): Promise<Array<{
  country: string;
  title: string;
  slug: string;
  state: string | null;
  location: string | null;
  company_name: string | null;
}>> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return [];
  }

  const scoped = (country || '').toLowerCase();
  const cacheKey = scoped ? `occupations:search:${scoped}:${limit}` : `occupations:search:empty:${limit}`;
  const cached = getCached<Array<{
    country: string;
    title: string;
    slug: string;
    state: string | null;
    location: string | null;
    company_name: string | null;
  }>>(cacheKey);
  if (cached) {
    logger.debug('Cache hit for occupations search');
    return cached;
  }

  const poolInstance = requirePool();

  try {
    if (!country) return [];

    const result = await poolInstance.query(`
      SELECT 
        LOWER(country) as country,
        title,
        slug_url as slug,
        state,
        location,
        company_name
      FROM occupations
      WHERE LOWER(country) = LOWER($1)
      ORDER BY title
      LIMIT $2
    `, [country, limit]);
    
    setCached(cacheKey, result.rows);
    logger.debug(`Fetched ${result.rows.length} occupations for search (country-scoped)`);
    return result.rows;
  } catch (error) {
    console.error('Error fetching occupations for search:', error);
    throw error;
  }
});

// Get all occupations (for dataset) - DEPRECATED: Use specific queries instead
export async function getDataset(): Promise<OccupationRecord[]> {
  const poolInstance = requirePool();

  try {
    console.log('🔍 Executing optimized query to fetch all occupations...');
    const result = await poolInstance.query('SELECT * FROM occupations');
    console.log(`✅ Successfully fetched ${result.rows.length} records from PostgreSQL`);

    return result.rows.map(transformDbRowToOccupationRecord);
  } catch (error) {
    console.error('Error fetching dataset:', error);
    throw error;
  }
}

// Find Occupation Salary Record by path - Next.js 16 cached
export const findOccupationSalaryByPath = cache(async (params: {
  country: string;
  state?: string;
  location?: string;
  slug: string;
}): Promise<OccupationRecord | null> => {
  const poolInstance = requirePool();
  const { country, state, location, slug } = params;
  const dbCountryName = country.replace(/-/g, ' ');
  const values = [dbCountryName.toLowerCase()];
  let query = `
    SELECT *
    FROM occupations
    WHERE LOWER(country) = $1
  `;
  let paramIndex = 2;

  if (state) {
    query += ` AND LOWER(state) = $${paramIndex}`;
    values.push(state.toLowerCase());
    paramIndex++;
  }

  if (location) {
    query += ` AND LOWER(location) = $${paramIndex}`;
    values.push(location.toLowerCase());
    paramIndex++;
  }

  // slug is mandatory
  query += ` AND slug_url = $${paramIndex}`;
  values.push(slug);

  const result = await poolInstance.query(query, values);
  return result.rows.length > 0 ? transformDbRowToOccupationRecord(result.rows[0]) : null;
});

// Get country data with statistics - Next.js 16 cached
export const getCountryData = cache(async (country: string): Promise<{
  countryName: string;
  totalJobs: number;
  avgSalary: number;
  states: string[];
  occupationItems: OccupationListItem[];
  headerOccupations: any[];
} | null> => {
  // Skip DB queries during build for Next.js 16 compatibility
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return {
      countryName: country.charAt(0).toUpperCase() + country.slice(1),
      totalJobs: 1000,
      avgSalary: 50000,
      states: [],
      occupationItems: [],
      headerOccupations: []
    };
  }

  const poolInstance = requirePool();
  // Convert slug to DB country format
  const dbCountryName = country.replace(/-/g, ' '); // brunei-darussalam -> brunei darussalam
  
  try {
    // Lightweight: only aggregate stats and distinct states
    const [countryResult, statesResult] = await Promise.all([
      poolInstance.query(`
        SELECT 
          country,
          COUNT(*) as job_count,
          AVG(avg_annual_salary) as avg_salary
        FROM occupations 
        WHERE LOWER(country) = LOWER($1)
        GROUP BY country
      `, [dbCountryName]),
      poolInstance.query(`
        SELECT DISTINCT state 
        FROM occupations 
        WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL
        ORDER BY state
      `, [dbCountryName])
    ]);

    if (countryResult.rows.length === 0) {
      return null;
    }

    const countryData = countryResult.rows[0];
    const states = statesResult.rows.map(row => row.state);

    //const countryName = country.charAt(0).toUpperCase() + country.slice(1);
    const countryName = countryResult.rows[0].country;
    const totalJobs = parseInt(countryData.job_count);
    const avgSalary = parseFloat(countryData.avg_salary) || 0;

    // Keep list fields empty; paginated helpers fetch items as needed
    const occupationItems: OccupationListItem[] = [];
    const headerOccupations: any[] = [];

    return {
      countryName,
      totalJobs,
      avgSalary,
      states,
      occupationItems,
      headerOccupations
    };
  } catch (error) {
    console.error('Error getting country data:', error);
    throw error;
  }
});

// Get state data - Next.js 16 cached
export const getStateData = cache(async (country: string, state: string): Promise<{
  name: string;
  jobs: Array<{
    slug: string;
    title: string | null;
    occ_name: string | null;
    location: string | null;
    avgAnnualSalary: number | null;
    avgHourlySalary: number | null;
    company_name: string | null;
  }>;
} | null> => {
  const poolInstance = requirePool();

  const cacheKey = `state:${country}:${state}`;
  const cached = getCached<{
    name: string;
    jobs: Array<{
      slug: string;
      title: string | null;
      occ_name: string | null;
      location: string | null;
      avgAnnualSalary: number | null;
      avgHourlySalary: number | null;
      company_name: string | null;
    }>;
  } | null>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const result = await poolInstance.query(`
      SELECT 
        slug_url,
        title,
        occ_name,
        avg_annual_salary,
        avg_hourly_salary,
        state,
        location,
        company_name
      FROM occupations 
      WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2)
      ORDER BY title
    `, [country, state]);

    if (result.rows.length === 0) return null;

    const stateData = {
      name: result.rows[0].state ?? state,
      jobs: result.rows.map(row => ({
        slug: row.slug_url,
        title: row.title,
        occ_name: row.occ_name,
        location: row.location,
        avgAnnualSalary: row.avg_annual_salary,
        avgHourlySalary: row.avg_hourly_salary,
        company_name: row.company_name
      }))
    };
    
    setCached(cacheKey, stateData);
    return stateData;
  } catch (error) {
    console.error('Error getting state data:', error);
    throw error;
  }
});

// Get location data - Next.js 16 cached
export const getLocationData = cache(async (country: string, state: string, location: string): Promise<{
  name: string;
  jobs: Array<{
    slug: string;
    title: string | null;
    occ_name: string | null;
    location: string | null;
    avgAnnualSalary: number | null;
    avgHourlySalary: number | null;
    company_name: string | null;
  }>;
} | null> => {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(`
      SELECT 
        slug_url,
        title,
        occ_name,
        avg_annual_salary,
        avg_hourly_salary,
        location,
        state,
        company_name
      FROM occupations 
      WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND LOWER(location) = LOWER($3)
      ORDER BY title
    `, [country, state, location]);

    if (result.rows.length === 0) return null;

    return {
      name: result.rows[0].location ?? location,
      jobs: result.rows.map(row => ({
        slug: row.slug_url,
        title: row.title,
        occ_name: row.occ_name,
        location: row.location,
        state: row.state,
        avgAnnualSalary: row.avg_annual_salary,
        avgHourlySalary: row.avg_hourly_salary,
        company_name: row.company_name
      }))
    };
  } catch (error) {
    console.error('Error getting location data:', error);
    throw error;
  }
});

// Get all states for a country (with caching) - Next.js 16 cached
export const getAllStates = cache(async (country: string): Promise<string[]> => {
  const poolInstance = requirePool();

  const cacheKey = `states:${country}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const result = await poolInstance.query(`
      SELECT DISTINCT state 
      FROM occupations 
      WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL
      ORDER BY state
    `, [country]);

    const states = result.rows.map(row => row.state);
    setCached(cacheKey, states);
    return states;
  } catch (error) {
    console.error('Error getting all states:', error);
    throw error;
  }
});

// Get all locations for a state (with caching) - Next.js 16 cached
export const getAllLocations = cache(async (country: string, state: string): Promise<string[]> => {
  const poolInstance = requirePool();

  const cacheKey = `locations:${country}:${state}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const result = await poolInstance.query(`
      SELECT DISTINCT location 
      FROM occupations 
      WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND location IS NOT NULL AND TRIM(location) <> ''
      ORDER BY location
    `, [country, state]);

    const locations = result.rows.map(row => row.location);
    setCached(cacheKey, locations);
    return locations;
  } catch (error) {
    console.error('Error getting all locations:', error);
    throw error;
  }
});

// Get states with pagination (for large datasets)
export async function getStatesPaginated(country: string, limit: number = 100, offset: number = 0): Promise<string[]> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(`
      SELECT DISTINCT state 
      FROM occupations 
      WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL
      ORDER BY state
      LIMIT $2 OFFSET $3
    `, [country, limit, offset]);

    return result.rows.map(row => row.state);
  } catch (error) {
    logger.error('Error getting paginated states:', error);
    throw error;
  }
}

// Cursor-based pagination for very large datasets (better performance than offset)
export async function getStatesCursorPaginated(
  country: string, 
  limit: number = 100, 
  cursor?: string
): Promise<{ states: string[]; nextCursor?: string }> {
  const poolInstance = requirePool();

  try {
    const whereClause = cursor ? 
      `WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL AND state > $2` :
      `WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL`;
    
    const params = cursor ? [country, cursor] : [country];
    
    const result = await poolInstance.query(`
      SELECT DISTINCT state 
      FROM occupations 
      ${whereClause}
      ORDER BY state
      LIMIT $${cursor ? '3' : '2'}
    `, [...params, limit + 1]); // Get one extra to check if there's a next page

    const states = result.rows.slice(0, limit).map(row => row.state);
    const nextCursor = result.rows.length > limit ? states[states.length - 1] : undefined;

    return { states, nextCursor };
  } catch (error) {
    logger.error('Error getting cursor-paginated states:', error);
    throw error;
  }
}

// Get locations with pagination (for large datasets)
export async function getLocationsPaginated(country: string, state: string, limit: number = 100, offset: number = 0): Promise<string[]> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(`
      SELECT DISTINCT location 
      FROM occupations 
      WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND location IS NOT NULL
      ORDER BY location
      LIMIT $3 OFFSET $4
    `, [country, state, limit, offset]);

    return result.rows.map(row => row.location);
  } catch (error) {
    logger.error('Error getting paginated locations:', error);
    throw error;
  }
}

// Cursor-based pagination for locations (better performance than offset)
export async function getLocationsCursorPaginated(
  country: string, 
  state: string,
  limit: number = 100, 
  cursor?: string
): Promise<{ locations: string[]; nextCursor?: string }> {
  const poolInstance = requirePool();

  try {
    const whereClause = cursor ? 
      `WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND location IS NOT NULL AND location > $3` :
      `WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND location IS NOT NULL`;
    
    const params = cursor ? [country, state, cursor] : [country, state];
    
    const result = await poolInstance.query(`
      SELECT DISTINCT location 
      FROM occupations 
      ${whereClause}
      ORDER BY location
      LIMIT $${cursor ? '4' : '3'}
    `, [...params, limit + 1]); // Get one extra to check if there's a next page

    const locations = result.rows.slice(0, limit).map(row => row.location);
    const nextCursor = result.rows.length > limit ? locations[locations.length - 1] : undefined;

    return { locations, nextCursor };
  } catch (error) {
    logger.error('Error getting cursor-paginated locations:', error);
    throw error;
  }
}

// Get state count for a country (for pagination)
export async function getStateCount(country: string): Promise<number> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query('SELECT COUNT(DISTINCT state) as count FROM occupations WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL', [country]);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error fetching state count:', error);
    throw error;
  }
}

// Get location count for a country and state (for pagination)
export async function getLocationCount(country: string, state: string): Promise<number> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query('SELECT COUNT(DISTINCT location) as count FROM occupations WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND location IS NOT NULL', [country, state]);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error fetching location count:', error);
    throw error;
  }
}

// Get occupations for state with pagination, search, and A–Z filter - Next.js 16 cached
export const getOccupationsForState = cache(async ({
  country,
  state,
  q,
  letter,
  limit = 50,
  offset = 0,
}: {
  country: string;
  state: string;
  q?: string;
  letter?: string;
  limit?: number;
  offset?: number;
}): Promise<OccupationListItem[]> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return [];
  }

  const poolInstance = requirePool();

  try {
    const dbCountryName = country.replace(/-/g, ' ');
    const values: any[] = [dbCountryName.toLowerCase(), state.toLowerCase()];
    let paramIndex = 3;

    let whereClauses = ['LOWER(country) = LOWER($1)', 'LOWER(state) = LOWER($2)'];

    // Add search query filter
    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(title, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(occ_name, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(company_name, '')) LIKE $${paramIndex}
      )`);
      values.push(searchTerm);
      paramIndex++;
    }

    // Add letter filter (A–Z)
    if (letter && letter.trim().length === 1) {
      const letterLower = letter.trim().toLowerCase();
      whereClauses.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${paramIndex}`);
      values.push(letterLower);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');

    // Build query with deterministic sorting
    const query = `
      SELECT 
        slug_url as slug,
        title,
        occ_name,
        location,
        state,
        company_name,
        avg_annual_salary
      FROM occupations 
      WHERE ${whereClause}
      ORDER BY 
        LOWER(COALESCE(title, occ_name, '')),
        LOWER(COALESCE(company_name, '')),
        LOWER(COALESCE(location, state, country))
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const result = await poolInstance.query(query, values);

    // Map to OccupationListItem format
    const countryData = await getCountryData(country);
    const countryName = countryData?.countryName || country;

    return result.rows.map((row) => {
      const baseTitle = row.title || row.occ_name || '';
      const atCompany = row.company_name ? ` at ${row.company_name}` : '';
      const place = row.location || state || countryName;
      const inPlace = place ? ` in ${place}` : '';

      return {
        id: row.slug,
        title: baseTitle,
        displayName: `${baseTitle}${atCompany}${inPlace}`,
        slug_url: row.slug,
        location: row.location || undefined,
        state: row.state || undefined,
        avgAnnualSalary: row.avg_annual_salary || undefined,
        countrySlug: country,
        company_name: row.company_name || undefined,
      };
    });
  } catch (error) {
    logger.error('Error getting occupations for state:', error);
    throw error;
  }
});

// Get count of occupations for state with search and A–Z filter - Next.js 16 cached
export const getOccupationsForStateCount = cache(async ({
  country,
  state,
  q,
  letter,
}: {
  country: string;
  state: string;
  q?: string;
  letter?: string;
}): Promise<number> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return 0;
  }

  const poolInstance = requirePool();

  try {
    const dbCountryName = country.replace(/-/g, ' ');
    const values: any[] = [dbCountryName.toLowerCase(), state.toLowerCase()];
    let paramIndex = 3;

    let whereClauses = ['LOWER(country) = LOWER($1)', 'LOWER(state) = LOWER($2)'];

    // Add search query filter
    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(title, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(occ_name, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(company_name, '')) LIKE $${paramIndex}
      )`);
      values.push(searchTerm);
      paramIndex++;
    }

    // Add letter filter (A–Z)
    if (letter && letter.trim().length === 1) {
      const letterLower = letter.trim().toLowerCase();
      whereClauses.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${paramIndex}`);
      values.push(letterLower);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');

    const query = `
      SELECT COUNT(*) as count
      FROM occupations 
      WHERE ${whereClause}
    `;

    const result = await poolInstance.query(query, values);
    return parseInt(result.rows[0].count) || 0;
  } catch (error) {
    logger.error('Error getting occupations count for state:', error);
    throw error;
  }
});

// Get occupations for location with pagination, search, and A–Z filter - Next.js 16 cached
export const getOccupationsForLocation = cache(async ({
  country,
  state,
  location,
  q,
  letter,
  limit = 50,
  offset = 0,
}: {
  country: string;
  state: string;
  location: string;
  q?: string;
  letter?: string;
  limit?: number;
  offset?: number;
}): Promise<OccupationListItem[]> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return [];
  }

  const poolInstance = requirePool();

  try {
    const dbCountryName = country.replace(/-/g, ' ');
    const values: any[] = [dbCountryName.toLowerCase(), state.toLowerCase(), location.toLowerCase()];
    let paramIndex = 4;

    let whereClauses = [
      'LOWER(country) = LOWER($1)',
      'LOWER(state) = LOWER($2)',
      'LOWER(location) = LOWER($3)',
    ];

    // Add search query filter
    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(title, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(occ_name, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(company_name, '')) LIKE $${paramIndex}
      )`);
      values.push(searchTerm);
      paramIndex++;
    }

    // Add letter filter (A–Z)
    if (letter && letter.trim().length === 1) {
      const letterLower = letter.trim().toLowerCase();
      whereClauses.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${paramIndex}`);
      values.push(letterLower);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');

    // Build query with deterministic sorting
    const query = `
      SELECT 
        slug_url as slug,
        title,
        occ_name,
        location,
        state,
        company_name,
        avg_annual_salary
      FROM occupations 
      WHERE ${whereClause}
      ORDER BY 
        LOWER(COALESCE(title, occ_name, '')),
        LOWER(COALESCE(company_name, '')),
        LOWER(COALESCE(location, state, country))
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const result = await poolInstance.query(query, values);

    // Map to OccupationListItem format
    const countryData = await getCountryData(country);
    const countryName = countryData?.countryName || country;

    return result.rows.map((row) => {
      const baseTitle = row.title || row.occ_name || '';
      const atCompany = row.company_name ? ` at ${row.company_name}` : '';
      const place = row.location || location || state || countryName;
      const inPlace = place ? ` in ${place}` : '';

      return {
        id: row.slug,
        title: baseTitle,
        displayName: `${baseTitle}${atCompany}${inPlace}`,
        slug_url: row.slug,
        location: row.location || undefined,
        state: row.state || undefined,
        avgAnnualSalary: row.avg_annual_salary || undefined,
        countrySlug: country,
        company_name: row.company_name || undefined,
      };
    });
  } catch (error) {
    logger.error('Error getting occupations for location:', error);
    throw error;
  }
});

// Get count of occupations for location with search and A–Z filter - Next.js 16 cached
export const getOccupationsForLocationCount = cache(async ({
  country,
  state,
  location,
  q,
  letter,
}: {
  country: string;
  state: string;
  location: string;
  q?: string;
  letter?: string;
}): Promise<number> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return 0;
  }

  const poolInstance = requirePool();

  try {
    const dbCountryName = country.replace(/-/g, ' ');
    const values: any[] = [dbCountryName.toLowerCase(), state.toLowerCase(), location.toLowerCase()];
    let paramIndex = 4;

    let whereClauses = [
      'LOWER(country) = LOWER($1)',
      'LOWER(state) = LOWER($2)',
      'LOWER(location) = LOWER($3)',
    ];

    // Add search query filter
    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(title, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(occ_name, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(company_name, '')) LIKE $${paramIndex}
      )`);
      values.push(searchTerm);
      paramIndex++;
    }

    // Add letter filter (A–Z)
    if (letter && letter.trim().length === 1) {
      const letterLower = letter.trim().toLowerCase();
      whereClauses.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${paramIndex}`);
      values.push(letterLower);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');

    const query = `
      SELECT COUNT(*) as count
      FROM occupations 
      WHERE ${whereClause}
    `;

    const result = await poolInstance.query(query, values);
    return parseInt(result.rows[0].count) || 0;
  } catch (error) {
    logger.error('Error getting occupations count for location:', error);
    throw error;
  }
});

// Get occupations for country with pagination, search, and A–Z filter - Next.js 16 cached
export const getOccupationsForCountry = cache(async ({
  country,
  q,
  letter,
  limit = 50,
  offset = 0,
}: {
  country: string;
  q?: string;
  letter?: string;
  limit?: number;
  offset?: number;
}): Promise<OccupationListItem[]> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return [];
  }

  const poolInstance = requirePool();

  try {
    const dbCountryName = country.replace(/-/g, ' ');
    const values: any[] = [dbCountryName.toLowerCase()];
    let paramIndex = 2;

    let whereClauses = ['LOWER(country) = LOWER($1)'];

    // Add search query filter
    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(title, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(occ_name, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(company_name, '')) LIKE $${paramIndex}
      )`);
      values.push(searchTerm);
      paramIndex++;
    }

    // Add letter filter (A–Z)
    if (letter && letter.trim().length === 1) {
      const letterLower = letter.trim().toLowerCase();
      whereClauses.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${paramIndex}`);
      values.push(letterLower);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');

    // Build query with deterministic sorting
    const query = `
      SELECT 
        slug_url as slug,
        title,
        occ_name,
        location,
        state,
        company_name,
        avg_annual_salary,
        country
      FROM occupations 
      WHERE ${whereClause}
      ORDER BY 
        LOWER(COALESCE(title, occ_name, '')),
        LOWER(COALESCE(company_name, '')),
        LOWER(COALESCE(location, state, country))
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const result = await poolInstance.query(query, values);

    // Get country name from database
    const countryData = await getCountryData(country);
    const countryName = countryData?.countryName || country;

    return result.rows.map((row) => {
      const baseTitle = row.title || row.occ_name || '';
      const atCompany = row.company_name ? ` at ${row.company_name}` : '';
      const place = row.location || row.state || countryName;
      const inPlace = place ? ` in ${place}` : '';

      return {
        id: row.slug,
        title: baseTitle,
        displayName: `${baseTitle}${atCompany}${inPlace}`,
        slug_url: row.slug,
        location: row.location || undefined,
        state: row.state || undefined,
        avgAnnualSalary: row.avg_annual_salary || undefined,
        countrySlug: slugify(row.country || country),
        company_name: row.company_name || undefined,
      };
    });
  } catch (error) {
    logger.error('Error getting occupations for country:', error);
    throw error;
  }
});

// Get count of occupations for country with search and A–Z filter - Next.js 16 cached
export const getOccupationsForCountryCount = cache(async ({
  country,
  q,
  letter,
}: {
  country: string;
  q?: string;
  letter?: string;
}): Promise<number> => {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return 0;
  }

  const poolInstance = requirePool();

  try {
    const dbCountryName = country.replace(/-/g, ' ');
    const values: any[] = [dbCountryName.toLowerCase()];
    let paramIndex = 2;

    let whereClauses = ['LOWER(country) = LOWER($1)'];

    // Add search query filter
    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      whereClauses.push(`(
        LOWER(COALESCE(title, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(occ_name, '')) LIKE $${paramIndex} OR 
        LOWER(COALESCE(company_name, '')) LIKE $${paramIndex}
      )`);
      values.push(searchTerm);
      paramIndex++;
    }

    // Add letter filter (A–Z)
    if (letter && letter.trim().length === 1) {
      const letterLower = letter.trim().toLowerCase();
      whereClauses.push(`LEFT(LOWER(COALESCE(title, occ_name, '')), 1) = $${paramIndex}`);
      values.push(letterLower);
      paramIndex++;
    }

    const whereClause = whereClauses.join(' AND ');

    const query = `
      SELECT COUNT(*) as count
      FROM occupations 
      WHERE ${whereClause}
    `;

    const result = await poolInstance.query(query, values);
    return parseInt(result.rows[0].count) || 0;
  } catch (error) {
    logger.error('Error getting occupations count for country:', error);
    throw error;
  }
});

// Search occupations
// export async function searchOccupations(query: string, country?: string, limit: number = 10): Promise<OccupationRecord[]> {
//   const poolInstance = requirePool();
//   const hasQuery = query && query.trim().length > 0;//Added

//   try {
//     const result = await poolInstance.query(`
//       SELECT * FROM occupations 
//       WHERE to_tsvector('english', COALESCE(occ_name, '')) @@ plainto_tsquery('english', $1)
//       AND ($2::text IS NULL OR LOWER(country) = LOWER($2::text))
//       ORDER BY ts_rank(
//         to_tsvector('english', COALESCE(occ_name, '')),
//         plainto_tsquery('english', $1)
//       ) DESC
//       LIMIT $3
//     `, [query, country || null, limit]);

//     return result.rows.map(transformDbRowToOccupationRecord);
//   } catch (error) {
//     console.error('Error searching occupations:', error);
//     throw error;
//   }
// }
export const searchOccupations = cache(async (query: string, country?: string, limit: number = 10): Promise<OccupationRecord[]> => {
  const poolInstance = requirePool();
  const hasQuery = query && query.trim().length > 0;

  try {
    const sql = hasQuery
      ? `
          SELECT * FROM occupations
          WHERE to_tsvector('english', COALESCE(occ_name, '')) @@ plainto_tsquery('english', $1)
            AND ($2::text IS NULL OR LOWER(country) = LOWER($2::text))
          ORDER BY ts_rank(
            to_tsvector('english', COALESCE(occ_name, '')),
            plainto_tsquery('english', $1)
          ) DESC
          LIMIT $3
        `
      : `
          SELECT * FROM occupations
          WHERE ($1::text IS NULL OR LOWER(country) = LOWER($1::text))
          LIMIT $2
        `;

    const params = hasQuery ? [query, country || null, limit] : [country || null, limit];

    const result = await poolInstance.query(sql, params);
    return result.rows.map(transformDbRowToOccupationRecord);
  } catch (error) {
    console.error('Error searching occupations:', error);
    throw error;
  }
});

// Update occupation salary (for user contributions)
export async function updateOccupationSalary(
  id: number,
  salaryData: SalaryUpdateData
): Promise<OccupationRecord | null> {
  const poolInstance = requirePool();

  try {
    const fields = Object.keys(salaryData);
    
    if (fields.length === 0) {
      throw new Error('No salary fields provided for update');
    }
    
    // Validate fields to prevent SQL injection
    const validFields = validateFields(fields);
    
    // Validate and transform numeric values
    const validatedData = validateSalaryData(salaryData);
    const values = validFields.map(field => validatedData[field]);
    
    const setClause = validFields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    
    const result = await poolInstance.query(
      `UPDATE occupations 
       SET ${setClause}, data_source = 'user_contribution', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, ...values]
    );
    
    logger.info(`Updated occupation ${id} with fields: ${validFields.join(', ')}`);
    if (result.rows.length === 0) return null;
    
    return transformDbRowToOccupationRecord(result.rows[0]);
  } catch (error) {
    logger.error('Error updating occupation salary:', error);
    throw error;
  }
}

// Insert new occupation
export async function insertOccupation(data: Partial<OccupationRecord>): Promise<OccupationRecord> {
  const poolInstance = requirePool();

  try {
    const dbData = transformOccupationRecordToDb(data);
    const fields = Object.keys(dbData);
    const values = Object.values(dbData);
    
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const fieldNames = fields.join(', ');
    
    const result = await poolInstance.query(
      `INSERT INTO occupations (${fieldNames}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    );
    
    return transformDbRowToOccupationRecord(result.rows[0]);
  } catch (error) {
    console.error('Error inserting occupation:', error);
    throw error;
  }
}

// Update entire occupation
export async function updateOccupation(id: number, data: Partial<OccupationRecord>): Promise<OccupationRecord | null> {
  const poolInstance = requirePool();

  try {
    const dbData = transformOccupationRecordToDb(data);
    const fields = Object.keys(dbData);
    const values = Object.values(dbData);
    
    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }
    
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    
    const result = await poolInstance.query(
      `UPDATE occupations 
       SET ${setClause}
       WHERE id = $1
       RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) return null;
    
    return transformDbRowToOccupationRecord(result.rows[0]);
  } catch (error) {
    console.error('Error updating occupation:', error);
    throw error;
  }
}

// Delete occupation
export async function deleteOccupation(id: number): Promise<boolean> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(
      'DELETE FROM occupations WHERE id = $1',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount !== undefined && result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting occupation:', error);
    throw error;
  }
}

// Bulk insert occupations (for migration)
export async function bulkInsertOccupations(records: Partial<OccupationRecord>[]): Promise<number> {
  if (records.length === 0) return 0;
  
  const poolInstance = requirePool();
  
  try {
    const client = await poolInstance.connect();
    
    try {
      await client.query('BEGIN');
      
      let insertedCount = 0;
      const BATCH_SIZE = 1000;
      
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        
        for (const record of batch) {
          const dbData = transformOccupationRecordToDb(record);
          const fields = Object.keys(dbData);
          const values = Object.values(dbData);
          
          const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
          const fieldNames = fields.join(', ');
          
          await client.query(
            `INSERT INTO occupations (${fieldNames}) 
             VALUES (${placeholders})
             ON CONFLICT (country, state, location, slug_url)
             DO UPDATE SET
               title = EXCLUDED.title,
               avg_annual_salary = EXCLUDED.avg_annual_salary,
               updated_at = NOW()`,
            values
          );
          
          insertedCount++;
        }
      }
      
      await client.query('COMMIT');
      return insertedCount;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error bulk inserting occupations:', error);
    throw error;
  }
}

// Get occupation by ID
export async function getOccupationById(id: number): Promise<OccupationRecord | null> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(
      'SELECT * FROM occupations WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return null;
    
    return transformDbRowToOccupationRecord(result.rows[0]);
  } catch (error) {
    console.error('Error getting occupation by ID:', error);
    throw error;
  }
}

// Get occupation statistics
export async function getOccupationStats(): Promise<{
  totalOccupations: number;
  totalCountries: number;
  totalStates: number;
  totalLocations: number;
  avgSalary: number;
  lastUpdated: Date | null;
}> {
  // Skip DB queries during build
  if (process.env.SKIP_DB_DURING_BUILD === 'true') {
    return {
      totalOccupations: 0,
      totalCountries: 0,
      totalStates: 0,
      totalLocations: 0,
      avgSalary: 0,
      lastUpdated: null
    };
  }

  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(`
      SELECT 
        COUNT(*) as total_occupations,
        COUNT(DISTINCT country) as total_countries,
        COUNT(DISTINCT state) as total_states,
        COUNT(DISTINCT location) as total_locations,
        AVG(avg_annual_salary) as avg_salary,
        MAX(updated_at) as last_updated
      FROM occupations
    `);
    
    const row = result.rows[0];
    
    return {
      totalOccupations: parseInt(row.total_occupations),
      totalCountries: parseInt(row.total_countries),
      totalStates: parseInt(row.total_states),
      totalLocations: parseInt(row.total_locations),
      avgSalary: parseFloat(row.avg_salary) || 0,
      lastUpdated: row.last_updated
    };
  } catch (error) {
    console.error('Error getting occupation stats:', error);
    throw error;
  }
}