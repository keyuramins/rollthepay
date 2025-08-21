import { Badge } from "@/components/ui/badge";

interface LocationHeroSectionProps {
  locationName: string;
  stateName: string;
  countryName: string;
  jobCount: number;
}

export function LocationHeroSection({ 
  locationName, 
  stateName, 
  countryName, 
  jobCount 
}: LocationHeroSectionProps) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Salary Data in {locationName}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover comprehensive salary information and career opportunities in {locationName}, {stateName}. 
            Get detailed compensation data for various occupations and experience levels.
          </p>
          

        </div>
      </div>
    </section>
  );
}
