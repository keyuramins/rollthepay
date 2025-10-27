// components/index.ts
// Navigation
export { Header } from "./navigation/header";
export { Logo } from "./navigation/logo";
export { SearchableDropdown } from "./navigation/searchable-dropdown";
export { Footer } from "./navigation/footer";
export { MobileMenuToggle } from "./navigation/mobile-menu-toggle";
export { ServerNavigation } from "./navigation/server-navigation";
export { ServerMobileMenu } from "./navigation/server-mobile-menu";

//Home
export { HeroSectionWrapper } from "./home/HeroSectionWrapper";
export { StatsSectionWrapper } from "./home/StatsSectionWrapper";
export { FeaturesSection } from "./home/features-section";
export { TrustSection } from "./home/trust-section";
export { MissionSection } from "./home/mission-section";
export { CTASection } from "./home/cta-section";

// Country Components
export { CountryHeroSection } from "./country/hero-section";
export { StatesGrid } from "./country/states-grid";
export { CountryCTASection } from "./country/cta-section";

// State Components
export { StatePage } from "./state/state-page";
export { LocationsGrid } from "./state/locations-grid";
export { StateHeroSection } from "./state/state-hero-section";

// Location Components
export { LocationPage } from "./location/location-page";
export { LocationHeroSection } from "./location/location-hero-section";
export { LocationCTASection } from "./location/location-cta-section";

// Occupation Components
export { OccupationPage } from "./occupation/occupation-page";
export { Breadcrumbs } from "./occupation/breadcrumbs";
export { CompensationAnalysis } from "./occupation/compensation-analysis";
export { PercentilesChart } from "./occupation/percentiles-chart";
export { SalaryPercentilesChart } from "./occupation/salary-percentiles-chart";
export { ExperienceLevelSalariesChart } from "./occupation/experience-level-salaries-chart";
export { GenderComparison } from "./occupation/gender-comparison";
export { OccupationCTASection } from "./occupation/cta-section";
export { InsightsSection } from "./occupation/ai-insights-section";
export { OccupationHeroSection } from "./occupation/hero-section";
export { RelatedOpportunitiesSmart } from "./occupation/related-opportunities-smart";
export { AZFilter } from "./occupation/az-filter";
export { OccupationList } from "./ui/occupation-list";
export { TopSkillsMarketDemand } from "./occupation/top-skills-market-demand";
export { type JobCategoryInfo, getJobCategory, getJobCategoryInfo } from "./occupation/job-category-detector";
export { OccupationListItems } from "./ui/occupation-list-items";
export { OccupationListClient } from "./ui/occupation-list-client";
export { Pagination } from "./ui/pagination";
export { SearchWithinOccupationList } from "./ui/search-within-occupation-list";

//ui components
export { Badge } from "./ui/badge";
export { Button } from "./ui/button";
export { Card } from "./ui/card";
export { Tooltip } from "./ui/tooltip";

//shared components
export { ShareOccupation } from "./share/ShareOccupation";

// Prefetch and Optimization Utilities
export { optimizedDataAccess } from "../lib/data/optimized-parse";
