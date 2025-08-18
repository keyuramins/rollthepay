"use client";

import { useState } from "react";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <NavLinks />
          </div>

          {/* Global Search - Desktop */}
          <div className="hidden md:block">
            <SearchableDropdown placeholder="Search countries..." />
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
            <div className="p-4">
              <SearchableDropdown placeholder="Search countries..." fullWidth={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}