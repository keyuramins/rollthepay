import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type { DatasetIndex, OccupationRecord, RawCsvRow } from "./types";

// Module-scope cache to ensure single parsing per build/ISR cycle
let cachedIndex: DatasetIndex | null = null;

const DATA_DIR = path.join(process.cwd(), "data");

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

function readCsvFile(filePath: string): OccupationRecord[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parse(raw, { columns: true, skip_empty_lines: true }) as RawCsvRow[];
  const rows: OccupationRecord[] = [];
  for (const row of parsed) {
    const rec = toRecord(row);
    if (!rec) continue;
    rows.push(rec);
  }
  return rows;
}

function walkDataFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDataFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".csv")) files.push(full);
  }
  return files;
}

export function getDataset(): DatasetIndex {
  if (cachedIndex) return cachedIndex;

  const files = walkDataFiles(DATA_DIR);
  const all: OccupationRecord[] = files.flatMap(readCsvFile);

  const byCountry = new Map<string, OccupationRecord[]>();
  for (const rec of all) {
    const key = rec.country.toLowerCase();
    if (!byCountry.has(key)) byCountry.set(key, []);
    byCountry.get(key)!.push(rec);
  }

  cachedIndex = { all, byCountry };
  return cachedIndex;
}

export function findRecordByPath(params: { country: string; state?: string; slug: string }): OccupationRecord | null {
  const { all } = getDataset();
  const country = params.country.toLowerCase();
  const slug = params.slug; // slug_url used as-is
  const state = params.state?.toLowerCase();

  for (const rec of all) {
    if (rec.slug_url !== slug) continue;
    if (rec.country.toLowerCase() !== country) continue;
    if (state) {
      if (rec.state?.toLowerCase() === state) return rec;
    } else {
      if (!rec.state) return rec;
    }
  }
  return null;
}

// Helper function to group records by state
export function getStateData(country: string) {
  const { all } = getDataset();
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
}

