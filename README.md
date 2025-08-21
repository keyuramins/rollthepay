# RollThePay

A comprehensive salary information platform that provides accurate compensation data for jobs across different countries and regions. Our mission is to increase transparency in the labor market by making salary information accessible to everyone.

## Features

- **Global Salary Data**: Access salary information from thousands of employers worldwide
- **Country & State Coverage**: Explore compensation data by country, state, and region
- **Location-Specific Data**: Get detailed salary information for specific cities and locations within states
- **Job Category Organization**: Browse salary information organized by occupation and specialization
- **Comprehensive Compensation Details**: View annual salaries, hourly rates, and experience-based compensation
- **Modular Component Architecture**: Fully component-based codebase for maintainability and reusability
- **Real-time Data**: Up-to-date salary information with regular updates
- **User-friendly Interface**: Clean, intuitive design for easy navigation

## Project Structure

```
rollthepay/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page (modular components)
│   ├── countries/page.tsx        # Countries listing (modular components)
│   ├── about/page.tsx            # About page (modular components)
│   ├── [country]/                # Country-specific routes
│   │   ├── page.tsx              # Country page (modular components)
│   │   └── [...url]/             # Dynamic routes for state/location/occupation
│   │       └── page.tsx          # State, location & occupation pages (modular components)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── sitemap.ts                # SEO sitemap
│   └── robots.ts                 # SEO robots.txt
├── components/                    # Reusable UI components
│   ├── navigation/               # Navigation components
│   │   ├── header.tsx            # Main header (composed of sub-components)
│   │   ├── logo.tsx              # Logo and title component
│   │   ├── nav-links.tsx         # Navigation links component
│   │   └── search-dropdown.tsx   # Search and country dropdown component
│   ├── home/                     # Home page components
│   │   ├── hero-section.tsx      # Hero section component
│   │   ├── stats-section.tsx     # Statistics display component
│   │   ├── mission-section.tsx   # Mission statement component
│   │   ├── features-section.tsx  # Features grid component
│   │   └── cta-section.tsx       # Call-to-action component
│   ├── countries/                # Countries page components
│   │   ├── hero-section.tsx      # Countries hero component
│   │   ├── country-card.tsx      # Individual country card component
│   │   ├── continent-section.tsx # Continent grouping component
│   │   └── global-stats.tsx      # Global statistics component
│   ├── country/                  # Country page components
│   │   ├── hero-section.tsx      # Country hero component
│   │   ├── occupation-category-card.tsx # Occupation category card
│   │   ├── occupation-categories-section.tsx # Occupation categories grid
│   │   ├── state-card.tsx        # Individual state card component
│   │   ├── states-section.tsx    # States/regions section component
│   │   └── cta-section.tsx       # Country page CTA component
│   ├── about/                    # About page components
│   │   ├── hero-section.tsx      # About hero component
│   │   ├── mission-section.tsx   # Mission section component
│   │   ├── what-we-do-section.tsx # What we do section component
│   │   ├── why-it-matters-section.tsx # Why salary transparency matters
│   │   ├── data-quality-section.tsx # Data quality commitment component
│   │   └── cta-section.tsx       # About page CTA component
│   ├── occupation/               # Occupation page components
│   │   ├── hero-section.tsx      # Occupation hero component
│   │   ├── breadcrumbs.tsx       # Navigation breadcrumbs component
│   │   ├── salary-card.tsx       # Individual salary display component
│   │   ├── salary-range-card.tsx # Salary range information component
│   │   ├── hourly-rate-card.tsx  # Hourly rate information component
│   │   ├── experience-levels-section.tsx # Experience level compensation
│   │   └── cta-section.tsx       # Occupation page CTA component
│   ├── state/                    # State page components
│   │   ├── state-hero-section.tsx # State hero component
│   │   ├── job-category-card.tsx # Job category display component
│   │   ├── job-categories-section.tsx # Job categories grid component
│   │   └── location-card.tsx     # Individual location card component
│   ├── location/                 # Location page components
│   │   ├── location-hero-section.tsx # Location hero component
│   │   ├── job-category-card.tsx # Job category display component
│   │   └── job-categories-section.tsx # Job categories grid component
│   ├── ui/                       # Shared UI components
│   │   ├── button.tsx            # Button component (Shadcn)
│   │   ├── badge.tsx             # Badge component for counts/statistics
│   │   └── footer.tsx            # Reusable footer component
│   └── index.ts                  # Central component exports
├── lib/                          # Utility libraries
│   ├── data/                     # Data parsing and types
│   │   ├── parse.ts              # CSV parsing utilities
│   │   └── types.ts              # TypeScript type definitions
│   ├── format/                   # Formatting utilities
│   │   └── currency.ts           # Currency and number formatting
│   └── utils.ts                  # General utility functions
├── data/                         # CSV data files
│   ├── africa/                   # African country data
│   ├── asia/                     # Asian country data
│   ├── europe/                   # European country data
│   ├── middle_east/              # Middle Eastern country data
│   ├── north_america/            # North American country data
│   ├── oceania/                  # Oceania country data
│   │   └── australia.csv         # Australia salary data
│   └── south_america/            # South American country data
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Component Architecture

### Navigation Components
- **Header**: Main navigation header composed of Logo, NavLinks, and SearchDropdown
- **Logo**: Site logo and title with home link
- **NavLinks**: Main navigation menu (Home, Countries, About)
- **SearchDropdown**: Global search and country selection dropdown

### Page-Specific Components
Each page has been broken down into logical, reusable components:

#### Home Page
- **HeroSection**: Main hero with title and CTA buttons
- **StatsSection**: Statistics display (total salaries, countries, transparency)
- **MissionSection**: Mission statement and value proposition
- **FeaturesSection**: Key features grid
- **CTASection**: Call-to-action section

#### Countries Page
- **CountriesHeroSection**: Hero section for countries listing
- **CountryCard**: Individual country display with statistics
- **ContinentSection**: Continent grouping with countries
- **GlobalStats**: Global overview statistics

#### Country Page
- **CountryHeroSection**: Country-specific hero with stats
- **OccupationCategoryCard**: Individual occupation category display
- **OccupationCategoriesSection**: Grid of occupation categories
- **StateCard**: Individual state/region display
- **StatesSection**: States and regions grid
- **CountryCTASection**: Country page call-to-action

#### About Page
- **AboutHeroSection**: About page hero section
- **AboutMissionSection**: Mission and values
- **WhatWeDoSection**: Services and capabilities
- **WhyItMattersSection**: Benefits of salary transparency
- **DataQualitySection**: Data quality commitment
- **AboutCTASection**: About page call-to-action

#### Occupation Pages
- **OccupationHeroSection**: Occupation-specific hero with salary info
- **Breadcrumbs**: Navigation breadcrumbs
- **SalaryCard**: Individual salary amount display
- **SalaryRangeCard**: Annual salary range information
- **HourlyRateCard**: Hourly rate information
- **ExperienceLevelsSection**: Experience-based compensation
- **OccupationCTASection**: Occupation page call-to-action

#### State Pages
- **StateHeroSection**: State-specific hero section
- **JobCategoryCard**: Individual job category display
- **JobCategoriesSection**: Grid of job categories
- **LocationCard**: Individual location card display

#### Location Pages
- **LocationHeroSection**: Location-specific hero section
- **JobCategoryCard**: Individual job category display
- **JobCategoriesSection**: Grid of job categories

### UI Components
- **Button**: Shadcn button component with variants
- **Badge**: Flexible badge component for counts and labels
- **Footer**: Reusable footer component

## Routing Structure

The application uses a hierarchical routing structure that supports multiple levels of geographic organization:

### URL Patterns
- **Country Level**: `/[country]` - Overview of all jobs in a country
- **State Level**: `/[country]/[state]` - Jobs within a specific state/region
- **Location Level**: `/[country]/[state]/[location]` - Jobs within a specific city/location
- **Occupation Level**: 
  - `/[country]/[slug]` - Country-level occupation (no state)
  - `/[country]/[state]/[slug]` - State-level occupation
  - `/[country]/[state]/[location]/[slug]` - Location-level occupation

### Data Hierarchy
- **Country** → Contains multiple states/regions
- **State** → Contains multiple locations/cities
- **Location** → Contains specific job records
- **Occupation** → Individual salary records with detailed compensation data

### Navigation Flow
Users can navigate from broad (country) to specific (location) levels, with each level showing relevant job categories and statistics. The breadcrumb navigation provides clear context and easy navigation between levels.

## Key Principles

### Modularity
- Each component has a single responsibility
- Components are composable and reusable
- Clear separation of concerns between UI and logic

### Type Safety
- Strong TypeScript interfaces for all component props
- Proper type definitions for data structures
- Null safety and error handling

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support

### Performance
- Server Components by default (Next.js 15)
- Incremental Static Regeneration (ISR) with 1-year revalidation
- Optimized bundle splitting

## Data Sources

Salary information is sourced from CSV files organized by continent and country, accessed via the Filebrowser API. The platform currently includes data for:

- **Oceania**: Australia
- **Asia**: India
- **North America**: United States, Canada
- **Europe**: United Kingdom, Germany, France
- **South America**: Brazil
- **Africa**: South Africa
- **Middle East**: Various countries

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Data**: CSV files via Filebrowser API with custom parsing
- **Deployment**: Vercel (recommended)

## Filebrowser API Integration

RollThePay uses the Filebrowser API to access CSV data files stored in a structured folder hierarchy. This replaces the previous Minio integration and provides a more robust file management solution.

### Environment Variables

Configure the following environment variables in your `.env` file:

```bash
# Filebrowser server base URL
FILEBROWSER_BASE_URL=http://localhost:8080

# Filebrowser API key for authentication
FILEBROWSER_API_KEY=your_api_key_here
```

### Data Structure

The Filebrowser API expects the following folder structure:

```
/rollthepay/
├── oceania/
│   ├── australia.csv
│   └── new-zealand.csv
├── asia/
│   ├── india.csv
│   └── singapore.csv
├── europe/
│   ├── germany.csv
│   └── uk.csv
└── ... (other continents and countries)
```

### API Configuration

- **Source Name**: `folder` (as configured in Filebrowser)
- **Entry Folder**: `/rollthepay` (root folder containing all data)
- **Authentication**: Bearer token using `FILEBROWSER_API_KEY`

### Testing the Setup

Run the migration test script to verify everything is working:

```bash
npm run migrate-to-filebrowser
```

This script validates the Filebrowser connection, discovers CSV files, tests file reading, and verifies caching functionality.

### Caching Strategy

- **Memory Cache**: 1 year duration (31536000 seconds)
- **Build-time Bypass**: Prevents API calls during Next.js static generation
- **Cache Keys**: Based on file paths and operation types
- **Cache Invalidation**: Manual via `clearCache()` function

### API Endpoints Used

- `GET /api/resources` - List directory contents and get file metadata
- `GET /api/raw` - Download file content
- Both endpoints require the `source=folder` parameter and proper authentication

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

## Contributing

This project follows strict architectural principles:
- All pages must be Server Components by default
- Use ISR with 1-year revalidation
- Maintain modular component architecture
- Follow established naming conventions
- Ensure type safety throughout

## AI Content Generation

RollThePay now includes AI-generated content for occupation pages using Together AI's Llama-3.3-70B-Instruct-Turbo-Free model. This feature provides comprehensive, professional content that enhances user understanding of roles, requirements, and career opportunities.

### Features

- **AI-Generated Content Sections**: 8 comprehensive sections per occupation page
- **Career Opportunities**: Interlinked job suggestions representing career scope and progression
- **Data Overview**: Comprehensive textual summary of occupation data
- **1-Year Caching**: Intelligent caching strategy for optimal performance
- **Graceful Fallback**: Fallback content when AI services are unavailable

### AI Content Sections

Each occupation page includes:
1. **Role Overview** - General description and importance
2. **Salary Insights** - Analysis of compensation data  
3. **Experience Analysis** - How experience affects earnings
4. **Skills Breakdown** - Importance of key skills
5. **Career Progression** - Typical advancement paths
6. **Market Trends** - Current market conditions
7. **Location Insights** - Geographic compensation factors
8. **Related Opportunities** - Alternative career paths

### Career Opportunities Section

The Career Opportunities section provides:
- **Related Job Links**: Internal links to related occupations in the same location
- **Career Development Strategies**: Professional development tips and insights
- **Progression Visualization**: Visual representation of career advancement paths
- **Location-Based Filtering**: Smart filtering to show relevant opportunities

### Setup

1. **Get Together AI API Key**: Sign up at [https://together.ai/](https://together.ai/)
2. **Create `.env.local`**: Add `TOGETHER_API_KEY=your_key_here`
3. **Test**: Run `npm run test:ai` to verify functionality

### Configuration

- **Model**: Llama-3.3-70B-Instruct-Turbo-Free (free tier)
- **Max Tokens**: 2000 per request
- **Context Window**: 8k tokens (model limitation)
- **Section Limit**: 150 words per section
- **Cache Duration**: 1 year (31536000 milliseconds)

### Rate Limiting

The AI content generation system includes comprehensive rate limiting to prevent hitting Together AI's API limits:

#### Rate Limits
- **Requests per minute**: 0.6 (1 request every 100 seconds)
- **Tokens per minute**: 45,000
- **Model**: meta-llama/Llama-3.3-70B-Instruct-Turbo-Free

#### Features

##### 1. Request Queue
- All AI requests are queued and processed sequentially
- Priority system: `high`, `normal`, `low`
- Automatic rate limiting with configurable delays

##### 2. Circuit Breaker
- Automatically opens after 3 consecutive rate limit errors
- 5-minute timeout before attempting to close
- Prevents overwhelming the API during outages

##### 3. Token Tracking
- Monitors token usage per minute
- Conservative token estimation (input + output + overhead)
- Automatic waiting when token limits are reached

##### 4. Priority Queue
```typescript
// High priority request (processed first)
await generateOccupationContent(record, 'high');

// Normal priority (default)
await generateOccupationContent(record, 'normal');

// Low priority (processed last)
await generateOccupationContent(record, 'low');
```

#### Monitoring

##### Get Rate Limit Status
```typescript
import { getRateLimitStatus } from '@/lib/ai/content-generator';

const status = getRateLimitStatus();
console.log(status);
// Output:
// {
//   canMakeRequest: boolean,
//   timeUntilNextRequest: number,
//   tokensRemaining: number,
//   queueLength: number,
//   circuitBreakerOpen: boolean,
//   consecutiveRateLimitErrors: number,
//   queueStats: {
//     high: number,
//     normal: number,
//     low: number,
//     total: number
//   }
// }
```

##### Manual Controls
```typescript
import { 
  resetCircuitBreaker, 
  clearRequestQueue 
} from '@/lib/ai/content-generator';

// Reset circuit breaker manually
resetCircuitBreaker();

// Clear all pending requests
clearRequestQueue();
```

### Performance & Caching

- **Build Time**: AI content generated during build/ISR, not at runtime
- **Memory Storage**: In-memory cache with automatic cleanup
- **Cache Key**: Based on occupation slug, country, state, and location
- **Scalability**: Each occupation has unique cached content

### Error Handling

The system gracefully handles:
- Missing API keys (uses fallback content)
- API failures (uses fallback content)
- Network timeouts (uses fallback content)
- Invalid responses (parses text fallback)
- Rate limit errors (automatic queuing and retry)
- Token limit errors (automatic waiting and reset)

### Troubleshooting

#### Rate Limit Errors
If you see 429 errors:
1. Check the rate limit status: `getRateLimitStatus()`
2. Wait for the circuit breaker to timeout (5 minutes)
3. Or manually reset: `resetCircuitBreaker()`

#### Token Limit Errors
If you hit token limits:
1. The system automatically waits for the next minute
2. Token usage resets every 60 seconds
3. Monitor with `getRateLimitStatus().tokensRemaining`

#### Queue Management
If requests are stuck:
1. Check queue length: `getRateLimitStatus().queueLength`
2. Clear queue if needed: `clearRequestQueue()`
3. Monitor priority distribution: `getRateLimitStatus().queueStats`

### Best Practices

1. **Use appropriate priorities**: Reserve `high` priority for critical requests
2. **Monitor status**: Check rate limit status before making requests
3. **Handle errors gracefully**: Always catch errors and use fallback content
4. **Test thoroughly**: Use the test script to verify functionality
5. **Monitor logs**: Watch for rate limiting and circuit breaker events

## License

© 2024 RollThePay. All rights reserved.