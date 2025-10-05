// Navigation
export { Header } from "./navigation/header";
export { Logo } from "./navigation/logo";

// Enhanced Links with Aggressive Prefetching
export { EnhancedLink, InstantLink, LazyLink, HoverPrefetchLink } from "./ui/enhanced-link";

// Country Components
export { CountryHeroSection } from "./country/hero-section";
export { StatesGrid } from "./country/states-grid";
export { StatesSection } from "./country/states-section";
export { CountryCTASection } from "./country/cta-section";
export { StateCard } from "./country/state-card";
export { OccupationCategoryCard } from "./country/occupation-category-card";

// State Components
export { StatePage } from "./state/state-page";
export { JobCategoryCard } from "./state/job-category-card";
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
export { DataOverviewSection } from "./occupation/data-overview-section";
export { ContentSections } from "./occupation/content-sections";
export { OccupationHeroSection } from "./occupation/hero-section";
export { RelatedOpportunitiesSmart } from "./occupation/related-opportunities-smart";
export { RelatedOpportunitiesSimple } from "./occupation/related-opportunities-simple";

// UI Components
export { OccupationList } from "./ui/occupation-list";
export { SearchableDropdown } from "./navigation/searchable-dropdown";

// Prefetch and Optimization Utilities
export { prefetchAllRoutes, prefetchRoute, getPrefetchedData, clearPrefetchCache, getPrefetchStats } from "../lib/prefetch";
export { optimizedDataAccess } from "../lib/data/optimized-parse";
