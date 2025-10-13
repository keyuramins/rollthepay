// Navigation
export { Header } from "./navigation/header";
export { Logo } from "./navigation/logo";
export { SearchableDropdown } from "./navigation/searchable-dropdown";

// Enhanced Links with Aggressive Prefetching
export { EnhancedLink, InstantLink, LazyLink, HoverPrefetchLink } from "./ui/enhanced-link";

// Country Components
export { CountryHeroSection } from "./country/hero-section";
export { StatesGrid } from "./country/states-grid";
export { CountryCTASection } from "./country/cta-section";

// State Components
export { StatePage } from "./state/state-page";
export { LocationsGrid } from "./state/locations-grid";

// Location Components
export { LocationPage } from "./location/location-page";

// Occupation Components
export { OccupationPage } from "./occupation/occupation-page";
export { Breadcrumbs } from "./occupation/breadcrumbs";
export { CompensationAnalysis } from "./occupation/compensation-analysis";
export { SalaryPercentilesChart } from "./occupation/salary-percentiles-chart";
export { ExperienceLevelSalariesChart } from "./occupation/experience-level-salaries-chart";
export { GenderComparison } from "./occupation/gender-comparison";
export { OccupationCTASection } from "./occupation/cta-section";
export { InsightsSection } from "./occupation/ai-insights-section";
export { OccupationHeroSection } from "./occupation/hero-section";
export { RelatedOpportunitiesSmart } from "./occupation/related-opportunities-smart";

// UI Components
export { AZFilter } from "./occupation/az-filter";
export { OccupationList } from "./ui/occupation-list";
export { OccupationListSkeleton } from "./ui/occupation-list-skeleton";


// Prefetch and Optimization Utilities
export { prefetchAllRoutes, prefetchRoute, getPrefetchedData, clearPrefetchCache, getPrefetchStats } from "../lib/prefetch";
export { optimizedDataAccess } from "../lib/data/optimized-parse";
