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
  };

  // Optional experience buckets
  (record as any).entryLevel = coerceNumber((row as any).entryLevel);
  (record as any).earlyCareer = coerceNumber((row as any).earlyCareer);
  (record as any).midCareer = coerceNumber((row as any).midCareer);
  (record as any).experienced = coerceNumber((row as any).experienced);
  (record as any).lateCareer = coerceNumber((row as any).lateCareer);

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

