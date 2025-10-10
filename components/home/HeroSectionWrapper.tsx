import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { Globe, Shield, Users } from "lucide-react";

export function HeroSectionWrapper({ occupations }: { occupations: any[] }) {
  const trustItems = [
    { icon: Shield, label: "Trusted Data" },
    { icon: Globe, label: "Global Coverage" },
    { icon: Users, label: "Real Salaries" },
  ];

  return (
    <section role="region" aria-labelledby="hero-heading" className="relative bg-primary min-h-[80vh] sm:h-[85vh] flex items-center py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:via-secondary before:to-primary before:opacity-50 before:brightness-20 before:backdrop-blur-xl" />
      <div className="relative z-10 w-full max-w-6xl text-center px-4 sm:px-6 lg:px-8 mx-auto">
      <ul className="flex flex-wrap justify-center gap-6 mb-8">
          {trustItems.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-white text-sm font-medium">
              <Icon className="w-4 h-4 text-white" />
              {label}
            </li>
          ))}
        </ul>

        {/* Main Headline */}
        <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-background mt-4 mb-1">
          Discover What Jobs Really Pay
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-background max-w-3xl mx-auto leading-relaxed mb-12">
          Get accurate, up-to-date salary data from thousands of employers.<span className="text-secondary"> Worldwide.</span>
        </p>

        {/* Only the Search Dropdown is client-side skeleton */}
        <div className="max-w-2xl mx-auto space-y-4 mb-12">
          <p className="text-white text-sm font-medium text-center">
            Select a country, then search by job title or a location
          </p>
          <div className="relative">
            <SearchableDropdown
                variant="light"
                placeholder="Select a country..."
                fullWidth
                centered
                allOccupations={occupations || []}
                className="transform transition-all duration-300 hover:scale-[1.05] shadow-2xl"
            />
            </div>
          <p className="text-center text-white text-sm">
            <span>Find your worth, negotiate better, and make informed career decisions.</span>
          </p>
        </div>

        {/* Quick Stats (static for FCP) */}
        <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 text-background">
          <li className="text-center flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">1M+</span>
            <p>Salary Records</p>
          </li>
          <li className="text-center flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">100+</span>
            <p>Countries</p>
          </li>
          <li className="text-center flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">100%</span>
            <p>Free Access</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
