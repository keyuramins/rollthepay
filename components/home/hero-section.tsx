import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getDataset } from "@/lib/data/parse";

export async function HeroSection() {
  const { all } = await getDataset();
  const occupations = all.map(rec => ({
    country: rec.country.toLowerCase(),
    title: rec.title,
    slug: rec.slug_url,
    state: rec.state ? rec.state : null,
    location: rec.location ? rec.location : null,
  }));
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 min-h-[50vh] sm:h-[65vh] flex items-center py-12 sm:py-0">
 

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
          <div className="sm:mb-8 text-left">
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


        </div>
      </div>
    </section>
  );
}