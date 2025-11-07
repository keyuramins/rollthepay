// lib/data/types.ts
export type MaybeNumber = number | null;

//used for importing csv data - app/api/admin/import-csv/route.ts
export interface RawCsvRow {
  title?: string;
  slug_url?: string;
  country?: string;
  company_name?: string;
  location?: string;
  state?: string;
  currency?: string;
  avgAnnualSalary?: string;
  bonusRangeMin?: string;
  bonusRangeMax?: string;
  profitSharingMin?: string;
  profitSharingMax?: string;
  commissionMin?: string;
  commissionMax?: string;
  occ_name?: string;
  totalPayMin?: string;
  totalPayMax?: string;
  avgHourlySalary?: string;
  hourlyLowValue?: string;
  hourlyHighValue?: string;
  fortnightlySalary?: string;
  monthlySalary?: string;
  genderMale?: string;
  genderFemale?: string;
  entryLevel?: string;
  earlyCareer?: string;
  midCareer?: string;
  experienced?: string;
  lateCareer?: string;
  skillsNameOne?: string;
  skillsNamePercOne?: string;
  skillsNameTwo?: string;
  skillsNamePercTwo?: string;
  skillsNameThree?: string;
  skillsNamePercThree?: string;
  skillsNameFour?: string;
  skillsNamePercFour?: string;
  skillsNameFive?: string;
  skillsNamePercFive?: string;
  skillsNameSix?: string;
  skillsNamePercSix?: string;
  skillsNameSeven?: string;
  skillsNamePercSeven?: string;
  skillsNameEight?: string;
  skillsNamePercEight?: string;
  skillsNameNine?: string;
  skillsNamePercNine?: string;
  skillsNameTen?: string;
  skillsNamePercTen?: string;
  oneYr?: string;
  oneFourYrs?: string;
  fiveNineYrs?: string;
  tenNineteenYrs?: string;
  twentyYrsPlus?: string;
  "10P"?: string;
  "25P"?: string;
  "50P"?: string;
  "75P"?: string;
  "90P"?: string;
  [key: string]: unknown;
}

export interface OccupationRecord {
  occ_name: string | null;
  title: string | null;
  company_name: string | null;
  slug_url: string; // use as-is in routing; already lowercase in source
  country: string; // display case from data, routing uses lowercase segment
  location: string | null; // city/locality when present
  state: string | null; // optional state; lowercased in route segment

  avgAnnualSalary: MaybeNumber;
  bonusRangeMin: MaybeNumber;
  bonusRangeMax: MaybeNumber;
  profitSharingMin: MaybeNumber;
  profitSharingMax: MaybeNumber;
  commissionMin: MaybeNumber;
  commissionMax: MaybeNumber;
  totalPayMin: MaybeNumber;
  totalPayMax: MaybeNumber;
  avgHourlySalary: MaybeNumber;
  hourlyLowValue: MaybeNumber;
  hourlyHighValue: MaybeNumber;
  fortnightlySalary: MaybeNumber;
  monthlySalary: MaybeNumber;

  // Experience buckets (when present in CSV)
  entryLevel?: number | null;
  earlyCareer?: number | null;
  midCareer?: number | null;
  experienced?: number | null;
  lateCareer?: number | null;

  // Gender distribution
  genderMale?: number | null;
  genderFemale?: number | null;

  // Skills data
  skillsNameOne?: string | null;
  skillsNamePercOne?: number | null;
  skillsNameTwo?: string | null;
  skillsNamePercTwo?: number | null;
  skillsNameThree?: string | null;
  skillsNamePercThree?: number | null;
  skillsNameFour?: string | null;
  skillsNamePercFour?: number | null;
  skillsNameFive?: string | null;
  skillsNamePercFive?: number | null;
  skillsNameSix?: string | null;
  skillsNamePercSix?: number | null;
  skillsNameSeven?: string | null;
  skillsNamePercSeven?: number | null;
  skillsNameEight?: string | null;
  skillsNamePercEight?: number | null;
  skillsNameNine?: string | null;
  skillsNamePercNine?: number | null;
  skillsNameTen?: string | null;
  skillsNamePercTen?: number | null;

  // Years of experience salaries
  oneYr?: number | null;
  oneFourYrs?: number | null;
  fiveNineYrs?: number | null;
  tenNineteenYrs?: number | null;
  twentyYrsPlus?: number | null;

  // Salary percentiles
  "10P"?: number | null;
  "25P"?: number | null;
  "50P"?: number | null;
  "75P"?: number | null;
  "90P"?: number | null;
}

export interface DatasetIndex {
  all: OccupationRecord[]; // Empty array - data fetched on demand
  byCountry: Map<string, OccupationRecord[]>; // key: lowercase country, values: empty arrays (data fetched on demand)
}

// Lightweight dataset index for efficient queries
export interface LightweightDatasetIndex {
  countries: string[]; // List of available countries
  totalRecords: number; // Total record count
  totalCountries: number; // Total country count
}

