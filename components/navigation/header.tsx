"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Globe, ChevronDown } from "lucide-react";

interface Country {
  name: string;
  code: string;
  continent: string;
  slug: string;
}

const CONTINENTS = [
  { name: "Africa", code: "africa" },
  { name: "Asia", code: "asia" },
  { name: "Europe", code: "europe" },
  { name: "Middle East", code: "middle_east" },
  { name: "North America", code: "north_america" },
  { name: "Oceania", code: "oceania" },
  { name: "South America", code: "south_america" },
];

const COUNTRIES: Country[] = [
  { name: "Australia", code: "AU", continent: "oceania", slug: "australia" },
  { name: "India", code: "IN", continent: "asia", slug: "india" },
  { name: "United States", code: "US", continent: "north_america", slug: "united-states" },
  { name: "United Kingdom", code: "GB", continent: "europe", slug: "united-kingdom" },
  { name: "Canada", code: "CA", continent: "north_america", slug: "canada" },
  { name: "Germany", code: "DE", continent: "europe", slug: "germany" },
  { name: "France", code: "FR", continent: "europe", slug: "france" },
  { name: "Japan", code: "JP", continent: "asia", slug: "japan" },
  { name: "Brazil", code: "BR", continent: "south_america", slug: "brazil" },
  { name: "South Africa", code: "ZA", continent: "africa", slug: "south-africa" },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(COUNTRIES);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCountries(COUNTRIES);
    } else {
      const filtered = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.continent.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery]);

  const groupedCountries = CONTINENTS.map(continent => ({
    ...continent,
    countries: filteredCountries.filter(country => country.continent === continent.code)
  })).filter(group => group.countries.length > 0);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Roll The Pay</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/countries" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Countries
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              About
            </Link>
          </nav>

          {/* Global Search and Country Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>Countries</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isCountryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1 max-h-96 overflow-y-auto">
                    {groupedCountries.map((continent) => (
                      <div key={continent.code}>
                        <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
                          {continent.name}
                        </div>
                        {continent.countries.map((country) => (
                          <Link
                            key={country.code}
                            href={`/${country.slug}`}
                            onClick={() => setIsCountryDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {country.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
