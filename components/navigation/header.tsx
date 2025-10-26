// header.tsx
import { Logo } from "./logo";
import { SearchableDropdown } from "@/components/navigation/searchable-dropdown";
import { MobileMenuToggle } from "./mobile-menu-toggle";
import { continents } from "@/app/constants/continents";
import { Suspense } from "react";
import { ServerNavigation } from "./server-navigation";
import Link from "next/link";

export async function Header() {
  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50" role="banner">
      <div className="max-w-7xl lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo - Left Side */}
          <div className="flex items-center pr-4">
            <Logo />
          </div>

          {/* md-only: desktop nav on the top row (right of logo) */}
          <div className="hidden lg:flex xl:hidden pl-4 ml-auto">
            <ServerNavigation className="space-x-2" />
          </div>

          {/* lg+: search in center */}
          <div className="hidden xl:flex flex-1 justify-center px-4 lg:px-8">
            <div className="w-full max-w-3xl">
              <Suspense fallback={<div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>}>
                <SearchableDropdown 
                  headerMode={true}
                  placeholder="Select a country..."
                  fullWidth={true}
                  aria-label="Search occupations by country"
                />
              </Suspense>
            </div>
          </div>

          {/* lg+: desktop nav on the right */}
          <div className="hidden xl:flex pl-4">
            <ServerNavigation className="space-x-2" />
          </div>

          {/* Mobile menu button and menu */}
          <div className="lg:hidden pl-4 ml-auto">
            <MobileMenuToggle aria-label="Open mobile menu" />
          </div>
        </div>

        {/* Second row: search below on <lg (mobile and md) */}
        <div className="block lg:block xl:hidden pb-4">
          <div className="px-0 lg:px-4">
            <div className="w-full lg:max-w-3xl mx-auto">
              <Suspense fallback={<div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>}>
                <SearchableDropdown 
                  headerMode={true}
                  placeholder="Search occupations..."
                  fullWidth={true}
                  aria-label="Search occupations"
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* SEO: Hidden navigation for search engines - all links pre-rendered */}
        <nav className="sr-only" aria-label="SEO navigation">
          <ul>
            {continents.map((continent) => (
              <li key={continent.code}>
                <h3>{continent.name}</h3>
                <ul>
                  {continent.countries.map((country) => (
                    <li key={country.slug}>
                      <Link href={`/${country.slug}`}>
                        {country.name} Salary Data
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}