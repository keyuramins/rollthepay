// Navigation
export { NewHeader } from "./navigation/new-header";
export { Logo } from "./navigation/logo";
export { NavLinks } from "./navigation/nav-links";

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
export { SalaryCard } from "./occupation/salary-card";
export { ExperienceLevelsSection } from "./occupation/experience-levels-section";
export { OccupationCTASection } from "./occupation/cta-section";
export { DataOverviewSection } from "./occupation/data-overview-section";
export { ContentSections } from "./occupation/content-sections";
export { CareerProgressionSection } from "./occupation/career-progression-section";
export { OccupationHeroSection } from "./occupation/hero-section";

// UI Components
export { OccupationList } from "./ui/occupation-list";
export { SearchableDropdown } from "./ui/searchable-dropdown";

// Prefetch and Optimization Utilities
export { prefetchAllRoutes, prefetchRoute, getPrefetchedData, clearPrefetchCache, getPrefetchStats } from "../lib/prefetch";
export { optimizedDataAccess } from "../lib/data/optimized-parse";
