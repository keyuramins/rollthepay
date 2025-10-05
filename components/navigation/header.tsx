// header.tsx
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { MobileMenuToggle } from "./mobile-menu-toggle";
import { continents } from "@/app/constants/continents";
import Link from "next/link";

export function Header({ allOccupations = [] as Array<{ country: string; title: string; slug: string; state: string | null; location: string | null; }> }: { allOccupations?: Array<{ country: string; title: string; slug: string; state: string | null; location: string | null; }> }) {
  return (
    <header className="bg-primary shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex items-center pr-4">
            <Logo />
          </div>

          {/* md-only: desktop nav on the top row (right of logo) */}
          <div className="hidden lg:flex xl:hidden space-x-2 pl-4 ml-auto">
            {continents.map((continent) => (
              <div key={continent.code} className="relative group">
                <Button
                  variant="rtp"
                  size="rtp"
                  className="flex items-center"
                >
                  <span className="text-sm font-semibold">{continent.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {/* Dropdown Content - Shown on hover via CSS */}
                <div 
                  className="absolute top-full right-0 w-64 bg-primary rounded-lg shadow-xl z-50 ring-1 ring-primary ring-opacity-50 hidden group-hover:block"
                >
                  <div className="py-0">
                    <div className="px-4 py-2 text-sm font-semibold text-primary bg-muted border-b border-b-secondary">
                      {continent.name}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-card divide-opacity-80">
                      {continent.countries.map((country) => (
                        <Link
                          key={country.slug}
                          href={`/${country.slug}`}
                          className="block px-4 py-2 text-sm text-card hover:bg-secondary hover:text-primary hover:text-md hover:font-semibold transition-colors duration-100"
                        >
                          {country.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* lg+: search in center */}
          <div className="hidden xl:flex flex-1 justify-center px-4 lg:px-8">
            <div className="w-full max-w-3xl">
              <SearchableDropdown 
                allOccupations={allOccupations} 
                headerMode={true}
                placeholder="Search occupations..."
                fullWidth={true}
              />
            </div>
          </div>

          {/* lg+: desktop nav on the right */}
          <div className="hidden xl:flex space-x-2 pl-4">
            {continents.map((continent) => (
              <div key={continent.code} className="relative group">
                <Button
                  variant="rtp"
                  size="rtp"
                  className="flex items-center"
                >
                  <span className="text-sm font-semibold">{continent.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {/* Dropdown Content - Shown on hover via CSS */}
                <div 
                  className="absolute top-full right-0 w-64 bg-primary rounded-lg shadow-xl z-50 ring-1 ring-primary ring-opacity-50 hidden group-hover:block"
                >
                  <div className="py-0">
                    <div className="px-4 py-2 text-sm font-semibold text-primary bg-muted border-b border-b-secondary">
                      {continent.name}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-card divide-opacity-80">
                      {continent.countries.map((country) => (
                        <Link
                          key={country.slug}
                          href={`/${country.slug}`}
                          className="block px-4 py-2 text-sm text-card hover:bg-secondary hover:text-primary hover:text-md hover:font-semibold transition-colors duration-100"
                        >
                          {country.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile menu button and menu */}
          <div className="lg:hidden pl-4 ml-auto">
            <MobileMenuToggle />
          </div>
        </div>

        {/* Second row: search below on <lg (mobile and md) */}
        <div className="block lg:block xl:hidden pb-4">
          <div className="px-0 lg:px-4">
            <div className="w-full lg:max-w-3xl mx-auto">
              <SearchableDropdown 
                allOccupations={allOccupations} 
                headerMode={true}
                placeholder="Search occupations..."
                fullWidth={true}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}