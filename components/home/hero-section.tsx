import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getDataset } from "@/lib/data/parse";

export function HeroSection() {
  const { all } = getDataset();
  const occupations = all.map(rec => ({
    country: rec.country.toLowerCase(),
    title: rec.title,
    slug: rec.slug_url,
    state: rec.state ? rec.state : null,
  }));
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 min-h-[70vh] sm:h-[80vh] flex items-center py-12 sm:py-0">
      {/* Accent Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo and Brand */}
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 mb-4 sm:mb-5 shadow-lg">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
            RollThePay
          </h1>
          
          <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Get accurate salary insights from thousands of employers worldwide 
          </p>
        
          {/* Search Section - Prominent and Centered */}
          <div className="mb-6 sm:mb-8 text-left">
            <div className="max-w-xl mx-auto px-2">
              <SearchableDropdown 
                variant="light" 
                placeholder="Search countries..." 
                fullWidth={true}
                centered={true}
                className="transform transition-all duration-300 hover:scale-105"
                allOccupations={occupations}
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center px-2">
            <Link href="/countries">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg cursor-pointer w-full sm:w-auto"
              >
                Explore All Countries
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}