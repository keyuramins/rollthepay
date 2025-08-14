export type MaybeNumber = number | null;

export interface RawCsvRow {
  title?: string;
  slug_url?: string;
  country?: string;
  location?: string;
  state?: string;
  h1Title?: string;
  currency?: string;
  avgAnnualSalary?: string;
  bonusRangeMin?: string;
  bonusRangeMax?: string;
  profitSharingMin?: string;
  profitSharingMax?: string;
  commissionMin?: string;
  commissionMax?: string;
  lowSalary?: string;
  highSalary?: string;
  occupation?: string;
  totalPayMin?: string;
  totalPayMax?: string;
  avgHourlySalary?: string;
  hourlyLowValue?: string;
  hourlyHighValue?: string;
  WeeklySalary?: string;
  fortnightlySalary?: string;
  monthlySalary?: string;
  // Additional fields (skills, related links, percentiles) intentionally omitted for brevity
  [key: string]: unknown;
}

export interface OccupationRecord {
  title: string;
  slug_url: string; // use as-is in routing; already lowercase in source
  country: string; // display case from data, routing uses lowercase segment
  location: string | null; // city/locality when present
  state: string | null; // optional state; lowercased in route segment
  h1Title: string | null; // fallback only if title missing

  currencyCode: string | null; // e.g., AUD, INR (derived from country when absent)

  avgAnnualSalary: MaybeNumber;
  bonusRangeMin: MaybeNumber;
  bonusRangeMax: MaybeNumber;
  profitSharingMin: MaybeNumber;
  profitSharingMax: MaybeNumber;
  commissionMin: MaybeNumber;
  commissionMax: MaybeNumber;
  lowSalary: MaybeNumber;
  highSalary: MaybeNumber;
  totalPayMin: MaybeNumber;
  totalPayMax: MaybeNumber;
  avgHourlySalary: MaybeNumber;
  hourlyLowValue: MaybeNumber;
  hourlyHighValue: MaybeNumber;
  weeklySalary: MaybeNumber;
  fortnightlySalary: MaybeNumber;
  monthlySalary: MaybeNumber;

  occupation: string | null;

  // Experience buckets (when present in CSV)
  entryLevel?: number | null;
  earlyCareer?: number | null;
  midCareer?: number | null;
  experienced?: number | null;
  lateCareer?: number | null;
}

export interface DatasetIndex {
  all: OccupationRecord[];
  byCountry: Map<string, OccupationRecord[]>; // key: lowercase country
}

