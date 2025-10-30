//components/occupation/related-opportunities-smart.tsx
import type { OccupationRecord } from "@/lib/data/types";
import { 
  calculateSalaryDifference,
  calculateTitleSimilarity
} from "@/lib/utils/similarity";
import { getJobCategory } from "@/components/occupation/job-category-detector";
import { formatCurrency } from "@/lib/format/currency";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Building, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { encodeSlugForURL, slugify } from "@/lib/format/slug";

// Helper function to generate occupation URL
function generateOccupationURL(occupation: OccupationRecord): string {
  const country = slugify(occupation.country);
  const state = occupation.state ? `/${slugify(occupation.state)}` : '';
  const slug = encodeSlugForURL(occupation.slug_url);
  
  return `/${country}${state}/${slug}`;
}

interface RelatedOpportunitiesEnhancedProps {
  record: OccupationRecord;
  allRecords: OccupationRecord[];
}

interface RelatedOccupationCardProps {
  occupation: OccupationRecord;
  currentRecord: OccupationRecord;
  showSalaryComparison?: boolean;
}

interface LocationOpportunityProps {
  location: string;
  type: 'city' | 'state' | 'country';
  salary: number | null;
  currentSalary: number | null;
  country: string;
  occupation: OccupationRecord; // Add occupation data for URL generation
}

function RelatedOccupationCard({ occupation, currentRecord, showSalaryComparison = true }: RelatedOccupationCardProps) {
  const salaryDiff = calculateSalaryDifference(currentRecord.avgAnnualSalary, occupation.avgAnnualSalary);
  const industry = getJobCategory(occupation.title || '');
  const occupationURL = generateOccupationURL(occupation);

  return (
    <Link
      href={occupationURL}
      className="bg-card rounded-xl p-6 border border-input hover:border-primary hover:shadow-md hover:bg-green-100 cursor-pointer flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <h4 className="line-clamp-2">{occupation.title}</h4>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{occupation.location || occupation.state || occupation.country}</span>
            </div>
            <Badge variant="green" className="text-sm">
              {industry}
            </Badge>
          </div>
        </div>

        {showSalaryComparison && occupation.avgAnnualSalary && (
          <div className="mb-0 px-4 py-2 bg-secondary/50 rounded-lg border border-secondary/30 relative mt-auto">
            <div className="text-sm">
              <div className="flex items-center gap-1.5 overflow-hidden pt-2">
                <span className="text-muted-foreground font-medium whitespace-nowrap leading-tight tracking-tight min-w-0 text-[13px] sm:text-[14px] md:text-[15px]">
                  {formatCurrency(currentRecord.avgAnnualSalary, currentRecord.country)}
                </span>
                <span className="text-primary font-bold shrink-0 text-base sm:text-lg">→</span>
                <span className="text-muted-foreground font-medium whitespace-nowrap leading-tight tracking-tight min-w-0 text-[13px] sm:text-[14px] md:text-[15px]">
                  {formatCurrency(occupation.avgAnnualSalary, occupation.country)}
                </span>
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full shrink-0 absolute top-0 right-2 -translate-y-1/2 shadow ring-1 ring-black/5 ${
                  salaryDiff.startsWith('+') ? 'text-green-700 bg-green-100' : 
                  salaryDiff.startsWith('-') ? 'text-red-700 bg-red-100' : 
                  'text-muted-foreground bg-muted'
                }`}
              >
                {salaryDiff}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function LocationOpportunityCard({ location, type, salary, currentSalary, country, occupation }: LocationOpportunityProps) {
  const salaryDiff = calculateSalaryDifference(currentSalary, salary);
  const icon = type === 'city' ? MapPin : type === 'state' ? Building : Users;
  const IconComponent = icon;
  const occupationURL = generateOccupationURL(occupation);

  return (
    <Link
      href={occupationURL}
      className="bg-secondary/5 rounded-lg p-4 border border-input hover:border-secondary/40 hover:shadow-md hover:bg-secondary/10 cursor-pointer flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-secondary" />
            <h4 className="line-clamp-2">{location}</h4>
          </div>
          <Badge variant="green" className="text-sm">
            {type}
          </Badge>
        </div>

        {salary && (
          <div className="mt-auto relative">
            <div className="metric-value whitespace-nowrap leading-tight tracking-tight min-w-0 pr-16 sm:pr-20 text-[13px] sm:text-[14px] md:text-[15px]">
              {formatCurrency(salary, country)}
            </div>
            <div
              className={`text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full shrink-0 absolute top-0 right-2 -translate-y-1/2 shadow ring-1 ring-black/5 ${
                salaryDiff.startsWith('+') ? 'text-green-700 bg-green-100' : 
                salaryDiff.startsWith('-') ? 'text-red-700 bg-red-100' : 
                'text-muted-foreground bg-muted'
              }`}
            >
              {salaryDiff}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}


export function RelatedOpportunitiesSmart({ record, allRecords }: RelatedOpportunitiesEnhancedProps) {
  // Find intelligent related occupations
  const normalizeCountry = (c: string) => c?.toLowerCase().trim();
  const currentCountry = normalizeCountry(record.country);
  const findIntelligentRelatedOccupations = (): OccupationRecord[] => {
    const currentTitle = record.occ_name?.toLowerCase().trim() || '';
    const currentIndustry = getJobCategory(record.occ_name || '');
  
    return allRecords
      .filter((occ) => {
        if (!occ.occ_name || !occ.country) return false;
  
        const candidateCountry = normalizeCountry(occ.country);
        const candidateTitle = occ.occ_name.toLowerCase().trim();
        const candidateIndustry = getJobCategory(occ.occ_name);
  
        // Skip same record
        if (occ.slug_url === record.slug_url) return false;
  
        // Same country only
        if (candidateCountry.toLowerCase().trim() !== currentCountry.toLowerCase().trim()) return false;
  
        const titleSimilarity = calculateTitleSimilarity(currentTitle, candidateTitle);
        const sameCategory = currentIndustry === candidateIndustry;
  
        // Allow looser match in same category
        if (sameCategory && titleSimilarity >= 0.05) return true;
  
        // Strong title match across categories
        if (!sameCategory && titleSimilarity >= 0.45) return true;
  
        // Common progression patterns
        const progressionPatterns = [
          ['junior', 'senior'],
          ['assistant', 'manager'],
          ['analyst', 'senior'],
          ['coordinator', 'manager'],
          ['specialist', 'lead'],
          ['associate', 'senior'],
        ];
        for (const [from, to] of progressionPatterns) {
          if (currentTitle.includes(from) && candidateTitle.includes(to) && sameCategory) {
            return true;
          }
        }
  
        return false;
      })
      .sort((a, b) => {
        const similarityA = calculateTitleSimilarity(currentTitle, a.occ_name?.toLowerCase().trim() || '');
        const similarityB = calculateTitleSimilarity(currentTitle, b.occ_name?.toLowerCase().trim() || '');
        return similarityB - similarityA;
      })
      .slice(0, 6);
  };
  
  

  // Find related locations
  const findRelatedLocations = (): LocationOpportunityProps[] => {
    const locationMap = new Map<string, LocationOpportunityProps>();
    
    allRecords
      .filter(occ => {
        // Same occupation type
        if (occ.occ_name?.toLowerCase() !== record.occ_name?.toLowerCase()) return false;
        
        // Different location
        if (occ.country === record.country && 
            occ.state === record.state && 
            occ.location === record.location) return false;
        
        // Same country
        return occ.country.toLowerCase() === record.country.toLowerCase();
      })
      .forEach(occ => {
        const location = occ.location || occ.state || occ.country;
        const type = occ.location ? 'city' : occ.state ? 'state' : 'country';
        const key = `${location}-${type}`;
        
        if (!locationMap.has(key) || (occ.avgAnnualSalary && !locationMap.get(key)?.salary)) {
          locationMap.set(key, {
            location,
            type,
            salary: occ.avgAnnualSalary,
            currentSalary: record.avgAnnualSalary,
            country: occ.country,
            occupation: occ
          });
        }
      });
    
    return Array.from(locationMap.values()).slice(0, 6);
  };

  const relatedOccupations = findIntelligentRelatedOccupations();
  const relatedLocations = findRelatedLocations();

  // Don't render if no related data
  if (relatedOccupations.length === 0 && relatedLocations.length === 0) {
    return null;
  }

  return (
    <section className="pt-8 space-y-8 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <h3>Career Progression Opportunities</h3>
          <p>Discover similar roles and geographic opportunities based on your current position. Below are the roles and locations that are similar to your current position. It also provides a salary comparison to your current position.</p>
        </CardHeader>
        <CardContent>
        {relatedOccupations.length > 0 && (
          <div className="mb-8 last:mb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {relatedOccupations.map(occ => (
                <RelatedOccupationCard 
                  key={generateOccupationURL(occ)}
                  occupation={occ}
                  currentRecord={record}
                  showSalaryComparison={true}
                />
              ))}
            </div>
          </div>
        )}

        {relatedLocations.length > 0 && (
          <div className="mb-8 last:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h4>Geographic Opportunities</h4>
              </div>
              <div className="mb-6">
              <p>Discover below the locations that pays for your current position.</p>
              <p>It also provides a salary comparison to your current position based on different locations.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {relatedLocations.map((loc, index) => (
                <LocationOpportunityCard 
                  key={`${loc.location}-${loc.type}-${index}`}
                  location={loc.location}
                  type={loc.type}
                  salary={loc.salary}
                  currentSalary={loc.currentSalary}
                  country={loc.country}
                  occupation={loc.occupation}
                />
              ))}
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </section>
  );
}
