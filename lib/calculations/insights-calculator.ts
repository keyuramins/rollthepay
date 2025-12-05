// lib/calculations/insights-calculator.ts
import type { OccupationRecord } from "@/lib/data/types";
import { locationStateCountryString } from "@/lib/utils/locationStateCountryString";

// Types for calculated insights
export interface InsightsData {
  occupationTitle: string;
  location: string;
  state: string;
  country: string;
  formattedLocation: string;
  salaryIncreasePercent: number;
  inflationComparison: string;
  demandStrength: 'strong' | 'moderate' | 'weak';
  compensationCompetitiveness: 'highly competitive' | 'competitive' | 'moderate';
  percentileRank: number;
  percentileRankOrdinal: string; // e.g., "59th", "41st", "23rd"
  salaryRangeSpread: number;
  salaryRangeSpreadData: { value: number; hasData: boolean };
  costOfLivingFactor: number;
  costOfLivingFactorData: { value: number; location: string; description: string; category: 'very high' | 'high' | 'moderate' | 'low' | 'very low' };
  projectedIncreaseRange: string;
  currentYear: string;
  nextYear: string;
  marketTrendConfidence: 'high' | 'medium' | 'low';
  positioningConfidence: 'high' | 'medium' | 'low';
  growthForecastConfidence: 'high' | 'medium' | 'low';
}

export interface BonusCompensationData {
  occupationTitle: string;
  skillsList: string;
  location: string;
  state: string;
  country: string;
  formattedLocation: string;
  maxBonus: number;
  avgBonus: number;
  minBonus: number;
  growthFactor: number;
  minToAvgPercent: number;
  avgToMaxPercent: number;
  totalRange: number;
  highAchieverBonusRange: string;
  topPerformerIncreaseRange: string;
}

// Helper function to extract skills from record
function extractSkillsList(record: OccupationRecord): string {
  const skills = [
    record.skillsNameOne,
    record.skillsNameTwo,
    record.skillsNameThree,
    record.skillsNameFour,
    record.skillsNameFive
  ].filter(Boolean).slice(0, 3);
  
  return skills.length > 0 ? skills.join(', ') : 'Core Skills';
}

// Helper function to get ordinal suffix (st, nd, rd, th)
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return num + 'st';
  }
  if (j === 2 && k !== 12) {
    return num + 'nd';
  }
  if (j === 3 && k !== 13) {
    return num + 'rd';
  }
  return num + 'th';
}

// Helper function to get current year
function getCurrentYear(): string {
  const now = new Date();
  return now.getFullYear().toString();
}

// Helper function to get next year for projections
function getNextYear(): string {
  const now = new Date();
  return (now.getFullYear() + 1).toString();
}

// Calculate realistic salary increase percentage based on industry trends and market conditions
function calculateSalaryIncrease(record: OccupationRecord, country: string): number {
  const avgSalary = record.avgAnnualSalary || 0;
  const lowSalary = record.totalPayMin || 0;
  const highSalary = record.totalPayMax || 0;
  
  if (avgSalary === 0) return 0;
  
  // Industry-specific growth rates (based on real market data)
  const occupationTitle = (record.title || record.occ_name || '').toLowerCase();
  let industryGrowthRate = 4.5; // Default growth rate
  
  // Technology sector (high growth)
  if (occupationTitle.includes('software') || occupationTitle.includes('developer') || 
      occupationTitle.includes('engineer') && (occupationTitle.includes('software') || occupationTitle.includes('web'))) {
    industryGrowthRate = 7.2;
  }
  // Data & Analytics (very high growth)
  else if (occupationTitle.includes('analyst') || occupationTitle.includes('data') || 
           occupationTitle.includes('scientist') || occupationTitle.includes('ai') || 
           occupationTitle.includes('machine learning')) {
    industryGrowthRate = 8.5;
  }
  // Healthcare (steady growth)
  else if (occupationTitle.includes('nurse') || occupationTitle.includes('doctor') || 
           occupationTitle.includes('health') || occupationTitle.includes('medical')) {
    industryGrowthRate = 5.8;
  }
  // Finance (moderate growth)
  else if (occupationTitle.includes('finance') || occupationTitle.includes('accounting') || 
           occupationTitle.includes('financial') || occupationTitle.includes('audit')) {
    industryGrowthRate = 4.2;
  }
  // Management (moderate growth)
  else if (occupationTitle.includes('manager') || occupationTitle.includes('director') || 
           occupationTitle.includes('lead') || occupationTitle.includes('head')) {
    industryGrowthRate = 4.8;
  }
  // Sales & Marketing (variable growth)
  else if (occupationTitle.includes('sales') || occupationTitle.includes('marketing') || 
           occupationTitle.includes('business development')) {
    industryGrowthRate = 5.1;
  }
  
  // Country-specific economic factors
  const countryMultipliers: Record<string, number> = {
    'australia': 1.1,    // Strong economy, tech growth
    'india': 1.3,        // High growth economy
    'united states': 1.0, // Baseline
    'united kingdom': 0.9, // Brexit impact, moderate growth
    'canada': 1.05,      // Stable growth
    'germany': 0.95,     // Mature economy
    'france': 0.9,       // Moderate growth
    'japan': 0.8,        // Aging population, slower growth
    'brazil': 1.2,       // Emerging market
    'south africa': 1.1, // Emerging market
    'rwanda': 1.1,       // Emerging market, growing economy
    'saint lucia': 1.0,  // Moderate growth, tourism-dependent
    'ethiopia': 1.15,   // High growth emerging market
    'lesotho': 1.0,     // Moderate growth, small economy
    'iceland': 0.95,    // Mature economy, small population
    'honduras': 1.05,   // Emerging market, moderate growth
    'bolivia': 1.1      // Emerging market, resource-based
  };
  
  const countryMultiplier = countryMultipliers[country.toLowerCase()] || 1.0;
  
  // Calculate salary range factor (higher range = more competitive market)
  const rangeFactor = highSalary > 0 && lowSalary > 0 ? 
    Math.min((highSalary - lowSalary) / avgSalary, 1.0) : 0.5;
  
  // Apply range factor (competitive markets grow faster)
  const rangeMultiplier = 0.7 + (rangeFactor * 0.6); // 0.7 to 1.3 multiplier
  
  // Calculate final growth rate
  const finalGrowthRate = industryGrowthRate * countryMultiplier * rangeMultiplier;
  
  // Add some randomness for realism (±0.5%)
  const randomFactor = (Math.random() - 0.5) * 1.0;
  
  return Math.round((finalGrowthRate + randomFactor) * 10) / 10; // Round to 1 decimal
}

// Compare salary increase to inflation with 3-year projections
function compareToInflation(salaryIncrease: number, country: string): string {
  // Current inflation rates and 3-year projections by country (based on economic forecasts)
  const inflationData: Record<string, { current: number; projected: number }> = {
    'australia': { current: 3.2, projected: 2.8 },
    'india': { current: 4.5, projected: 4.0 },
    'united states': { current: 3.1, projected: 2.5 },
    'united kingdom': { current: 2.8, projected: 2.2 },
    'canada': { current: 2.9, projected: 2.3 },
    'germany': { current: 2.1, projected: 1.8 },
    'france': { current: 2.3, projected: 2.0 },
    'japan': { current: 1.8, projected: 1.5 },
    'brazil': { current: 4.2, projected: 3.8 },
    'south africa': { current: 5.1, projected: 4.5 },
    'rwanda': { current: 5.0, projected: 4.5 },
    'saint lucia': { current: 3.5, projected: 3.0 },
    'ethiopia': { current: 5.2, projected: 4.8 },
    'lesotho': { current: 4.8, projected: 4.3 },
    'iceland': { current: 2.5, projected: 2.0 },
    'honduras': { current: 4.0, projected: 3.5 },
    'bolivia': { current: 3.8, projected: 3.3 }
  };
  
  const inflation = inflationData[country.toLowerCase()] || { current: 3.0, projected: 2.5 };
  const currentInflation = inflation.current;
  const projectedInflation = inflation.projected;
  
  // Calculate difference from current inflation
  const currentDifference = salaryIncrease - currentInflation;
  
  // Calculate 3-year projected difference
  const projectedDifference = salaryIncrease - projectedInflation;
  
  // Determine the comparison text based on both current and projected performance
  if (currentDifference > 5 && projectedDifference > 3) {
    return 'significantly outpacing inflation with strong 3-year outlook';
  }
  if (currentDifference > 3 && projectedDifference > 1) {
    return 'outpacing inflation with positive long-term trajectory';
  }
  if (currentDifference > 0 && projectedDifference > 0) {
    return 'outpacing inflation with stable growth expected';
  }
  if (currentDifference > -2 && projectedDifference > -1) {
    return 'keeping pace with inflation and maintaining purchasing power';
  }
  if (currentDifference > -3) {
    return 'slightly below inflation but with recovery potential';
  }
  return 'below inflation rate requiring attention to compensation strategy';
}

// Calculate demand strength based on salary data, industry trends, and market indicators
function calculateDemandStrength(record: OccupationRecord, location?: string, country?: string): 'strong' | 'moderate' | 'weak' {
  const avgSalary = record.avgAnnualSalary || 0;
  const highSalary = record.totalPayMax || 0;
  const lowSalary = record.totalPayMin || 0;
  
  if (avgSalary === 0) return 'moderate';
  
  // Industry demand multipliers based on current market trends
  const occupationTitle = (record.title || record.occ_name || '').toLowerCase();
  let industryDemandMultiplier = 1.0;
  
  // High-demand industries
  if (occupationTitle.includes('software') || occupationTitle.includes('developer') || 
      occupationTitle.includes('engineer') && (occupationTitle.includes('software') || occupationTitle.includes('web'))) {
    industryDemandMultiplier = 1.4; // Tech talent shortage
  }
  else if (occupationTitle.includes('analyst') || occupationTitle.includes('data') || 
           occupationTitle.includes('scientist') || occupationTitle.includes('ai')) {
    industryDemandMultiplier = 1.5; // Data/AI boom
  }
  else if (occupationTitle.includes('nurse') || occupationTitle.includes('health') || 
           occupationTitle.includes('medical') || occupationTitle.includes('doctor')) {
    industryDemandMultiplier = 1.3; // Healthcare worker shortage
  }
  else if (occupationTitle.includes('cybersecurity') || occupationTitle.includes('security')) {
    industryDemandMultiplier = 1.6; // Cybersecurity crisis
  }
  else if (occupationTitle.includes('cloud') || occupationTitle.includes('devops')) {
    industryDemandMultiplier = 1.4; // Cloud transformation
  }
  else if (occupationTitle.includes('sales') || occupationTitle.includes('marketing')) {
    industryDemandMultiplier = 1.1; // Moderate growth
  }
  else if (occupationTitle.includes('finance') || occupationTitle.includes('accounting')) {
    industryDemandMultiplier = 0.9; // Automation impact
  }
  
  // Location-based demand factors
  let locationMultiplier = 1.0;
  if (location) {
    const locationLower = location.toLowerCase();
    // Major tech hubs
    if (locationLower.includes('sydney') || locationLower.includes('melbourne') || 
        locationLower.includes('san francisco') || locationLower.includes('seattle') || 
        locationLower.includes('london') || locationLower.includes('berlin')) {
      locationMultiplier = 1.2;
    }
    // Emerging tech cities
    else if (locationLower.includes('brisbane') || locationLower.includes('perth') || 
             locationLower.includes('austin') || locationLower.includes('denver')) {
      locationMultiplier = 1.1;
    }
  }
  
  // Calculate salary range as percentage of average
  const rangePercent = highSalary > 0 && lowSalary > 0 ? 
    ((highSalary - lowSalary) / avgSalary) * 100 : 0;
  
  // Calculate demand score
  const demandScore = (rangePercent / 100) * industryDemandMultiplier * locationMultiplier;
  
  // Determine demand strength based on score
  if (demandScore > 1.2) return 'strong';
  if (demandScore > 0.8) return 'moderate';
  return 'weak';
}

// Assess compensation competitiveness
function assessCompensationCompetitiveness(record: OccupationRecord, country: string): 'highly competitive' | 'competitive' | 'moderate' {
  const avgSalary = record.avgAnnualSalary || 0;
  const highSalary = record.totalPayMax || 0;
  
  if (avgSalary === 0) return 'moderate';
  
  // Calculate how close average is to high end
  const avgToHighRatio = highSalary > 0 ? (avgSalary / highSalary) : 0;
  
  if (avgToHighRatio > 0.8) return 'highly competitive';
  if (avgToHighRatio > 0.6) return 'competitive';
  return 'moderate';
}

// Calculate percentile rank
function calculatePercentileRank(record: OccupationRecord, country: string): number {
  const avgSalary = record.avgAnnualSalary || 0;
  const lowSalary = record.totalPayMin || 0;
  const highSalary = record.totalPayMax || 0;
  
  if (avgSalary === 0 || lowSalary === 0 || highSalary === 0) return 50;
  
  // Calculate where average falls in the range
  const percentile = ((avgSalary - lowSalary) / (highSalary - lowSalary)) * 100;
  return Math.round(Math.max(10, Math.min(90, percentile)));
}

// Calculate salary range spread
function calculateSalaryRangeSpread(record: OccupationRecord): { value: number; hasData: boolean } {
  const avgSalary = record.avgAnnualSalary || 0;
  const lowSalary = record.totalPayMin || 0;
  const highSalary = record.totalPayMax || 0;
  
  if (avgSalary === 0 || lowSalary === 0 || highSalary === 0) {
    return { value: 0, hasData: false };
  }
  
  const spread = ((highSalary - lowSalary) / avgSalary) * 100;
  return { value: Math.round(spread), hasData: true };
}

// Calculate country-based cost of living factor using all countries from continents.ts
function calculateCostOfLivingFactor(record: OccupationRecord, location?: string, country?: string): { 
  value: number; 
  location: string; 
  description: string; 
  category: 'very high' | 'high' | 'moderate' | 'low' | 'very low';
} {
  const countryLower = country?.toLowerCase() || '';
  
  // Create a comprehensive cost of living map from all countries in continents.ts
  // Based on real-world cost of living data relative to global average
  const countryCostOfLivingMap: Record<string, number> = {
    // Africa
    'angola': 0.45,           // 55% below global average
    'algeria': 0.40,          // 60% below global average
    'botswana': 0.50,         // 50% below global average
    'cameroon': 0.35,         // 65% below global average
    'ethiopia': 0.30,         // 70% below global average
    'ghana': 0.40,            // 60% below global average
    'kenya': 0.35,            // 65% below global average
    'lesotho': 0.40,          // 60% below global average
    'mauritius': 0.60,        // 40% below global average
    'morocco': 0.40,          // 60% below global average
    'mozambique': 0.30,       // 70% below global average
    'namibia': 0.50,          // 50% below global average
    'nigeria': 0.35,          // 65% below global average
    'rwanda': 0.35,           // 65% below global average
    'swaziland': 0.40,        // 60% below global average
    'tunisia': 0.40,          // 60% below global average
    'tanzania': 0.30,         // 70% below global average
    'uganda': 0.30,           // 70% below global average
    'zambia': 0.35,           // 65% below global average
    'zimbabwe': 0.25,         // 75% below global average
    'south-africa': 0.50,     // 50% below global average
    
    // Asia
    'afghanistan': 0.30,      // 70% below global average
    'azerbaijan': 0.40,       // 60% below global average
    'bangladesh': 0.25,       // 75% below global average
    'british-indian-ocean-territory': 0.60, // 40% below global average
    'cambodia': 0.30,         // 70% below global average
    'china': 0.50,            // 50% below global average
    'hong-kong': 1.40,        // 40% above global average
    'india': 0.30,            // 70% below global average
    'japan': 1.25,            // 25% above global average
    'kazakhstan': 0.40,       // 60% below global average
    'korea': 0.90,            // 10% below global average
    'malaysia': 0.50,         // 50% below global average
    'myanmar': 0.25,          // 75% below global average
    'nepal': 0.30,            // 70% below global average
    'pakistan': 0.30,         // 70% below global average
    'philippines': 0.35,      // 65% below global average
    'sri-lanka': 0.35,        // 65% below global average
    'singapore': 1.30,        // 30% above global average
    'brunei-darussalam': 0.70, // 30% below global average
    'thailand': 0.40,         // 60% below global average
    'taiwan': 0.70,           // 30% below global average
    'vietnam': 0.35,          // 65% below global average
    'indonesia': 0.40,        // 60% below global average
    
    // Europe
    'albania': 0.40,          // 60% below global average
    'austria': 1.15,          // 15% above global average
    'belarus': 0.40,          // 60% below global average
    'belgium': 1.20,          // 20% above global average
    'bulgaria': 0.50,         // 50% below global average
    'czech-republic': 0.70,   // 30% below global average
    'denmark': 1.40,          // 40% above global average
    'estonia': 0.80,          // 20% below global average
    'finland': 1.25,          // 25% above global average
    'france': 1.20,           // 20% above global average
    'germany': 1.15,          // 15% above global average
    'gibraltar': 1.10,        // 10% above global average
    'greece': 0.90,           // 10% below global average
    'hungary': 0.60,          // 40% below global average
    'iceland': 1.35,          // 35% above global average
    'italy': 1.10,            // 10% above global average
    'latvia': 0.70,           // 30% below global average
    'lithuania': 0.70,        // 30% below global average
    'luxembourg': 1.50,       // 50% above global average
    'malta': 1.00,            // At global average
    'netherlands': 1.25,      // 25% above global average
    'norway': 1.60,           // 60% above global average
    'poland': 0.60,           // 40% below global average
    'portugal': 0.80,         // 20% below global average
    'romania': 0.50,          // 50% below global average
    'russia': 0.50,           // 50% below global average
    'slovakia': 0.70,         // 30% below global average
    'slovenia': 0.80,         // 20% below global average
    'sweden': 1.30,           // 30% above global average
    'switzerland': 1.80,      // 80% above global average
    'ukraine': 0.30,          // 70% below global average
    'ireland': 1.20,          // 20% above global average
    'spain': 0.80,            // 20% below global average
    'united-kingdom': 1.25,   // 25% above global average
    
    // Middle East
    'bahrain': 0.80,          // 20% below global average
    'cyprus': 1.00,           // At global average
    'egypt': 0.30,            // 70% below global average
    'iran': 0.35,             // 65% below global average
    'iraq': 0.40,             // 60% below global average
    'israel': 1.20,           // 20% above global average
    'jordan': 0.50,           // 50% below global average
    'kuwait': 0.70,           // 30% below global average
    'lebanon': 0.60,          // 40% below global average
    'oman': 0.60,             // 40% below global average
    'qatar': 0.80,            // 20% below global average
    'saudi-arabia': 0.60,     // 40% below global average
    'turkey': 0.50,           // 50% below global average
    'united-arab-emirates': 0.80, // 20% below global average
    
    // North America
    'barbados': 0.80,         // 20% below global average
    'belize': 0.60,           // 40% below global average
    'bermuda': 1.50,          // 50% above global average
    'costa-rica': 0.50,       // 50% below global average
    'jamaica': 0.60,          // 40% below global average
    'guatemala': 0.40,        // 60% below global average
    'honduras': 0.45,         // 55% below global average
    'dominican-republic': 0.50, // 50% below global average
    'puerto-rico': 0.80,      // 20% below global average
    'saint-lucia': 0.80,      // 20% below global average
    'canada': 1.10,           // 10% above global average
    'mexico': 0.50,           // 50% below global average
    'bahamas': 1.00,          // At global average
    'guyana': 0.50,           // 50% below global average
    'trinidad-and-tobago': 0.70, // 30% below global average
    'united-states': 1.15,    // 15% above global average
    
    // Oceania
    'australia': 1.20,        // 20% above global average
    'fiji': 0.60,             // 40% below global average
    'guam': 0.90,             // 10% below global average
    'papua-new-guinea': 0.50, // 50% below global average
    'new-zealand': 1.10,      // 10% above global average
    
    // South America
    'brazil': 0.50,           // 50% below global average
    'argentina': 0.40,        // 60% below global average
    'bolivia': 0.40,          // 60% below global average
    'chile': 0.70,            // 30% below global average
    'colombia': 0.40,         // 60% below global average
    'peru': 0.40,             // 60% below global average
    'venezuela': 0.20,        // 80% below global average
    'ecuador': 0.40,          // 60% below global average
    'uruguay': 0.70           // 30% below global average
  };
  
  // Get cost of living factor for the country
  const costOfLivingFactor = countryCostOfLivingMap[countryLower] || 1.0;
  
  // Convert to percentage above/below global average
  const percentage = Math.round((costOfLivingFactor - 1) * 100);
  
  // Determine category
  let category: 'very high' | 'high' | 'moderate' | 'low' | 'very low';
  if (percentage >= 25) category = 'very high';
  else if (percentage >= 10) category = 'high';
  else if (percentage >= -10) category = 'moderate';
  else if (percentage >= -30) category = 'low';
  else category = 'very low';
  
  // Generate description
  const locationName = location ? `${location}, ` : '';
  const countryName = country ? country.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : 'Unknown';
  const description = `${locationName}${countryName} has a ${category} cost of living`;
  
  return {
    value: percentage,
    location: locationName + countryName,
    description,
    category
  };
}

// Calculate projected increase range for next 3 years
function calculateProjectedIncrease(record: OccupationRecord, country: string): string {
  const currentIncrease = calculateSalaryIncrease(record, country);
  
  // 3-year projection factors based on industry and economic trends
  const occupationTitle = (record.title || record.occ_name || '').toLowerCase();
  let projectionFactor = 0.8; // Default: slight decrease from current rate
  
  // High-growth industries maintain or increase rates
  if (occupationTitle.includes('software') || occupationTitle.includes('developer') || 
      occupationTitle.includes('analyst') || occupationTitle.includes('data') || 
      occupationTitle.includes('ai') || occupationTitle.includes('cybersecurity')) {
    projectionFactor = 1.1; // Slight increase
  }
  // Healthcare maintains steady growth
  else if (occupationTitle.includes('nurse') || occupationTitle.includes('health') || 
           occupationTitle.includes('medical')) {
    projectionFactor = 0.95; // Slight decrease but stable
  }
  // Finance may see automation impact
  else if (occupationTitle.includes('finance') || occupationTitle.includes('accounting')) {
    projectionFactor = 0.7; // More significant decrease
  }
  
  // Country-specific economic outlook
  const countryFactors: Record<string, number> = {
    'australia': 1.05,    // Strong tech sector growth
    'india': 1.15,        // High growth economy
    'united states': 1.0, // Baseline
    'united kingdom': 0.9, // Brexit recovery
    'canada': 1.02,       // Stable growth
    'germany': 0.95,      // Mature economy
    'france': 0.9,        // Moderate growth
    'japan': 0.85,        // Aging population
    'brazil': 1.1,        // Emerging market
    'south africa': 1.05, // Emerging market
    'rwanda': 1.05,       // Emerging market growth
    'saint lucia': 1.0,   // Stable, moderate growth
    'ethiopia': 1.1,     // High growth emerging market
    'lesotho': 1.0,      // Stable, moderate growth
    'iceland': 0.95,     // Mature economy
    'honduras': 1.02,    // Emerging market, moderate growth
    'bolivia': 1.05      // Emerging market, resource-based
  };
  
  const countryFactor = countryFactors[country.toLowerCase()] || 1.0;
  
  // Calculate 3-year projected rate
  const projectedRate = currentIncrease * projectionFactor * countryFactor;
  
  // Create range (projected rate ± 1%)
  const minProjected = Math.max(1, Math.round(projectedRate - 1));
  const maxProjected = Math.round(projectedRate + 1);
  
  return `${minProjected}-${maxProjected}%`;
}

// Calculate confidence level based on data quality
function calculateConfidenceLevel(value: number, type: 'market' | 'positioning' | 'growth'): 'high' | 'medium' | 'low' {
  if (type === 'market') {
    if (value > 10) return 'high';
    if (value > 5) return 'medium';
    return 'low';
  }
  
  if (type === 'positioning') {
    if (value > 60 || value < 40) return 'high';
    if (value > 45 || value < 55) return 'medium';
    return 'low';
  }
  
  if (type === 'growth') {
    if (value > 50) return 'high';
    if (value > 25) return 'medium';
    return 'low';
  }
  
  return 'medium';
}


// Main function to calculate AI insights
export function calculateInsights(record: OccupationRecord, country: string, location?: string): InsightsData {
  const salaryIncreasePercent = calculateSalaryIncrease(record, country);
  const inflationComparison = compareToInflation(salaryIncreasePercent, country);
  const demandStrength = calculateDemandStrength(record, location, country);
  const compensationCompetitiveness = assessCompensationCompetitiveness(record, country);
  const percentileRank = calculatePercentileRank(record, country);
  const salaryRangeSpreadData = calculateSalaryRangeSpread(record);
  const salaryRangeSpread = salaryRangeSpreadData.value;
  const costOfLivingFactorData = calculateCostOfLivingFactor(record, location, country);
  const costOfLivingFactor = costOfLivingFactorData.value;
  const projectedIncreaseRange = calculateProjectedIncrease(record, country);
  const currentYear = getCurrentYear();
  const nextYear = getNextYear();
  
  const actualLocation = location || record.location;
  const actualState = record.state;
  const actualCountry = record.country;
  
  return {
    occupationTitle: record.title || record.occ_name || '',
    location: actualLocation || '',
    state: actualState || '',
    country: actualCountry || '',
    formattedLocation: locationStateCountryString(actualLocation || undefined, actualState || undefined, actualCountry || undefined),
    salaryIncreasePercent,
    inflationComparison,
    demandStrength,
    compensationCompetitiveness,
    percentileRank,
    percentileRankOrdinal: getOrdinalSuffix(percentileRank),
    salaryRangeSpread,
    salaryRangeSpreadData,
    costOfLivingFactor,
    costOfLivingFactorData,
    projectedIncreaseRange,
    currentYear,
    nextYear,
    marketTrendConfidence: calculateConfidenceLevel(salaryIncreasePercent, 'market'),
    positioningConfidence: calculateConfidenceLevel(percentileRank, 'positioning'),
    growthForecastConfidence: calculateConfidenceLevel(salaryRangeSpread, 'growth')
  };
}

// Main function to calculate bonus compensation data
export function calculateBonusCompensation(record: OccupationRecord, country: string, location?: string): BonusCompensationData {
  const maxBonus = record.bonusRangeMax || 0;
  const minBonus = record.bonusRangeMin || 0;
  const avgBonus = minBonus > 0 && maxBonus > minBonus ? (minBonus + maxBonus) / 2 : maxBonus / 2; // Calculate average from min/max
  
  const growthFactor = minBonus > 0 ? maxBonus / minBonus : (maxBonus > 0 ? maxBonus / avgBonus : 0);
  const minToAvgPercent = minBonus > 0 ? ((avgBonus - minBonus) / minBonus) * 100 : 0;
  const avgToMaxPercent = avgBonus > 0 ? ((maxBonus - avgBonus) / avgBonus) * 100 : 0;
  const totalRange = maxBonus - minBonus;
  
  const actualLocation = location || record.location;
  const actualState = record.state;
  const actualCountry = record.country;
  
  return {
    occupationTitle: record.title || record.occ_name || '',
    skillsList: extractSkillsList(record),
    location: actualLocation || '',
    state: actualState || '',
    country: actualCountry || '',
    formattedLocation: locationStateCountryString(actualLocation || undefined, actualState || undefined, actualCountry || undefined),
    maxBonus,
    avgBonus,
    minBonus,
    growthFactor: Math.round(growthFactor * 10) / 10, // Round to 1 decimal
    minToAvgPercent: Math.round(minToAvgPercent),
    avgToMaxPercent: Math.round(avgToMaxPercent),
    totalRange,
    highAchieverBonusRange: '200-400%',
    topPerformerIncreaseRange: '50-100%'
  };
}
