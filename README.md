# Roll The Pay

A modern, data-driven salary information website built with Next.js that provides accurate compensation data for occupations across different countries and states.

## 🚀 Features

- **Global Salary Data**: Access salary information from thousands of employers worldwide
- **Geographic Coverage**: Browse salaries by country and state/region
- **Comprehensive Data**: Annual salaries, hourly rates, bonuses, commissions, and experience-based compensation
- **Static-First Architecture**: Built with Next.js 15 and Incremental Static Regeneration (ISR)
- **Responsive Design**: Modern UI built with Tailwind CSS and Shadcn UI components
- **SEO Optimized**: Server-side rendering with proper metadata and canonical URLs

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI with Radix UI primitives
- **Data Processing**: CSV parsing with csv-parse
- **Icons**: Lucide React

### Core Principles
- **Server Components First**: All pages are Server Components by default
- **Static Generation**: ISR with 1-year revalidation for optimal performance
- **Data-Driven**: Single source of truth from CSV files
- **Type Safety**: Strong TypeScript types for all data structures

## 📁 Project Structure

```
rollthepay/
├── app/                          # Next.js App Router
│   ├── [country]/               # Dynamic country routes
│   │   └── [...url]/            # Catch-all for country/state/slug
│   ├── about/                   # About page
│   ├── countries/               # Countries listing
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── navigation/             # Header and navigation
│   ├── occupation/             # Occupation-specific components
│   └── ui/                     # Reusable UI components (Shadcn)
├── data/                       # CSV data files
│   ├── africa/                 # African countries data
│   ├── asia/                   # Asian countries data
│   ├── europe/                 # European countries data
│   ├── middle_east/            # Middle Eastern countries data
│   ├── north_america/          # North American countries data
│   ├── oceania/                # Oceania countries data (Australia)
│   └── south_america/          # South American countries data
├── lib/                        # Utility libraries
│   ├── data/                   # Data parsing and types
│   └── format/                 # Currency and number formatting
└── types/                      # TypeScript type definitions
```

## 🗃️ Data Model

The application processes CSV files containing comprehensive salary information:

### Core Fields
- **Basic Info**: title, occupation, country, state, location
- **Compensation**: annual salary, hourly rate, bonuses, commissions
- **Experience Levels**: entry-level, early career, mid-career, experienced, late career
- **Geographic**: country, state, city/location
- **Skills & Related**: job skills, related occupations, links

### Data Sources
- CSV files organized by continent/region
- Each file contains multiple occupation records
- Data includes salary ranges, bonuses, and geographic breakdowns
- Support for multiple currencies (AUD, INR, etc.)

## 🛣️ Routing Structure

The application uses dynamic routing to handle various URL patterns:

- `/[country]` - Country overview pages
- `/[country]/[state]` - State/region specific pages  
- `/[country]/[slug]` - Individual occupation pages
- `/[country]/[state]/[slug]` - State-specific occupation pages

### URL Examples
- `/australia` - Australia overview
- `/australia/new-south-wales` - NSW state page
- `/australia/administration-assistant-salary` - Admin assistant salary in Australia
- `/australia/new-south-wales/administrative-assistant-data-entry-skills-salary-campbelltown` - Specific location and skills

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rollthepay
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🔧 Configuration

### Environment Variables
No environment variables are currently required. The application runs entirely from static CSV data.

### Next.js Configuration
- ISR enabled with 1-year revalidation
- Static generation for all routes
- App Router with Server Components

## 📊 Data Management

### Adding New Data
1. Place CSV files in the appropriate `data/[region]/` directory
2. Ensure CSV follows the expected schema (see `lib/data/types.ts`)
3. Rebuild the application to include new data

### Data Format Requirements
- CSV files must include required fields: title, slug_url, country
- Use lowercase for slug_url (used in routing)
- Handle missing data gracefully with null values
- Support for multiple currencies and locales

## 🎨 UI Components

The application uses Shadcn UI components for consistency and accessibility:

- **Button**: Primary and outline variants
- **Navigation**: Header with responsive design
- **Layout**: Responsive grid systems and spacing
- **Typography**: Consistent heading hierarchy

## 🔍 SEO & Performance

### Optimization Features
- **Static Generation**: All pages pre-built at build time
- **ISR**: Incremental Static Regeneration for data updates
- **Metadata**: Dynamic meta tags for each occupation
- **Canonical URLs**: Proper URL structure for search engines
- **Performance**: Optimized bundle sizes and loading

### SEO Implementation
- Dynamic page titles and descriptions
- Open Graph and Twitter Card support
- Proper heading hierarchy (H1, H2, H3)
- Semantic HTML structure

## 🧪 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Implement Server Components by default
- Use Tailwind CSS for styling

### Component Structure
- Place reusable components in `components/ui/`
- Use kebab-case for filenames
- Export PascalCase component names
- Implement proper TypeScript interfaces

### Data Handling
- Parse CSV data once per build cycle
- Cache parsed results in module scope
- Handle invalid data gracefully
- Use proper number formatting for currencies

## 📈 Future Enhancements

- Additional country and region coverage
- Enhanced filtering and search capabilities
- Salary comparison tools
- Industry-specific salary insights
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or support, please refer to the project documentation or contact the development team.

---

**Roll The Pay** - Making salary information accessible and transparent worldwide.