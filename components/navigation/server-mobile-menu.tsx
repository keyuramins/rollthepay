// components/navigation/server-mobile-menu.tsx
import Link from "next/link";
import { continents } from "@/app/constants/continents";

export function ServerMobileMenu() {
  return (
    <div className="lg:hidden">
      <nav role="navigation" aria-label="Mobile navigation">
        <ul className="space-y-2">
          {continents.map((continent) => (
            <li key={continent.code}>
              <details className="group">
                <summary className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-primary bg-muted rounded-md cursor-pointer">
                  {continent.name}
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="mt-2 ml-4 space-y-1">
                  {continent.countries.map((country) => (
                    <li key={country.slug}>
                      <Link
                        href={`/${country.slug}`}
                        className="block px-4 py-2 text-sm text-card hover:bg-secondary hover:text-primary transition-colors duration-100"
                        aria-label={`Navigate to ${country.name} salary data`}
                      >
                        {country.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
