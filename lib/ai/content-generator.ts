import Together from "together-ai";
import type { OccupationRecord } from "@/lib/data/types";
import { AI_CONFIG } from "./config";

// Initialize Together AI client
const together = new Together();

// Rate limiting configuration
const RATE_LIMIT = {
  REQUESTS_PER_MINUTE: 0.6, // Together AI free tier limit
  MIN_DELAY_MS: 100000, // 100 seconds between requests (1000ms * 60 / 0.6)
  MAX_RETRIES: 3,
  BASE_DELAY_MS: 1000,
  TOKENS_PER_MINUTE: 45000, // Together AI free tier token limit
  TOKEN_RESET_INTERVAL: 60 * 1000, // 1 minute in milliseconds
};

// Request queue and rate limiting
let lastRequestTime = 0;
let tokenUsage = 0;
let lastTokenReset = Date.now();
let requestQueue: Array<{
  resolve: (value: AIGeneratedContent) => void;
  reject: (error: Error) => void;
  record: OccupationRecord;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
}> = [];
let isProcessingQueue = false;

// Circuit breaker for rate limit protection
let consecutiveRateLimitErrors = 0;
let circuitBreakerOpen = false;
let circuitBreakerOpenTime = 0;
const CIRCUIT_BREAKER_THRESHOLD = 3; // Open after 3 consecutive rate limit errors
const CIRCUIT_BREAKER_TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout

export interface AIGeneratedContent {
  overview: string;
  salaryInsights: string;
  experienceAnalysis: string;
  skillsBreakdown: string;
  careerProgression: string;
  marketTrends: string;
  locationInsights: string;
  relatedOpportunities: string;
}

export interface ContentSection {
  title: string;
  content: string;
  type: 'overview' | 'insights' | 'analysis' | 'breakdown';
}

// Cache for AI-generated content (1 year cache)
const contentCache = new Map<string, { content: AIGeneratedContent; timestamp: number }>();
const CACHE_DURATION = AI_CONFIG.CACHE_DURATION;

export async function generateOccupationContent(record: OccupationRecord, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<AIGeneratedContent> {
  const cacheKey = `${record.slug_url}-${record.country}-${record.state || 'no-state'}-${record.location || 'no-location'}`;
  
  // Check cache first
  const cached = contentCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.content;
  }

  try {
    const content = await generateContentWithRateLimit(record, priority);
    
    // Cache the result
    contentCache.set(cacheKey, {
      content,
      timestamp: Date.now()
    });
    
    return content;
  } catch (error) {
    console.error('Error generating AI content:', error);
    // Return fallback content if AI generation fails
    return generateFallbackContent(record);
  }
}

async function generateContentWithRateLimit(record: OccupationRecord, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<AIGeneratedContent> {
  // Check circuit breaker first
  if (circuitBreakerOpen) {
    const now = Date.now();
    if (now - circuitBreakerOpenTime >= CIRCUIT_BREAKER_TIMEOUT) {
      // Circuit breaker timeout reached, try to close it
      circuitBreakerOpen = false;
      consecutiveRateLimitErrors = 0;
      console.log('Circuit breaker timeout reached, attempting to close');
    } else {
      // Circuit breaker is still open, return fallback content
      console.log('Circuit breaker is open, returning fallback content');
      return generateFallbackContent(record);
    }
  }

  return new Promise((resolve, reject) => {
    // Add to queue with priority
    requestQueue.push({ resolve, reject, record, priority, timestamp: Date.now() });
    
    // Process queue if not already processing
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}

async function processQueue(): Promise<void> {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  // Sort queue by priority (high first, then by timestamp for same priority)
  requestQueue.sort((a, b) => {
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.timestamp - b.timestamp; // FIFO for same priority
  });

  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (!request) continue;

    try {
      // Reset token usage if interval has passed
      const now = Date.now();
      if (now - lastTokenReset >= RATE_LIMIT.TOKEN_RESET_INTERVAL) {
        tokenUsage = 0;
        lastTokenReset = now;
        console.log('Token usage reset for new minute');
      }

      // Check if we have enough tokens for this request
      const estimatedTokens = AI_CONFIG.MAX_TOKENS * 3; // Conservative estimate: input + output + overhead
      if (tokenUsage + estimatedTokens > RATE_LIMIT.TOKENS_PER_MINUTE) {
        const waitTime = RATE_LIMIT.TOKEN_RESET_INTERVAL - (now - lastTokenReset);
        console.log(`Token limit reached (${tokenUsage}/${RATE_LIMIT.TOKENS_PER_MINUTE}). Waiting ${waitTime}ms for token reset.`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Calculate delay needed since last request
      const timeSinceLastRequest = now - lastRequestTime;
      const requiredDelay = Math.max(0, RATE_LIMIT.MIN_DELAY_MS - timeSinceLastRequest);

      if (requiredDelay > 0) {
        console.log(`Rate limiting: waiting ${requiredDelay}ms before next AI request (${Math.round(requiredDelay/1000)}s)`);
        await new Promise(resolve => setTimeout(resolve, requiredDelay));
      }

      // Update last request time
      lastRequestTime = Date.now();

      // Generate content
      const content = await generateContentWithAI(request.record);
      
      // Update token usage (conservative estimate)
      tokenUsage += estimatedTokens;
      console.log(`Request completed (${request.priority} priority). Token usage: ${tokenUsage}/${RATE_LIMIT.TOKENS_PER_MINUTE} (${Math.round((tokenUsage/RATE_LIMIT.TOKENS_PER_MINUTE)*100)}%)`);
      
      request.resolve(content);

    } catch (error) {
      console.error('Error processing AI request:', error);
      request.reject(error as Error);
    }
  }

  isProcessingQueue = false;
}

async function generateContentWithAI(record: OccupationRecord): Promise<AIGeneratedContent> {
  // Check if API key is available
  if (!AI_CONFIG.TOGETHER_API_KEY) {
    console.warn('TOGETHER_API_KEY not available, using fallback content');
    return generateFallbackContent(record);
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= RATE_LIMIT.MAX_RETRIES; attempt++) {
    try {
      const prompt = createPrompt(record);
      
      const response = await together.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional salary and career data analyst. Generate concise, informative content for occupation pages. Keep each section under 150 words. Use professional tone, avoid marketing language, and focus on data-driven insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: AI_CONFIG.TOGETHER_MODEL,
        max_tokens: AI_CONFIG.MAX_TOKENS,
        temperature: AI_CONFIG.TEMPERATURE,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from AI');
      }

      return parseAIResponse(content, record);

    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.status === 429) {
        consecutiveRateLimitErrors++;
        
        // Check if we should open the circuit breaker
        if (consecutiveRateLimitErrors >= CIRCUIT_BREAKER_THRESHOLD) {
          circuitBreakerOpen = true;
          circuitBreakerOpenTime = Date.now();
          console.log(`Circuit breaker opened after ${consecutiveRateLimitErrors} consecutive rate limit errors`);
        }
        
        const retryAfter = parseInt(error.headers?.['retry-after'] || '0');
        const waitTime = Math.max(retryAfter * 1000, RATE_LIMIT.MIN_DELAY_MS);
        
        console.log(`Rate limit hit (attempt ${attempt}/${RATE_LIMIT.MAX_RETRIES}). Waiting ${waitTime}ms before retry.`);
        
        if (attempt < RATE_LIMIT.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      } else {
        // Reset consecutive rate limit errors for non-rate-limit errors
        consecutiveRateLimitErrors = 0;
      }
      
      // For other errors or max retries reached, break
      break;
    }
  }

  // If we get here, all retries failed
  throw lastError || new Error('Failed to generate AI content after multiple attempts');
}

function createPrompt(record: OccupationRecord): string {
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

  return `Generate content for an occupation page about "${record.title || record.occupation}" in ${location}.

Key data:
- ${salaryInfo}
- Experience levels: ${experienceData || 'Not available'}
- Top skills: ${skillsData || 'Not available'}
- Years of experience data: ${record.oneYr ? '1 year, 1-4 years, 5-9 years, 10-19 years, 20+ years' : 'Not available'}

Generate the following sections (keep each under 150 words):
1. Overview: General description of the role and its importance
2. Salary Insights: Analysis of salary data and what it means
3. Experience Analysis: How experience affects compensation
4. Skills Breakdown: Importance of key skills and their impact
5. Career Progression: Typical career path and advancement
6. Market Trends: Current market conditions and outlook
7. Location Insights: How location affects compensation and opportunities
8. Related Opportunities: Related roles and career paths

Format as JSON with keys: overview, salaryInsights, experienceAnalysis, skillsBreakdown, careerProgression, marketTrends, locationInsights, relatedOpportunities`;
}

function parseAIResponse(content: string, record: OccupationRecord): AIGeneratedContent {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
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
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback to parsing text content
  return parseTextResponse(content, record);
}

function parseTextResponse(content: string, record: OccupationRecord): AIGeneratedContent {
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

function generateFallbackContent(record: OccupationRecord): AIGeneratedContent {
  const location = record.location ? `${record.location}, ${record.state}, ${record.country}` : 
                   record.state ? `${record.state}, ${record.country}` : 
                   record.country;
  
  return {
    overview: `${record.title || record.occupation} is a professional role that plays a crucial part in the workforce. This position offers competitive compensation and growth opportunities for qualified candidates.`,
    salaryInsights: `Salary data shows competitive compensation for this role. The range reflects experience levels, skills, and market demand. Professionals in this field can expect fair compensation based on their qualifications.`,
    experienceAnalysis: `Experience significantly impacts compensation in this field. Entry-level positions provide a foundation, while experienced professionals command higher salaries. Continuous learning and skill development are key to advancement.`,
    skillsBreakdown: `Key skills are essential for success in this role. Technical expertise, problem-solving abilities, and communication skills are highly valued. Employers seek candidates with a strong skill foundation.`,
    careerProgression: `Career progression typically follows a structured path from entry-level to senior positions. Advancement opportunities exist for those who demonstrate excellence and continuous improvement.`,
    marketTrends: `The market for this role shows steady demand. Industry growth and technological advancements create ongoing opportunities for qualified professionals.`,
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
}

// Function to get current rate limit status
export function getRateLimitStatus(): {
  canMakeRequest: boolean;
  timeUntilNextRequest: number;
  tokensRemaining: number;
  queueLength: number;
  circuitBreakerOpen: boolean;
  consecutiveRateLimitErrors: number;
  queueStats: {
    high: number;
    normal: number;
    low: number;
    total: number;
  };
} {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const timeUntilNextRequest = Math.max(0, RATE_LIMIT.MIN_DELAY_MS - timeSinceLastRequest);
  
  // Reset token usage if interval has passed
  if (now - lastTokenReset >= RATE_LIMIT.TOKEN_RESET_INTERVAL) {
    tokenUsage = 0;
    lastTokenReset = now;
  }
  
  const tokensRemaining = Math.max(0, RATE_LIMIT.TOKENS_PER_MINUTE - tokenUsage);
  const canMakeRequest = timeUntilNextRequest === 0 && tokensRemaining >= AI_CONFIG.MAX_TOKENS * 3 && !circuitBreakerOpen;
  
  // Calculate queue statistics
  const queueStats = {
    high: requestQueue.filter(r => r.priority === 'high').length,
    normal: requestQueue.filter(r => r.priority === 'normal').length,
    low: requestQueue.filter(r => r.priority === 'low').length,
    total: requestQueue.length,
  };
  
  return {
    canMakeRequest,
    timeUntilNextRequest,
    tokensRemaining,
    queueLength: requestQueue.length,
    circuitBreakerOpen,
    consecutiveRateLimitErrors,
    queueStats,
  };
}

// Function to manually reset the circuit breaker
export function resetCircuitBreaker(): void {
  circuitBreakerOpen = false;
  consecutiveRateLimitErrors = 0;
  console.log('Circuit breaker manually reset');
}

// Function to clear the request queue
export function clearRequestQueue(): void {
  const queueLength = requestQueue.length;
  requestQueue = [];
  console.log(`Request queue cleared (${queueLength} requests removed)`);
}

// Run cleanup periodically (every hour)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredCache, 60 * 60 * 1000);
}