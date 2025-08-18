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
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 h-[80vh] flex items-center">
      {/* Accent Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo and Brand */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 mb-5 shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            RollThePay
          </h1>
          
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Get accurate salary insights from thousands of employers worldwide 
          </p>
        
          {/* Search Section - Prominent and Centered */}
          <div className="mb-8 text-left">
            <div className="max-w-xl mx-auto">
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
          <div className="flex justify-center">
            <Link href="/countries">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg cursor-pointer"
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