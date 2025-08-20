"use client";

import { useState, useRef } from "react";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

// Define continents and their countries based on available data
const continents = [
  {
    name: "Africa",
    code: "africa",
    countries: [
      { name: "South Africa", slug: "south-africa" },
      { name: "Nigeria", slug: "nigeria" },
      { name: "Kenya", slug: "kenya" },
      { name: "Egypt", slug: "egypt" },
      { name: "Morocco", slug: "morocco" },
      { name: "Ghana", slug: "ghana" },
      { name: "Ethiopia", slug: "ethiopia" },
      { name: "Tanzania", slug: "tanzania" },
      { name: "Uganda", slug: "uganda" },
      { name: "Algeria", slug: "algeria" }
    ]
  },
  {
    name: "Asia",
    code: "asia",
    countries: [
      { name: "India", slug: "india" },
      { name: "China", slug: "china" },
      { name: "Japan", slug: "japan" },
      { name: "South Korea", slug: "south-korea" },
      { name: "Singapore", slug: "singapore" },
      { name: "Thailand", slug: "thailand" },
      { name: "Vietnam", slug: "vietnam" },
      { name: "Malaysia", slug: "malaysia" },
      { name: "Indonesia", slug: "indonesia" },
      { name: "Philippines", slug: "philippines" }
    ]
  },
  {
    name: "Europe",
    code: "europe",
    countries: [
      { name: "United Kingdom", slug: "united-kingdom" },
      { name: "Germany", slug: "germany" },
      { name: "France", slug: "france" },
      { name: "Italy", slug: "italy" },
      { name: "Spain", slug: "spain" },
      { name: "Netherlands", slug: "netherlands" },
      { name: "Switzerland", slug: "switzerland" },
      { name: "Sweden", slug: "sweden" },
      { name: "Norway", slug: "norway" },
      { name: "Denmark", slug: "denmark" }
    ]
  },
  {
    name: "Middle East",
    code: "middle_east",
    countries: [
      { name: "United Arab Emirates", slug: "united-arab-emirates" },
      { name: "Saudi Arabia", slug: "saudi-arabia" },
      { name: "Israel", slug: "israel" },
      { name: "Turkey", slug: "turkey" },
      { name: "Qatar", slug: "qatar" },
      { name: "Kuwait", slug: "kuwait" },
      { name: "Bahrain", slug: "bahrain" },
      { name: "Oman", slug: "oman" },
      { name: "Jordan", slug: "jordan" },
      { name: "Lebanon", slug: "lebanon" }
    ]
  },
  {
    name: "North America",
    code: "north_america",
    countries: [
      { name: "United States", slug: "united-states" },
      { name: "Canada", slug: "canada" },
      { name: "Mexico", slug: "mexico" },
      { name: "Costa Rica", slug: "costa-rica" },
      { name: "Panama", slug: "panama" },
      { name: "Guatemala", slug: "guatemala" },
      { name: "Honduras", slug: "honduras" },
      { name: "El Salvador", slug: "el-salvador" },
      { name: "Nicaragua", slug: "nicaragua" },
      { name: "Belize", slug: "belize" }
    ]
  },
  {
    name: "Oceania",
    code: "oceania",
    countries: [
      { name: "Australia", slug: "australia" },
      { name: "New Zealand", slug: "new-zealand" },
      { name: "Fiji", slug: "fiji" },
      { name: "Papua New Guinea", slug: "papua-new-guinea" },
      { name: "Solomon Islands", slug: "solomon-islands" },
      { name: "Vanuatu", slug: "vanuatu" },
      { name: "Samoa", slug: "samoa" },
      { name: "Tonga", slug: "tonga" },
      { name: "Micronesia", slug: "micronesia" },
      { name: "Palau", slug: "palau" }
    ]
  },
  {
    name: "South America",
    code: "south_america",
    countries: [
      { name: "Brazil", slug: "brazil" },
      { name: "Argentina", slug: "argentina" },
      { name: "Chile", slug: "chile" },
      { name: "Colombia", slug: "colombia" },
      { name: "Peru", slug: "peru" },
      { name: "Venezuela", slug: "venezuela" },
      { name: "Ecuador", slug: "ecuador" },
      { name: "Bolivia", slug: "bolivia" },
      { name: "Paraguay", slug: "paraguay" },
      { name: "Uruguay", slug: "uruguay" }
    ]
  }
];

export function NewHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (continentCode: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredContinent(continentCode);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredContinent(null);
    }, 300);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Continent Dropdowns - Desktop - Centered */}
          <div className="hidden md:flex space-x-4 flex-1 justify-center">
            {continents.map((continent) => (
              <div
                key={continent.code}
                className="relative"
                onMouseEnter={() => handleMouseEnter(continent.code)}
                onMouseLeave={handleMouseLeave}
              >
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <span>{continent.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {/* Dropdown Content */}
                {hoveredContinent === continent.code && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border border-gray-200"
                    onMouseEnter={() => handleMouseEnter(continent.code)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
                        {continent.name}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {continent.countries.map((country) => (
                          <a
                            key={country.slug}
                            href={`/${country.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                          >
                            {country.name}
                          </a>
                        ))}
                        {/* View All Option */}
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <a
                            href="/countries"
                            className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                          >
                            All Countries
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* About Link - Right Corner */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <NavLinks mobile={true} />
            <div className="p-4 space-y-2">
              {continents.map((continent, idx) => (
                <div key={continent.code} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-md">
                    {continent.name}
                  </div>
                  {continent.countries.map((country) => (
                    <a
                      key={country.slug}
                      href={`/${country.slug}`}
                      className="block px-6 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      {country.name}
                    </a>
                  ))}
                  {/* View All Option for Mobile */}
                  {
                    continents.length === idx + 1 && (
                      <a
                        href="/countries"
                        className="block px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        All Countries
                      </a>
                    )
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
