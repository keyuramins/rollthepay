// lib/db/queries.ts
import 'dotenv/config';
import { pool } from './client';
import type { OccupationRecord } from '@/lib/data/types';
import type { DbOccupationRow, SalaryUpdateData } from './types';
import { transformDbRowToOccupationRecord, transformOccupationRecordToDb } from './types';

// Short-lived cache for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
function getCached<T>(key: string): T | null {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data; // Return cached value without deleting
  }
  // Only delete if expired (cleanup happens in interval)
  if (cached) {
    queryCache.delete(key);
  }
  return null;
}

function setCached<T>(key: string, data: T): void {
  queryCache.set(key, { data, timestamp: Date.now() });
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
  'title', 'h1_title', 'occ_name', 'country', 'state', 'location', 'currency_code',
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

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
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

// Get all countries (lightweight operation)
export async function getAllCountries(): Promise<string[]> {
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
}

// Get homepage statistics (lightweight operation with caching)
export async function getHomepageStats(): Promise<{
  totalRecords: number;
  uniqueCountries: number;
}> {
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
}

export interface OccupationSearchResult {
  title: string;
  occ_name: string;
  slug: string;
  state: string | null;
  location: string | null;
  avg_salary: number | null;
  currency_code: string | null;
}

export async function searchOccupationsServer(
  country: string,
  query: string,
  limit: number = 50
): Promise<OccupationSearchResult[]> {
  const pool = requirePool();

  // Only fetch occupations for the given country and match full-text search
  const result = await pool.query(
    `
    SELECT 
      title,
      occ_name,
      slug_url AS slug,
      state,
      location,
      avg_annual_salary AS avg_salary,
      currency_code
    FROM occupations
    WHERE LOWER(country) = LOWER($1)
      AND to_tsvector('english', occ_name) @@ plainto_tsquery('english', $2)
    ORDER BY ts_rank(
      to_tsvector('english', occ_name),
      plainto_tsquery('english', $2)
    ) DESC
    LIMIT $3
    `,
    [country, query, limit]
  );

  return result.rows;
}

// Get occupations for search (lightweight - only essential fields, no ORDER BY for performance)
export async function getAllOccupationsForSearch(country?: string, limit: number = 1000): Promise<Array<{
  country: string;
  title: string;
  slug: string;
  state: string | null;
  location: string | null;
}>> {
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
        location
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
}

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

// Find Occupation Salary Record by path
export async function findOccupationSalaryByPath(params: {
  country: string;
  state?: string;
  location?: string;
  slug: string;
}): Promise<OccupationRecord | null> {
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
  // try {
  //   const { country, state, location, slug } = params;
    
  //   const result = await poolInstance.query(`
  //     SELECT * FROM occupations
  //     WHERE LOWER(country) = LOWER($1)
  //       AND state IS NOT DISTINCT FROM $2
  //       AND location IS NOT DISTINCT FROM $3
  //       AND slug_url = $4
  //     LIMIT 1
  //   `, [country, state || null, location || null, slug]);    

  //   if (result.rows.length === 0) return null;
    
  //   return transformDbRowToOccupationRecord(result.rows[0]);
  // } catch (error) {
  //   console.error('Error finding record by path:', error);
  //   throw error;
  // }
}

// Get country data with statistics
export async function getCountryData(country: string): Promise<{
  countryName: string;
  totalJobs: number;
  avgSalary: number;
  states: string[];
  occupationItems: any[];
  headerOccupations: any[];
} | null> {
  const poolInstance = requirePool();
  // Convert slug to DB country format
  const dbCountryName = country.replace(/-/g, ' '); // brunei-darussalam -> brunei darussalam
  
  try {
    const [countryResult, statesResult, occupationsResult] = await Promise.all([
      poolInstance.query(`
        SELECT 
          country,
          COUNT(*) as job_count,
          AVG(avg_annual_salary) as avg_salary,
          COUNT(DISTINCT state) as state_count
        FROM occupations 
        WHERE LOWER(country) = LOWER($1)
        GROUP BY country
      `, [dbCountryName]),
      poolInstance.query(`
        SELECT DISTINCT state 
        FROM occupations 
        WHERE LOWER(country) = LOWER($1) AND state IS NOT NULL
        ORDER BY state
      `, [dbCountryName]),
      poolInstance.query('SELECT * FROM occupations WHERE LOWER(country) = LOWER($1) ORDER BY LOWER(title)', [dbCountryName])
    ]);

    if (countryResult.rows.length === 0) {
      return null;
    }

    const countryData = countryResult.rows[0];
    const states = statesResult.rows.map(row => row.state);
    const occupations = occupationsResult.rows.map(transformDbRowToOccupationRecord);

    //const countryName = country.charAt(0).toUpperCase() + country.slice(1);
    const countryName = countryResult.rows[0].country;
    const totalJobs = parseInt(countryData.job_count);
    const avgSalary = parseFloat(countryData.avg_salary) || 0;

    function slugify(name: string) {
      return name.toLowerCase().replace(/\s+/g, '-');
    }

    const occupationItems = occupations.map(record => ({
      id: record.slug_url,
      displayName: record.title || record.h1Title || "Unknown Occupation",
      originalName: record.title || record.h1Title || "Unknown Occupation",
      slug_url: record.slug_url,
      location: record.location || undefined,
      state: record.state || undefined,
      avgAnnualSalary: record.avgAnnualSalary || undefined,
      countrySlug: slugify(countryResult.rows[0].country) //DB country normalized for URL
    }));

    const headerOccupations = occupations.map(rec => ({
      country: rec.country.toLowerCase(),
      title: rec.title || rec.h1Title || "",
      slug: rec.slug_url,
      state: rec.state ? rec.state : null,
      location: rec.location ? rec.location : null,
    }));

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
}

// Get state data
export async function getStateData(country: string, state: string): Promise<{
  name: string;
  jobs: Array<{
    slug: string;
    title: string | null;
    occupation: string | null;
    avgAnnualSalary: number | null;
    avgHourlySalary: number | null;
  }>;
} | null> {
  const poolInstance = requirePool();

  const cacheKey = `state:${country}:${state}`;
  const cached = getCached<{
    name: string;
    jobs: Array<{
      slug: string;
      title: string | null;
      occupation: string | null;
      avgAnnualSalary: number | null;
      avgHourlySalary: number | null;
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
        occupation,
        avg_annual_salary,
        avg_hourly_salary,
        state
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
        occupation: row.occupation,
        avgAnnualSalary: row.avg_annual_salary,
        avgHourlySalary: row.avg_hourly_salary
      }))
    };
    
    setCached(cacheKey, stateData);
    return stateData;
  } catch (error) {
    console.error('Error getting state data:', error);
    throw error;
  }
}

// Get location data
export async function getLocationData(country: string, state: string, location: string): Promise<{
  name: string;
  jobs: Array<{
    slug: string;
    title: string | null;
    occupation: string | null;
    avgAnnualSalary: number | null;
    avgHourlySalary: number | null;
  }>;
} | null> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(`
      SELECT 
        slug_url,
        title,
        occupation,
        avg_annual_salary,
        avg_hourly_salary,
        location
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
        occupation: row.occupation,
        avgAnnualSalary: row.avg_annual_salary,
        avgHourlySalary: row.avg_hourly_salary
      }))
    };
  } catch (error) {
    console.error('Error getting location data:', error);
    throw error;
  }
}

// Get all states for a country (with caching)
export async function getAllStates(country: string): Promise<string[]> {
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
}

// Get all locations for a state (with caching)
export async function getAllLocations(country: string, state: string): Promise<string[]> {
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
      WHERE LOWER(country) = LOWER($1) AND LOWER(state) = LOWER($2) AND location IS NOT NULL
      ORDER BY location
    `, [country, state]);

    const locations = result.rows.map(row => row.location);
    setCached(cacheKey, locations);
    return locations;
  } catch (error) {
    console.error('Error getting all locations:', error);
    throw error;
  }
}

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

// Search occupations
export async function searchOccupations(query: string, country?: string, limit: number = 10): Promise<OccupationRecord[]> {
  const poolInstance = requirePool();

  try {
    const result = await poolInstance.query(`
      SELECT * FROM occupations 
      WHERE to_tsvector('english', COALESCE(occ_name, '')) @@ plainto_tsquery('english', $1)
      AND ($2::text IS NULL OR LOWER(country) = LOWER($2::text))
      ORDER BY ts_rank(
        to_tsvector('english', COALESCE(occ_name, '')),
        plainto_tsquery('english', $1)
      ) DESC
      LIMIT $3
    `, [query, country || null, limit]);

    return result.rows.map(transformDbRowToOccupationRecord);
  } catch (error) {
    console.error('Error searching occupations:', error);
    throw error;
  }
}

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
