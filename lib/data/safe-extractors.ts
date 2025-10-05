import type { OccupationRecord } from "./types";

/**
 * Safely extracts primitive values from OccupationRecord objects
 * to avoid potential issues with complex nested structures or circular references
 */

/**
 * Safely extracts the country name from a record
 */
export function extractCountry(record: OccupationRecord): string | null {
  if (!record || typeof record !== 'object') {
    return null;
  }
  
  const country = record.country;
  if (typeof country === 'string' && country.trim().length > 0) {
    return country.trim();
  }
  
  return null;
}

/**
 * Safely extracts the state name from a record
 */
export function extractState(record: OccupationRecord): string | null {
  if (!record || typeof record !== 'object') {
    return null;
  }
  
  const state = record.state;
  if (typeof state === 'string' && state.trim().length > 0) {
    return state.trim();
  }
  
  return null;
}

/**
 * Safely extracts the location name from a record
 */
export function extractLocation(record: OccupationRecord): string | null {
  if (!record || typeof record !== 'object') {
    return null;
  }
  
  const location = record.location;
  if (typeof location === 'string' && location.trim().length > 0) {
    return location.trim();
  }
  
  return null;
}

/**
 * Safely extracts the title from a record
 */
export function extractTitle(record: OccupationRecord): string | null {
  if (!record || typeof record !== 'object') {
    return null;
  }
  
  const title = record.title;
  if (typeof title === 'string' && title.trim().length > 0) {
    return title.trim();
  }
  
  return null;
}

/**
 * Safely extracts the occupation from a record
 */
export function extractOccupation(record: OccupationRecord): string | null {
  if (!record || typeof record !== 'object') {
    return null;
  }
  
  const occupation = record.occupation;
  if (typeof occupation === 'string' && occupation.trim().length > 0) {
    return occupation.trim();
  }
  
  return null;
}

/**
 * Safely extracts the slug from a record
 */
export function extractSlug(record: OccupationRecord): string | null {
  if (!record || typeof record !== 'object') {
    return null;
  }
  
  const slug = record.slug_url;
  if (typeof slug === 'string' && slug.trim().length > 0) {
    return slug.trim();
  }
  
  return null;
}

/**
 * Safely extracts salary information from a record
 */
export function extractSalaryInfo(record: OccupationRecord): {
  avgAnnualSalary: number | null;
  avgHourlySalary: number | null;
  lowSalary: number | null;
  highSalary: number | null;
} {
  if (!record || typeof record !== 'object') {
    return {
      avgAnnualSalary: null,
      avgHourlySalary: null,
      lowSalary: null,
      highSalary: null,
    };
  }
  
  return {
    avgAnnualSalary: typeof record.avgAnnualSalary === 'number' ? record.avgAnnualSalary : null,
    avgHourlySalary: typeof record.avgHourlySalary === 'number' ? record.avgHourlySalary : null,
    lowSalary: typeof record.lowSalary === 'number' ? record.lowSalary : null,
    highSalary: typeof record.highSalary === 'number' ? record.highSalary : null,
  };
}

/**
 * Safely extracts unique countries from an array of records
 */
export function extractUniqueCountries(records: OccupationRecord[]): string[] {
  if (!Array.isArray(records)) {
    return [];
  }
  
  const countries = new Set<string>();
  
  for (const record of records) {
    const country = extractCountry(record);
    if (country) {
      countries.add(country);
    }
  }
  
  return Array.from(countries);
}

/**
 * Safely extracts unique states from an array of records for a specific country
 */
export function extractUniqueStates(records: OccupationRecord[], country: string): string[] {
  if (!Array.isArray(records) || typeof country !== 'string') {
    return [];
  }
  
  const states = new Set<string>();
  const normalizedCountry = country.toLowerCase();
  
  for (const record of records) {
    const recordCountry = extractCountry(record);
    const recordState = extractState(record);
    
    if (recordCountry && recordCountry.toLowerCase() === normalizedCountry && recordState) {
      states.add(recordState);
    }
  }
  
  return Array.from(states);
}

/**
 * Safely extracts unique locations from an array of records for a specific country and state
 */
export function extractUniqueLocations(records: OccupationRecord[], country: string, state: string): string[] {
  if (!Array.isArray(records) || typeof country !== 'string' || typeof state !== 'string') {
    return [];
  }
  
  const locations = new Set<string>();
  const normalizedCountry = country.toLowerCase();
  const normalizedState = state.toLowerCase();
  
  for (const record of records) {
    const recordCountry = extractCountry(record);
    const recordState = extractState(record);
    const recordLocation = extractLocation(record);
    
    if (
      recordCountry && 
      recordCountry.toLowerCase() === normalizedCountry &&
      recordState && 
      recordState.toLowerCase() === normalizedState &&
      recordLocation
    ) {
      locations.add(recordLocation);
    }
  }
  
  return Array.from(locations);
}

/**
 * Safely extracts a summary of record data for logging purposes
 */
export function extractRecordSummary(record: OccupationRecord): {
  title: string | null;
  country: string | null;
  state: string | null;
  location: string | null;
  occupation: string | null;
  slug: string | null;
  hasSalaryData: boolean;
} {
  if (!record || typeof record !== 'object') {
    return {
      title: null,
      country: null,
      state: null,
      location: null,
      occupation: null,
      slug: null,
      hasSalaryData: false,
    };
  }
  
  const salaryInfo = extractSalaryInfo(record);
  const hasSalaryData = salaryInfo.avgAnnualSalary !== null || 
                       salaryInfo.avgHourlySalary !== null ||
                       salaryInfo.lowSalary !== null ||
                       salaryInfo.highSalary !== null;
  
  return {
    title: extractTitle(record),
    country: extractCountry(record),
    state: extractState(record),
    location: extractLocation(record),
    occupation: extractOccupation(record),
    slug: extractSlug(record),
    hasSalaryData,
  };
}

/**
 * Validates that a record has the minimum required fields
 */
export function validateRecord(record: OccupationRecord): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!record || typeof record !== 'object') {
    errors.push('Record is not a valid object');
    return { isValid: false, errors };
  }
  
  const title = extractTitle(record);
  const country = extractCountry(record);
  const slug = extractSlug(record);
  
  if (!title) {
    errors.push('Missing or invalid title');
  }
  
  if (!country) {
    errors.push('Missing or invalid country');
  }
  
  if (!slug) {
    errors.push('Missing or invalid slug');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an array of records and returns validation results
 */
export function validateRecords(records: OccupationRecord[]): {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  validationErrors: { [key: string]: string[] };
  sampleErrors: string[];
} {
  if (!Array.isArray(records)) {
    return {
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
      validationErrors: {},
      sampleErrors: ['Records is not an array'],
    };
  }
  
  let validRecords = 0;
  let invalidRecords = 0;
  const validationErrors: { [key: string]: string[] } = {};
  const sampleErrors: string[] = [];
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const validation = validateRecord(record);
    
    if (validation.isValid) {
      validRecords++;
    } else {
      invalidRecords++;
      validationErrors[`record_${i}`] = validation.errors;
      
      // Collect sample errors (first 5 invalid records)
      if (sampleErrors.length < 5) {
        sampleErrors.push(`Record ${i}: ${validation.errors.join(', ')}`);
      }
    }
  }
  
  return {
    totalRecords: records.length,
    validRecords,
    invalidRecords,
    validationErrors,
    sampleErrors,
  };
}

/**
 * Safely extracts dataset statistics for logging with validation
 */
export function extractDatasetStats(records: OccupationRecord[]): {
  totalRecords: number;
  uniqueCountries: number;
  countriesWithData: string[];
  recordsWithSalaryData: number;
  sampleRecord: ReturnType<typeof extractRecordSummary> | null;
  validation: ReturnType<typeof validateRecords>;
} {
  if (!Array.isArray(records)) {
    return {
      totalRecords: 0,
      uniqueCountries: 0,
      countriesWithData: [],
      recordsWithSalaryData: 0,
      sampleRecord: null,
      validation: {
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        validationErrors: {},
        sampleErrors: ['Records is not an array'],
      },
    };
  }
  
  // Validate records first
  const validation = validateRecords(records);
  
  const countries = extractUniqueCountries(records);
  let recordsWithSalaryData = 0;
  let sampleRecord: ReturnType<typeof extractRecordSummary> | null = null;
  
  for (const record of records) {
    const summary = extractRecordSummary(record);
    if (summary.hasSalaryData) {
      recordsWithSalaryData++;
    }
    
    // Get first valid record as sample
    if (!sampleRecord && summary.title && summary.country) {
      sampleRecord = summary;
    }
  }
  
  return {
    totalRecords: records.length,
    uniqueCountries: countries.length,
    countriesWithData: countries,
    recordsWithSalaryData,
    sampleRecord,
    validation,
  };
}
