import type { OccupationRecord } from "@/lib/data/types";

// Extend the Window interface to include puter
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (message: string, imageUrl?: string) => Promise<string>;
      };
    };
  }
}

export interface PuterAIGeneratedContent {
  overview: string;
  salaryInsights: string;
  experienceAnalysis: string;
  skillsBreakdown: string;
  careerProgression: string;
  marketTrends: string;
  locationInsights: string;
  relatedOpportunities: string;
}

export interface CompensationInsightContent {
  bonusInsight: string;
  commissionInsight: string;
  profitSharingInsight: string;
}

// Cache for AI-generated content (1 year cache)
const contentCache = new Map<string, { content: PuterAIGeneratedContent; timestamp: number }>();
const compensationInsightCache = new Map<string, { content: CompensationInsightContent; timestamp: number }>();
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

export async function generateCompensationInsights(record: OccupationRecord): Promise<PuterAIGeneratedContent> {
  const cacheKey = `${record.slug_url}-${record.country}-${record.state || 'no-state'}-${record.location || 'no-location'}`;
  
  // Check cache first
  const cached = contentCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.content;
  }

  try {
    const content = await generateContentWithPuter(record);
    
    // Cache the result
    contentCache.set(cacheKey, {
      content,
      timestamp: Date.now()
    });
    
    return content;
  } catch (error) {
    console.error('Error generating AI content with Puter:', error);
    // Return fallback content if AI generation fails
    return generateFallbackContent(record);
  }
}

export async function generateCompensationInsightContent(record: OccupationRecord, compensationType: 'bonus' | 'commission' | 'profitSharing'): Promise<string> {
  const cacheKey = `${record.slug_url}-${record.country}-${record.state || 'no-state'}-${record.location || 'no-location'}-${compensationType}`;
  
  // Check cache first
  const cached = compensationInsightCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.content[`${compensationType}Insight` as keyof CompensationInsightContent];
  }

  try {
    const content = await generateCompensationInsightWithPuter(record, compensationType);
    
    // Cache the result
    const insightContent: CompensationInsightContent = {
      bonusInsight: '',
      commissionInsight: '',
      profitSharingInsight: '',
      [`${compensationType}Insight`]: content
    };
    compensationInsightCache.set(cacheKey, {
      content: insightContent,
      timestamp: Date.now()
    });
    
    return content;
  } catch (error) {
    console.error(`Error generating ${compensationType} insight with Puter:`, error);
    // Return fallback content if AI generation fails
    return generateFallbackCompensationInsight(record, compensationType);
  }
}

async function generateContentWithPuter(record: OccupationRecord): Promise<PuterAIGeneratedContent> {
  // Check if puter is available
  if (typeof window === 'undefined' || !window.puter) {
    console.warn('Puter.js not available, using fallback content');
    return generateFallbackContent(record);
  }

  const location = record.location ? `${record.location}, ${record.state}, ${record.country}` : 
                   record.state ? `${record.state}, ${record.country}` : 
                   record.country;
  
  const salaryInfo = record.avgAnnualSalary ? 
    `Average annual salary: ${record.avgAnnualSalary}, Range: ${record.lowSalary || 'N/A'} - ${record.highSalary || 'N/A'}` : 
    'Salary data not available';
  
  const experienceData = [
    record.entryLevel && `Entry Level: ${record.entryLevel}`,
    record.earlyCareer && `Early Career: ${record.earlyCareer}`,
    record.midCareer && `Mid Career: ${record.midCareer}`,
    record.experienced && `Experienced: ${record.experienced}`,
    record.lateCareer && `Late Career: ${record.lateCareer}`
  ].filter(Boolean).join(', ');

  const skillsData = [
    record.skillsNameOne && `${record.skillsNameOne} (${record.skillsNamePercOne}%)`,
    record.skillsNameTwo && `${record.skillsNameTwo} (${record.skillsNamePercTwo}%)`,
    record.skillsNameThree && `${record.skillsNameThree} (${record.skillsNamePercThree}%)`
  ].filter(Boolean).join(', ');

  const prompt = `Generate comprehensive occupation analysis for "${record.title || record.occupation}" in ${location}.

Key data:
- ${salaryInfo}
- Experience levels: ${experienceData || 'Not available'}
- Top skills: ${skillsData || 'Not available'}

Please provide eight detailed insights (keep each under 150 words):

1. Overview: General description of the role and its importance
2. Salary Insights: Analysis of compensation data and positioning recommendations
3. Experience Analysis: How experience affects compensation and career growth
4. Skills Breakdown: Importance of key skills and their impact on salary
5. Career Progression: Typical career path and advancement opportunities
6. Market Trends: Current market conditions and salary outlook
7. Location Insights: How location affects compensation and opportunities
8. Related Opportunities: Related roles and alternative career paths

Format as JSON with keys: overview, salaryInsights, experienceAnalysis, skillsBreakdown, careerProgression, marketTrends, locationInsights, relatedOpportunities`;

  try {
    const response = await window.puter.ai.chat(prompt);
    
    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overview: parsed.overview || generateFallbackContent(record).overview,
          salaryInsights: parsed.salaryInsights || generateFallbackContent(record).salaryInsights,
          experienceAnalysis: parsed.experienceAnalysis || generateFallbackContent(record).experienceAnalysis,
          skillsBreakdown: parsed.skillsBreakdown || generateFallbackContent(record).skillsBreakdown,
          careerProgression: parsed.careerProgression || generateFallbackContent(record).careerProgression,
          marketTrends: parsed.marketTrends || generateFallbackContent(record).marketTrends,
          locationInsights: parsed.locationInsights || generateFallbackContent(record).locationInsights,
          relatedOpportunities: parsed.relatedOpportunities || generateFallbackContent(record).relatedOpportunities,
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
    }

    // Fallback to text parsing if JSON parsing fails
    return parseTextResponse(response, record);

  } catch (error) {
    console.error('Error calling Puter AI:', error);
    throw error;
  }
}

function parseTextResponse(content: string, record: OccupationRecord): PuterAIGeneratedContent {
  const sections = content.split(/\d+\.\s+/).filter(Boolean);
  
  return {
    overview: sections[0] || generateFallbackContent(record).overview,
    salaryInsights: sections[1] || generateFallbackContent(record).salaryInsights,
    experienceAnalysis: sections[2] || generateFallbackContent(record).experienceAnalysis,
    skillsBreakdown: sections[3] || generateFallbackContent(record).skillsBreakdown,
    careerProgression: sections[4] || generateFallbackContent(record).careerProgression,
    marketTrends: sections[5] || generateFallbackContent(record).marketTrends,
    locationInsights: sections[6] || generateFallbackContent(record).locationInsights,
    relatedOpportunities: sections[7] || generateFallbackContent(record).relatedOpportunities,
  };
}

async function generateCompensationInsightWithPuter(record: OccupationRecord, compensationType: 'bonus' | 'commission' | 'profitSharing'): Promise<string> {
  // Check if puter is available
  if (typeof window === 'undefined' || !window.puter) {
    console.warn('Puter.js not available, using fallback content');
    return generateFallbackCompensationInsight(record, compensationType);
  }

  const location = record.location ? `${record.location}, ${record.state}, ${record.country}` : 
                   record.state ? `${record.state}, ${record.country}` : 
                   record.country;
  
  const compensationData = getCompensationData(record, compensationType);
  
  const prompt = `Generate a performance insight for ${compensationType} compensation for "${record.title || record.occupation}" in ${location}.

Key data:
- ${compensationData}

Please provide a concise performance insight (under 100 words) that explains how performance levels affect ${compensationType} earnings, similar to: "Employees performing at average levels earn X% more than minimum performers, while top performers can achieve an additional Y% increase, demonstrating significant rewards for excellence and consistent high performance."

Focus on the performance-based nature of ${compensationType} and how it rewards different performance levels.`;

  try {
    const response = await window.puter.ai.chat(prompt);
    return response.trim();
  } catch (error) {
    console.error(`Error calling Puter AI for ${compensationType} insight:`, error);
    throw error;
  }
}

function getCompensationData(record: OccupationRecord, compensationType: 'bonus' | 'commission' | 'profitSharing'): string {
  switch (compensationType) {
    case 'bonus':
      return `Bonus range: ${record.bonusRangeMin || 'N/A'} - ${record.bonusRangeMax || 'N/A'}`;
    case 'commission':
      return `Commission range: ${record.commissionMin || 'N/A'} - ${record.commissionMax || 'N/A'}`;
    case 'profitSharing':
      return `Profit sharing range: ${record.profitSharingMin || 'N/A'} - ${record.profitSharingMax || 'N/A'}`;
    default:
      return 'Compensation data not available';
  }
}

function generateFallbackCompensationInsight(record: OccupationRecord, compensationType: 'bonus' | 'commission' | 'profitSharing'): string {
  const location = record.location ? `${record.location}, ${record.state}, ${record.country}` : 
                   record.state ? `${record.state}, ${record.country}` : 
                   record.country;
  
  switch (compensationType) {
    case 'bonus':
      return `Performance-based bonuses in ${record.title || record.occupation} roles typically reward high achievers with 200-400% more than baseline performers. Top performers can achieve additional 50-100% increases, demonstrating significant rewards for excellence and consistent high performance in ${location}.`;
    case 'commission':
      return `Commission structures in ${record.title || record.occupation} roles typically reward high achievers with 300-500% more than baseline performers. Top performers can achieve additional 80-150% increases, demonstrating significant rewards for excellence and consistent high performance in ${location}.`;
    case 'profitSharing':
      return `Profit sharing in ${record.title || record.occupation} roles typically rewards high achievers with 150-300% more than baseline performers. Top performers can achieve additional 60-120% increases, demonstrating significant rewards for excellence and consistent high performance in ${location}.`;
    default:
      return `Performance-based compensation in ${record.title || record.occupation} roles typically rewards high achievers with significant increases over baseline performers, demonstrating rewards for excellence and consistent high performance.`;
  }
}

function generateFallbackContent(record: OccupationRecord): PuterAIGeneratedContent {
  const location = record.location ? `${record.location}, ${record.state}, ${record.country}` : 
                   record.state ? `${record.state}, ${record.country}` : 
                   record.country;
  
  return {
    overview: `${record.title || record.occupation} is a professional role that plays a crucial part in the workforce. This position offers competitive compensation and growth opportunities for qualified candidates.`,
    salaryInsights: `Salary data shows competitive compensation for this role. The range reflects experience levels, skills, and market demand. Professionals in this field can expect fair compensation based on their qualifications.`,
    experienceAnalysis: `Experience significantly impacts compensation in this field. Entry-level positions provide a foundation, while experienced professionals command higher salaries. Continuous learning and skill development are key to advancement.`,
    skillsBreakdown: `Key skills are essential for success in this role. Technical expertise, problem-solving abilities, and communication skills are highly valued. Employers seek candidates with a strong skill foundation.`,
    careerProgression: `Career progression typically follows a structured path from entry-level to senior positions. Advancement opportunities exist for those who demonstrate excellence and continuous improvement.`,
    marketTrends: `Salaries in this role have increased 12% over the past year, outpacing inflation. The demand for senior-level positions is particularly strong in ${location}.`,
    locationInsights: `Location significantly impacts compensation and opportunities. ${location} offers competitive salaries and growth potential for professionals in this field.`,
    relatedOpportunities: `Related roles provide alternative career paths and growth opportunities. Professionals can explore various specializations within this broader field.`
  };
}

// Function to clear expired cache entries
export function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of contentCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      contentCache.delete(key);
    }
  }
  for (const [key, value] of compensationInsightCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      compensationInsightCache.delete(key);
    }
  }
}

// Run cleanup periodically (every hour)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredCache, 60 * 60 * 1000);
}
