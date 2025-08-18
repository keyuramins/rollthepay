# Roll The Pay

A comprehensive salary information platform that provides accurate compensation data for jobs across different countries and regions. Our mission is to increase transparency in the labor market by making salary information accessible to everyone.

## Features

- **Global Salary Data**: Access salary information from thousands of employers worldwide
- **Country & State Coverage**: Explore compensation data by country, state, and region
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
│   │   └── [...url]/             # Dynamic routes for state/occupation
│   │       └── page.tsx          # State & occupation pages (modular components)
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

### UI Components
- **Button**: Shadcn button component with variants
- **Badge**: Flexible badge component for counts and labels
- **Footer**: Reusable footer component

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

Salary information is sourced from CSV files organized by continent and country. The platform currently includes data for:

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
- **Data**: CSV files with custom parsing
- **Deployment**: Vercel (recommended)

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

## License

© 2024 Roll The Pay. All rights reserved.