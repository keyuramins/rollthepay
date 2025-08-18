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
  totalHourlyLowValue?: string;
  totalHourlyHighValue?: string;
  relLinkOcc1?: string;
  relLinkOcc2?: string;
  relLinkOcc3?: string;
  relLinkOcc4?: string;
  relLinkOcc5?: string;
  relLinkOcc6?: string;
  relLinkOcc7?: string;
  relLinkOcc8?: string;
  relLinkOcc9?: string;
  relLinkOcc10?: string;
  relLinkOcc11?: string;
  relLinkOcc12?: string;
  relLinkLow1?: string;
  relLinkLow2?: string;
  relLinkLow3?: string;
  relLinkLow4?: string;
  relLinkLow5?: string;
  relLinkLow6?: string;
  relLinkLow7?: string;
  relLinkLow8?: string;
  relLinkLow9?: string;
  relLinkLow10?: string;
  relLinkLow11?: string;
  relLinkLow12?: string;
  relLinkHigh1?: string;
  relLinkHigh2?: string;
  relLinkHigh3?: string;
  relLinkHigh4?: string;
  relLinkHigh5?: string;
  relLinkHigh6?: string;
  relLinkHigh7?: string;
  relLinkHigh8?: string;
  relLinkHigh9?: string;
  relLinkHigh10?: string;
  relLinkHigh11?: string;
  relLinkHigh12?: string;
  relLinkSlug1?: string;
  relLinkSlug2?: string;
  relLinkSlug3?: string;
  relLinkSlug4?: string;
  relLinkSlug5?: string;
  relLinkSlug6?: string;
  relLinkSlug7?: string;
  relLinkSlug8?: string;
  relLinkSlug9?: string;
  relLinkSlug10?: string;
  relLinkSlug11?: string;
  relLinkSlug12?: string;
  relLinkState1?: string;
  relLinkState2?: string;
  relLinkState3?: string;
  relLinkState4?: string;
  relLinkState5?: string;
  relLinkState6?: string;
  relLinkState7?: string;
  relLinkState8?: string;
  relLinkState9?: string;
  relLinkState10?: string;
  relLinkState11?: string;
  relLinkState12?: string;
  relLinkLoc1?: string;
  relLinkLoc2?: string;
  relLinkLoc3?: string;
  relLinkLoc4?: string;
  relLinkLoc5?: string;
  relLinkLoc6?: string;
  relLinkLoc7?: string;
  relLinkLoc8?: string;
  relLinkLoc9?: string;
  relLinkLoc10?: string;
  relLinkLoc11?: string;
  relLinkLoc12?: string;
  "10P"?: string;
  "25P"?: string;
  "50P"?: string;
  "75P"?: string;
  "90P"?: string;
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

  // Total hourly values
  totalHourlyLowValue?: number | null;
  totalHourlyHighValue?: number | null;

  // Related occupations
  relLinkOcc1?: string | null;
  relLinkOcc2?: string | null;
  relLinkOcc3?: string | null;
  relLinkOcc4?: string | null;
  relLinkOcc5?: string | null;
  relLinkOcc6?: string | null;
  relLinkOcc7?: string | null;
  relLinkOcc8?: string | null;
  relLinkOcc9?: string | null;
  relLinkOcc10?: string | null;
  relLinkOcc11?: string | null;
  relLinkOcc12?: string | null;

  // Related salary ranges
  relLinkLow1?: number | null;
  relLinkLow2?: number | null;
  relLinkLow3?: number | null;
  relLinkLow4?: number | null;
  relLinkLow5?: number | null;
  relLinkLow6?: number | null;
  relLinkLow7?: number | null;
  relLinkLow8?: number | null;
  relLinkLow9?: number | null;
  relLinkLow10?: number | null;
  relLinkLow11?: number | null;
  relLinkLow12?: number | null;

  relLinkHigh1?: number | null;
  relLinkHigh2?: number | null;
  relLinkHigh3?: number | null;
  relLinkHigh4?: number | null;
  relLinkHigh5?: number | null;
  relLinkHigh6?: number | null;
  relLinkHigh7?: number | null;
  relLinkHigh8?: number | null;
  relLinkHigh9?: number | null;
  relLinkHigh10?: number | null;
  relLinkHigh11?: number | null;
  relLinkHigh12?: number | null;

  // Related slugs
  relLinkSlug1?: string | null;
  relLinkSlug2?: string | null;
  relLinkSlug3?: string | null;
  relLinkSlug4?: string | null;
  relLinkSlug5?: string | null;
  relLinkSlug6?: string | null;
  relLinkSlug7?: string | null;
  relLinkSlug8?: string | null;
  relLinkSlug9?: string | null;
  relLinkSlug10?: string | null;
  relLinkSlug11?: string | null;
  relLinkSlug12?: string | null;

  // Related states
  relLinkState1?: string | null;
  relLinkState2?: string | null;
  relLinkState3?: string | null;
  relLinkState4?: string | null;
  relLinkState5?: string | null;
  relLinkState6?: string | null;
  relLinkState7?: string | null;
  relLinkState8?: string | null;
  relLinkState9?: string | null;
  relLinkState10?: string | null;
  relLinkState11?: string | null;
  relLinkState12?: string | null;

  // Related locations
  relLinkLoc1?: string | null;
  relLinkLoc2?: string | null;
  relLinkLoc3?: string | null;
  relLinkLoc4?: string | null;
  relLinkLoc5?: string | null;
  relLinkLoc6?: string | null;
  relLinkLoc7?: string | null;
  relLinkLoc8?: string | null;
  relLinkLoc9?: string | null;
  relLinkLoc10?: string | null;
  relLinkLoc11?: string | null;
  relLinkLoc12?: string | null;

  // Salary percentiles
  "10P"?: number | null;
  "25P"?: number | null;
  "50P"?: number | null;
  "75P"?: number | null;
  "90P"?: number | null;
}

export interface DatasetIndex {
  all: OccupationRecord[];
  byCountry: Map<string, OccupationRecord[]>; // key: lowercase country
}

