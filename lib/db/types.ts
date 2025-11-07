// lib/db/types.ts
import type { OccupationRecord } from '@/lib/data/types';

// Database row type (matches the PostgreSQL schema)
export interface DbOccupationRow {
  id: number;
  slug_url: string;
  title: string;
  occ_name: string | null;
  country: string;
  state: string | null;
  location: string | null;
  company_name: string | null;
  // Salary fields
  avg_annual_salary: number | null;
  avg_hourly_salary: number | null;
  hourly_low_value: number | null;
  hourly_high_value: number | null;
  fortnightly_salary: number | null;
  monthly_salary: number | null;
  total_pay_min: number | null;
  total_pay_max: number | null;
  
  // Additional compensation
  bonus_range_min: number | null;
  bonus_range_max: number | null;
  profit_sharing_min: number | null;
  profit_sharing_max: number | null;
  commission_min: number | null;
  commission_max: number | null;
  
  // Gender distribution
  gender_male: number | null;
  gender_female: number | null;
  
  // Experience level salaries
  entry_level: number | null;
  early_career: number | null;
  mid_career: number | null;
  experienced: number | null;
  late_career: number | null;
  
  // Years of experience salaries
  one_yr: number | null;
  one_four_yrs: number | null;
  five_nine_yrs: number | null;
  ten_nineteen_yrs: number | null;
  twenty_yrs_plus: number | null;
  
  // Salary percentiles
  percentile_10: number | null;
  percentile_25: number | null;
  percentile_50: number | null;
  percentile_75: number | null;
  percentile_90: number | null;
  
  // Skills as JSONB
  skills: Array<{ name: string; percentage: number }> | null;
  
  // Metadata
  data_source: string;
  contribution_count: number;
  last_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert number to word (for skills column mapping)
function numToWord(num: number): string {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[num] || '';
}

// Helper function to safely convert values to numbers or null
function safeNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? null : num;
}

// Helper function to safely convert values to strings or null
function safeString(value: any): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
}

// Transform database row to OccupationRecord (for backward compatibility)
export function transformDbRowToOccupationRecord(row: DbOccupationRow): OccupationRecord {
  // Transform skills JSONB back to expanded format for backward compatibility
  const skills = row.skills || [];
  
  return {
    // Basic fields
    title: row.title,
    slug_url: row.slug_url,
    country: row.country,
    location: row.location,
    state: row.state,
    company_name: row.company_name || null,
    // Salary fields (safe number conversion)
    avgAnnualSalary: safeNumber(row.avg_annual_salary),
    avgHourlySalary: safeNumber(row.avg_hourly_salary),
    hourlyLowValue: safeNumber(row.hourly_low_value),
    hourlyHighValue: safeNumber(row.hourly_high_value),
    fortnightlySalary: safeNumber(row.fortnightly_salary),
    monthlySalary: safeNumber(row.monthly_salary),
    totalPayMin: safeNumber(row.total_pay_min),
    totalPayMax: safeNumber(row.total_pay_max),
    
    // Additional compensation
    bonusRangeMin: safeNumber(row.bonus_range_min),
    bonusRangeMax: safeNumber(row.bonus_range_max),
    profitSharingMin: safeNumber(row.profit_sharing_min),
    profitSharingMax: safeNumber(row.profit_sharing_max),
    commissionMin: safeNumber(row.commission_min),
    commissionMax: safeNumber(row.commission_max),
    
    // Gender distribution
    genderMale: row.gender_male,
    genderFemale: row.gender_female,
    
    // Experience level salaries
    entryLevel: row.entry_level,
    earlyCareer: row.early_career,
    midCareer: row.mid_career,
    experienced: row.experienced,
    lateCareer: row.late_career,
    
    // Years of experience salaries
    oneYr: row.one_yr,
    oneFourYrs: row.one_four_yrs,
    fiveNineYrs: row.five_nine_yrs,
    tenNineteenYrs: row.ten_nineteen_yrs,
    twentyYrsPlus: row.twenty_yrs_plus,
    
    // Salary percentiles
    "10P": row.percentile_10,
    "25P": row.percentile_25,
    "50P": row.percentile_50,
    "75P": row.percentile_75,
    "90P": row.percentile_90,
    
    // Skills (transform JSONB back to expanded format)
    skillsNameOne: skills[0]?.name || null,
    skillsNamePercOne: skills[0]?.percentage || null,
    skillsNameTwo: skills[1]?.name || null,
    skillsNamePercTwo: skills[1]?.percentage || null,
    skillsNameThree: skills[2]?.name || null,
    skillsNamePercThree: skills[2]?.percentage || null,
    skillsNameFour: skills[3]?.name || null,
    skillsNamePercFour: skills[3]?.percentage || null,
    skillsNameFive: skills[4]?.name || null,
    skillsNamePercFive: skills[4]?.percentage || null,
    skillsNameSix: skills[5]?.name || null,
    skillsNamePercSix: skills[5]?.percentage || null,
    skillsNameSeven: skills[6]?.name || null,
    skillsNamePercSeven: skills[6]?.percentage || null,
    skillsNameEight: skills[7]?.name || null,
    skillsNamePercEight: skills[7]?.percentage || null,
    skillsNameNine: skills[8]?.name || null,
    skillsNamePercNine: skills[8]?.percentage || null,
    skillsNameTen: skills[9]?.name || null,
    skillsNamePercTen: skills[9]?.percentage || null,
    
    // Occupation
    occ_name: row.occ_name,
  };
}

// Transform OccupationRecord to database row (for inserts/updates)
export function transformOccupationRecordToDb(record: Partial<OccupationRecord>): Partial<DbOccupationRow> {
  // Transform expanded skills format to JSONB
  const skills: Array<{ name: string; percentage: number }> = [];
  
  for (let i = 1; i <= 10; i++) {
    const name = record[`skillsName${numToWord(i)}` as keyof OccupationRecord] as string | null;
    const percentage = record[`skillsNamePerc${numToWord(i)}` as keyof OccupationRecord] as number | null;
    
    if (name && percentage !== null) {
      skills.push({ name, percentage });
    }
  }
  
  return {
    slug_url: record.slug_url,
    title: record.title || '',
    occ_name: record.occ_name,
    country: record.country,
    state: record.state,
    location: record.location,
    company_name: record.company_name,
    // Salary fields
    avg_annual_salary: record.avgAnnualSalary,
    avg_hourly_salary: record.avgHourlySalary,
    hourly_low_value: record.hourlyLowValue,
    hourly_high_value: record.hourlyHighValue,
    fortnightly_salary: record.fortnightlySalary,
    monthly_salary: record.monthlySalary,
    total_pay_min: record.totalPayMin,
    total_pay_max: record.totalPayMax,
    
    // Additional compensation
    bonus_range_min: record.bonusRangeMin,
    bonus_range_max: record.bonusRangeMax,
    profit_sharing_min: record.profitSharingMin,
    profit_sharing_max: record.profitSharingMax,
    commission_min: record.commissionMin,
    commission_max: record.commissionMax,
    
    // Gender distribution
    gender_male: record.genderMale,
    gender_female: record.genderFemale,
    
    // Experience level salaries
    entry_level: record.entryLevel,
    early_career: record.earlyCareer,
    mid_career: record.midCareer,
    experienced: record.experienced,
    late_career: record.lateCareer,
    
    // Years of experience salaries
    one_yr: record.oneYr,
    one_four_yrs: record.oneFourYrs,
    five_nine_yrs: record.fiveNineYrs,
    ten_nineteen_yrs: record.tenNineteenYrs,
    twenty_yrs_plus: record.twentyYrsPlus,
    
    // Salary percentiles
    percentile_10: record["10P"],
    percentile_25: record["25P"],
    percentile_50: record["50P"],
    percentile_75: record["75P"],
    percentile_90: record["90P"],
    
    // Skills as JSONB
    skills: skills.length > 0 ? skills : null,
    
    // Metadata
    data_source: 'admin_import', // Default for new records
  };
}

// Type for salary update data (user contributions)
export interface SalaryUpdateData {
  avg_annual_salary?: number;
  avg_hourly_salary?: number;
  hourly_low_value?: number;
  hourly_high_value?: number;
  fortnightly_salary?: number;
  monthly_salary?: number;
  total_pay_min?: number;
  total_pay_max?: number;
  bonus_range_min?: number;
  bonus_range_max?: number;
  profit_sharing_min?: number;
  profit_sharing_max?: number;
  commission_min?: number;
  commission_max?: number;
  entry_level?: number;
  early_career?: number;
  mid_career?: number;
  experienced?: number;
  late_career?: number;
  one_yr?: number;
  one_four_yrs?: number;
  five_nine_yrs?: number;
  ten_nineteen_yrs?: number;
  twenty_yrs_plus?: number;
  percentile_10?: number;
  percentile_25?: number;
  percentile_50?: number;
  percentile_75?: number;
  percentile_90?: number;
}
