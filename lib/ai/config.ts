// AI Service Configuration
export const AI_CONFIG = {
  // Together AI Configuration
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  TOGETHER_MODEL: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
  
  // Content Generation Settings
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  
  // Cache Settings
  CACHE_DURATION: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
  
  // Content Limits
  MAX_SECTION_LENGTH: 150, // words per section
  MAX_TOTAL_LENGTH: 8000, // total tokens limit
};

// Validate required environment variables
export function validateAIConfig(): void {
  if (!AI_CONFIG.TOGETHER_API_KEY) {
    console.warn('TOGETHER_API_KEY is not set. AI content generation will use fallback content.');
  }
}

// Initialize validation
validateAIConfig();
