import { parse } from "csv-parse/sync";
import type { DatasetIndex, OccupationRecord, RawCsvRow } from "./types";
import { getObject, getAllCsvFiles, initializeFilebrowser } from "../filebrowser/client";

// Module-scope cache to ensure single parsing per build/ISR cycle
let cachedIndex: DatasetIndex | null = null;
let filebrowserInitialized = false;
let lastCacheTime = 0;
const CACHE_DURATION = 31536000 * 1000; // 1 year in milliseconds

// Build-time bypass - prevent Filebrowser calls during build
// Only bypass during actual build phases, not during runtime
const isBuildTime = process.env.NODE_ENV === 'production' && 
                   (process.env.NEXT_PHASE === 'phase-production-build' || 
                    process.env.NEXT_PHASE === 'phase-production-optimize' ||
                    process.env.NEXT_PHASE === 'phase-production-compile');

// Debug build-time detection
if (typeof process !== 'undefined' && process.env) {
  console.log('🔍 Filebrowser-parse build-time detection:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  NEXT_PHASE: ${process.env.NEXT_PHASE || 'NOT SET'}`);
  console.log(`  isBuildTime: ${isBuildTime}`);
  console.log(`  Current timestamp: ${Date.now()}`);
}

function isInvalidToken(value: unknown): boolean {
  if (value == null) return true;
  const v = String(value).trim();
  return v.length === 0 || v.toUpperCase() === "#REF!";
}

function coerceNumber(value: unknown): number | null {
  if (isInvalidToken(value)) return null;
  // Remove commas and currency symbols, keep digits, sign and decimal point
  const normalized = String(value).replace(/[^0-9+\-.]/g, "");
  if (normalized.length === 0) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function safeString(value: unknown): string | null {
  if (isInvalidToken(value)) return null;
  return String(value).trim();
}

function toRecord(row: RawCsvRow): OccupationRecord | null {
  const title = safeString(row.title) ?? safeString(row.h1Title);
  const slug = safeString(row.slug_url);
  const country = safeString(row.country);
  if (!title || !slug || !country) return null; // required

  const record: OccupationRecord = {
    title,
    slug_url: slug,
    country,
    location: safeString(row.location),
    state: safeString(row.state),
    h1Title: safeString(row.h1Title),
    currencyCode: safeString(row.currency) ?? null,

    avgAnnualSalary: coerceNumber(row.avgAnnualSalary),
    bonusRangeMin: coerceNumber(row.bonusRangeMin),
    bonusRangeMax: coerceNumber(row.bonusRangeMax),
    profitSharingMin: coerceNumber(row.profitSharingMin),
    profitSharingMax: coerceNumber(row.profitSharingMax),
    commissionMin: coerceNumber(row.commissionMin),
    commissionMax: coerceNumber(row.commissionMax),
    lowSalary: coerceNumber(row.lowSalary),
    highSalary: coerceNumber(row.highSalary),
    totalPayMin: coerceNumber(row.totalPayMin),
    totalPayMax: coerceNumber(row.totalPayMax),
    avgHourlySalary: coerceNumber(row.avgHourlySalary),
    hourlyLowValue: coerceNumber(row.hourlyLowValue),
    hourlyHighValue: coerceNumber(row.hourlyHighValue),
    weeklySalary: coerceNumber(row.WeeklySalary),
    fortnightlySalary: coerceNumber(row.fortnightlySalary),
    monthlySalary: coerceNumber(row.monthlySalary),

    occupation: safeString(row.occupation),

    // Gender distribution
    genderMale: coerceNumber(row.genderMale),
    genderFemale: coerceNumber(row.genderFemale),

    // Experience buckets
    entryLevel: coerceNumber(row.entryLevel),
    earlyCareer: coerceNumber(row.earlyCareer),
    midCareer: coerceNumber(row.midCareer),
    experienced: coerceNumber(row.experienced),
    lateCareer: coerceNumber(row.lateCareer),

    // Skills data
    skillsNameOne: safeString(row.skillsNameOne),
    skillsNamePercOne: coerceNumber(row.skillsNamePercOne),
    skillsNameTwo: safeString(row.skillsNameTwo),
    skillsNamePercTwo: coerceNumber(row.skillsNamePercTwo),
    skillsNameThree: safeString(row.skillsNameThree),
    skillsNamePercThree: coerceNumber(row.skillsNamePercThree),
    skillsNameFour: safeString(row.skillsNameFour),
    skillsNamePercFour: coerceNumber(row.skillsNamePercFour),
    skillsNameFive: safeString(row.skillsNameFive),
    skillsNamePercFive: coerceNumber(row.skillsNamePercFive),
    skillsNameSix: safeString(row.skillsNameSix),
    skillsNamePercSix: coerceNumber(row.skillsNamePercSix),
    skillsNameSeven: safeString(row.skillsNameSeven),
    skillsNamePercSeven: coerceNumber(row.skillsNamePercSeven),
    skillsNameEight: safeString(row.skillsNameEight),
    skillsNamePercEight: coerceNumber(row.skillsNamePercEight),
    skillsNameNine: safeString(row.skillsNameNine),
    skillsNamePercNine: coerceNumber(row.skillsNamePercNine),
    skillsNameTen: safeString(row.skillsNameTen),
    skillsNamePercTen: coerceNumber(row.skillsNamePercTen),

    // Years of experience salaries
    oneYr: coerceNumber(row.oneYr),
    oneFourYrs: coerceNumber(row.oneFourYrs),
    fiveNineYrs: coerceNumber(row.fiveNineYrs),
    tenNineteenYrs: coerceNumber(row.tenNineteenYrs),
    twentyYrsPlus: coerceNumber(row.twentyYrsPlus),

    // Total hourly values
    totalHourlyLowValue: coerceNumber(row.totalHourlyLowValue),
    totalHourlyHighValue: coerceNumber(row.totalHourlyHighValue),

    // Related occupations
    relLinkOcc1: safeString(row.relLinkOcc1),
    relLinkOcc2: safeString(row.relLinkOcc2),
    relLinkOcc3: safeString(row.relLinkOcc3),
    relLinkOcc4: safeString(row.relLinkOcc4),
    relLinkOcc5: safeString(row.relLinkOcc5),
    relLinkOcc6: safeString(row.relLinkOcc6),
    relLinkOcc7: safeString(row.relLinkOcc7),
    relLinkOcc8: safeString(row.relLinkOcc8),
    relLinkOcc9: safeString(row.relLinkOcc9),
    relLinkOcc10: safeString(row.relLinkOcc10),
    relLinkOcc11: safeString(row.relLinkOcc11),
    relLinkOcc12: safeString(row.relLinkOcc12),

    // Related salary ranges
    relLinkLow1: coerceNumber(row.relLinkLow1),
    relLinkLow2: coerceNumber(row.relLinkLow2),
    relLinkLow3: coerceNumber(row.relLinkLow3),
    relLinkLow4: coerceNumber(row.relLinkLow4),
    relLinkLow5: coerceNumber(row.relLinkLow5),
    relLinkLow6: coerceNumber(row.relLinkLow6),
    relLinkLow7: coerceNumber(row.relLinkLow7),
    relLinkLow8: coerceNumber(row.relLinkLow8),
    relLinkLow9: coerceNumber(row.relLinkLow9),
    relLinkLow10: coerceNumber(row.relLinkLow10),
    relLinkLow11: coerceNumber(row.relLinkLow11),
    relLinkLow12: coerceNumber(row.relLinkLow12),

    relLinkHigh1: coerceNumber(row.relLinkHigh1),
    relLinkHigh2: coerceNumber(row.relLinkHigh2),
    relLinkHigh3: coerceNumber(row.relLinkHigh3),
    relLinkHigh4: coerceNumber(row.relLinkHigh4),
    relLinkHigh5: coerceNumber(row.relLinkHigh5),
    relLinkHigh6: coerceNumber(row.relLinkHigh6),
    relLinkHigh7: coerceNumber(row.relLinkHigh7),
    relLinkHigh8: coerceNumber(row.relLinkHigh8),
    relLinkHigh9: coerceNumber(row.relLinkHigh9),
    relLinkHigh10: coerceNumber(row.relLinkHigh10),
    relLinkHigh11: coerceNumber(row.relLinkHigh11),
    relLinkHigh12: coerceNumber(row.relLinkHigh12),

    // Related slugs
    relLinkSlug1: safeString(row.relLinkSlug1),
    relLinkSlug2: safeString(row.relLinkSlug2),
    relLinkSlug3: safeString(row.relLinkSlug3),
    relLinkSlug4: safeString(row.relLinkSlug4),
    relLinkSlug5: safeString(row.relLinkSlug5),
    relLinkSlug6: safeString(row.relLinkSlug6),
    relLinkSlug7: safeString(row.relLinkSlug7),
    relLinkSlug8: safeString(row.relLinkSlug8),
    relLinkSlug9: safeString(row.relLinkSlug9),
    relLinkSlug10: safeString(row.relLinkSlug10),
    relLinkSlug11: safeString(row.relLinkSlug11),
    relLinkSlug12: safeString(row.relLinkSlug12),

    // Related states
    relLinkState1: safeString(row.relLinkState1),
    relLinkState2: safeString(row.relLinkState2),
    relLinkState3: safeString(row.relLinkState3),
    relLinkState4: safeString(row.relLinkState4),
    relLinkState5: safeString(row.relLinkState5),
    relLinkState6: safeString(row.relLinkState6),
    relLinkState7: safeString(row.relLinkState7),
    relLinkState8: safeString(row.relLinkState8),
    relLinkState9: safeString(row.relLinkState9),
    relLinkState10: safeString(row.relLinkState10),
    relLinkState11: safeString(row.relLinkState11),
    relLinkState12: safeString(row.relLinkState12),

    // Related locations
    relLinkLoc1: safeString(row.relLinkLoc1),
    relLinkLoc2: safeString(row.relLinkLoc2),
    relLinkLoc3: safeString(row.relLinkLoc3),
    relLinkLoc4: safeString(row.relLinkLoc4),
    relLinkLoc5: safeString(row.relLinkLoc5),
    relLinkLoc6: safeString(row.relLinkLoc6),
    relLinkLoc7: safeString(row.relLinkLoc7),
    relLinkLoc8: safeString(row.relLinkLoc8),
    relLinkLoc9: safeString(row.relLinkLoc9),
    relLinkLoc10: safeString(row.relLinkLoc10),
    relLinkLoc11: safeString(row.relLinkLoc11),
    relLinkLoc12: safeString(row.relLinkLoc12),

    // Salary percentiles
    "10P": coerceNumber(row["10P"]),
    "25P": coerceNumber(row["25P"]),
    "50P": coerceNumber(row["50P"]),
    "75P": coerceNumber(row["75P"]),
    "90P": coerceNumber(row["90P"]),
  };

  return record;
}

async function readCsvFromFilebrowser(objectName: string): Promise<OccupationRecord[]> {
  try {
    const raw = await getObject(objectName);
    const parsed = parse(raw, { columns: true, skip_empty_lines: true }) as RawCsvRow[];
    const rows: OccupationRecord[] = [];
    
    for (const row of parsed) {
      const rec = toRecord(row);
      if (!rec) continue;
      rows.push(rec);
    }
    
    return rows;
  } catch (error) {
    console.error(`Failed to parse CSV from Filebrowser object ${objectName}:`, error);
    throw new Error(`Failed to parse CSV from Filebrowser: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getDataset(): Promise<DatasetIndex> {
  console.log('🔍 getDataset() called at:', new Date().toISOString());
  console.log('🔍 Current environment:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  NEXT_PHASE:', process.env.NEXT_PHASE || 'NOT SET');
  console.log('  isBuildTime:', isBuildTime);
  
  // Return empty dataset during build to prevent Filebrowser calls
  if (isBuildTime) {
    console.log('🚫 Build-time bypass: returning empty dataset');
    return {
      all: [],
      byCountry: new Map<string, OccupationRecord[]>()
    };
  }

  console.log('✅ Not in build time - proceeding with Filebrowser API calls');

  if (cachedIndex && Date.now() - lastCacheTime < CACHE_DURATION) {
    console.log('📋 Returning cached dataset (still valid for 1 year)');
    return cachedIndex;
  }

  try {
    console.log('🚀 Starting dataset initialization...');
    
    // Initialize Filebrowser if not already done
    if (!filebrowserInitialized) {
      console.log('🔌 Initializing Filebrowser connection...');
      await initializeFilebrowser();
      filebrowserInitialized = true;
      console.log('✅ Filebrowser connection established');
    } else {
      console.log('✅ Filebrowser already initialized');
    }

    console.log('🔍 Discovering all CSV files from rollthepay folder...');
    const files = await getAllCsvFiles();
    
    if (files.length === 0) {
      throw new Error('No CSV files found in Filebrowser. Please ensure data has been uploaded to the rollthepay folder.');
    }

    console.log(`📁 Found ${files.length} CSV files: ${files.join(', ')}`);

    // Process files in parallel with error handling
    console.log('⚡ Processing CSV files in parallel...');
    const filePromises = files.map(async (fileName) => {
      try {
        console.log(`📊 Processing ${fileName}...`);
        const result = await readCsvFromFilebrowser(fileName);
        console.log(`✅ ${fileName}: ${result.length} records loaded`);
        return result;
      } catch (error) {
        console.error(`❌ Failed to process file ${fileName}:`, error);
        throw error; // Re-throw to fail fast
      }
    });

    const fileResults = await Promise.all(filePromises);
    const all: OccupationRecord[] = [];
    
    for (const result of fileResults) {
      all.push(...result);
    }

    if (all.length === 0) {
      throw new Error('No valid records found in any CSV files from Filebrowser. Please check your data format.');
    }

    console.log('🏗️ Building country index...');
    const byCountry = new Map<string, OccupationRecord[]>();
    for (const rec of all) {
      const key = rec.country.toLowerCase();
      if (!byCountry.has(key)) byCountry.set(key, []);
      byCountry.get(key)!.push(rec);
    }

    cachedIndex = { all, byCountry };
    lastCacheTime = Date.now();
    console.log(`🎉 Successfully loaded ${all.length} records from ${files.length} files from Filebrowser`);
    console.log(`🌍 Countries indexed: ${Array.from(byCountry.keys()).join(', ')}`);
    console.log(`💾 Dataset cached for 1 year - no more Filebrowser calls needed!`);
    return cachedIndex;
  } catch (error) {
    console.error('Failed to get dataset from Filebrowser:', error);
    throw new Error(`Filebrowser data access failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure Filebrowser is accessible and contains data.`);
  }
}

// Helper function to normalize slugs for comparison (handles special characters)
function normalizeSlugForComparison(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}

export async function findRecordByPath(params: { country: string; state?: string; location?: string; slug: string }): Promise<OccupationRecord | null> {
  // Return null during build to prevent Filebrowser calls
  if (isBuildTime) {
    if (!isBuildTime) console.log('Build-time bypass: returning null for findRecordByPath');
    return null;
  }

  try {
    const { all } = await getDataset();
    const country = params.country.toLowerCase();
    // Decode the slug to handle special characters like # and +
    const slug = decodeURIComponent(params.slug);
    const state = params.state?.toLowerCase();
    const location = params.location?.toLowerCase();

    for (const rec of all) {
      if (normalizeSlugForComparison(rec.slug_url) !== normalizeSlugForComparison(slug)) continue;
      if (rec.country.toLowerCase() !== country) continue;
      
      if (state) {
        if (rec.state?.toLowerCase() !== state) continue;
        
        if (location) {
          // Location-specific record
          if (rec.location?.toLowerCase() === location) return rec;
        } else {
          // State-level record (no specific location)
          if (!rec.location) return rec;
        }
      } else {
        // Country-level record (no state)
        if (!rec.state) return rec;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to find record by path:', error);
    throw error; // Re-throw to fail fast
  }
}

// Helper function to group records by state
export async function getStateData(country: string) {
  // Return empty state groups during build to prevent Filebrowser calls
  if (isBuildTime) {
    if (!isBuildTime) console.log('Build-time bypass: returning empty state data');
    return new Map<string, { 
      name: string; 
      jobs: Array<{
        slug: string;
        title: string | null;
        occupation: string | null;
        avgAnnualSalary: number | null;
        avgHourlySalary: number | null;
      }>;
    }>();
  }

  try {
    const { all } = await getDataset();
    const countryRecords = all.filter(record => 
      record.country.toLowerCase() === country.toLowerCase()
    );
    
    const stateGroups = new Map<string, { 
      name: string; 
      jobs: Array<{
        slug: string;
        title: string | null;
        occupation: string | null;
        avgAnnualSalary: number | null;
        avgHourlySalary: number | null;
      }>;
    }>();
    
    for (const record of countryRecords) {
      if (record.state) {
        const stateKey = record.state.toLowerCase().replace(/\s+/g, '-');
        if (!stateGroups.has(stateKey)) {
          stateGroups.set(stateKey, {
            name: record.state,
            jobs: []
          });
        }
        
        stateGroups.get(stateKey)!.jobs.push({
          slug: record.slug_url,
          title: record.title,
          occupation: record.occupation,
          avgAnnualSalary: record.avgAnnualSalary,
          avgHourlySalary: record.avgHourlySalary
        });
      }
    }
    
    return stateGroups;
  } catch (error) {
    console.error('Failed to get state data:', error);
    throw error; // Re-throw to fail fast
  }
}

// Helper function to group records by location within a state
export async function getLocationData(country: string, state: string) {
  // Return empty location groups during build to prevent Filebrowser calls
  if (isBuildTime) {
    if (!isBuildTime) console.log('Build-time bypass: returning empty location data');
    return new Map<string, { 
      name: string; 
      jobs: Array<{
        slug: string;
        title: string | null;
        occupation: string | null;
        avgAnnualSalary: number | null;
        avgHourlySalary: number | null;
      }>;
    }>();
  }

  try {
    const { all } = await getDataset();
    const stateRecords = all.filter(record => 
      record.country.toLowerCase() === country.toLowerCase() &&
      record.state?.toLowerCase() === state.toLowerCase()
    );
    
    const locationGroups = new Map<string, { 
      name: string; 
      jobs: Array<{
        slug: string;
        title: string | null;
        occupation: string | null;
        avgAnnualSalary: number | null;
        avgHourlySalary: number | null;
      }>;
    }>();
    
    for (const record of stateRecords) {
      if (record.location) {
        const locationKey = record.location.toLowerCase().replace(/\s+/g, '-');
        if (!locationGroups.has(locationKey)) {
          locationGroups.set(locationKey, {
            name: record.location,
            jobs: []
          });
        }
        
        locationGroups.get(locationKey)!.jobs.push({
          slug: record.slug_url,
          title: record.title,
          occupation: record.occupation,
          avgAnnualSalary: record.avgAnnualSalary,
          avgHourlySalary: record.avgHourlySalary
        });
      }
    }
    
    return locationGroups;
  } catch (error) {
    console.error('Failed to get location data:', error);
    throw error; // Re-throw to fail fast
  }
}

// Clear cache (useful for testing or manual cache invalidation)
export function clearCache() {
  // Skip cache clearing during build
  if (isBuildTime) {
    if (!isBuildTime) console.log('Build-time bypass: skipping cache clear');
    return;
  }

  cachedIndex = null;
  filebrowserInitialized = false;
  lastCacheTime = 0; // Reset cache time
  console.log('Dataset cache cleared');
}
