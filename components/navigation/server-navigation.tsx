// components/navigation/server-navigation.tsx
import Link from "next/link";
import { continents } from "@/app/constants/continents";

interface ServerNavigationProps {
  className?: string;
}

export function ServerNavigation({ className = "" }: ServerNavigationProps) {
  return (
    <nav className={className} role="navigation" aria-label="Main navigation">
      <ul className="flex space-x-2">
        {continents.map((continent) => (
          <li key={continent.code} className="relative group">
            <button className="flex items-center text-sm font-semibold">
              <span>{continent.name}</span>
              <span className="ml-1">▼</span>
            </button>
            
            {/* SEO-friendly dropdown - always rendered in HTML, original styling */}
            <div 
              className="absolute top-full right-0 w-64 bg-primary rounded-lg shadow-xl z-50 ring-1 ring-primary ring-opacity-50 hidden group-hover:block"
              role="menu"
              aria-label={`${continent.name} countries`}
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
                      role="menuitem"
                      aria-label={`Navigate to ${country.name} salary data`}
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
