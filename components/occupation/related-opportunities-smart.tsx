import type { OccupationRecord } from "@/lib/data/types";
import { 
  getCommonSkills, 
  calculateSalaryDifference,
  getIndustryCategory,
  calculateTitleSimilarity
} from "@/lib/utils/similarity";
import { formatCurrency } from "@/lib/format/currency";
import { Badge } from "@/components/ui/badge";
import { InstantLink as Link } from "@/components/ui/enhanced-link";
import { MapPin, Building, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

// Helper function to normalize slugs for URLs (handles special characters)
function normalizeSlugForURL(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}

// Helper function to generate occupation URL
function generateOccupationURL(occupation: OccupationRecord): string {
  const country = occupation.country.toLowerCase();
  const state = occupation.state ? `/${occupation.state.toLowerCase().replace(/\s+/g, '-')}` : '';
  const location = occupation.location ? `/${occupation.location.toLowerCase().replace(/\s+/g, '-')}` : '';
  const slug = normalizeSlugForURL(occupation.slug_url);
  
  return `/${country}${state}${location}/${slug}`;
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
  const commonSkills = getCommonSkills(currentRecord, occupation);
  const salaryDiff = calculateSalaryDifference(currentRecord.avgAnnualSalary, occupation.avgAnnualSalary);
  const industry = getIndustryCategory(occupation.title);
  const occupationURL = generateOccupationURL(occupation);
  
  return (
    <Link 
      prefetch={true}
      prefetchOnMount={true}
      prefetchDelay={120}
      href={occupationURL}
      className="related-occupation-card related-occupation-card--link"
    >
      <div className="related-occupation-card__header">
        <h4>{occupation.title}</h4>
        <div className="related-occupation-card__location-industry">
          <div className="related-occupation-card__location">
            <MapPin className="related-occupation-card__location-icon" />
            <span>{occupation.location || occupation.state || occupation.country}</span>
          </div>
          <Badge variant="default" className="related-occupation-card__industry-badge">
            {industry}
          </Badge>
        </div>
      </div>
      
      {showSalaryComparison && occupation.avgAnnualSalary && (
        <div className="related-occupation-card__salary">
          <div className="related-occupation-card__salary-row">
            <span className="related-occupation-card__salary-current">
              {formatCurrency(currentRecord.avgAnnualSalary, currentRecord.country)}
            </span>
            <span className="related-occupation-card__salary-arrow">→</span>
            <span className="metric-value">
              {formatCurrency(occupation.avgAnnualSalary, occupation.country)}
            </span>
            <span className={`related-occupation-card__salary-difference ${
              salaryDiff.startsWith('+') ? 'related-occupation-card__salary-difference--positive' : 
              salaryDiff.startsWith('-') ? 'related-occupation-card__salary-difference--negative' : 
              'related-occupation-card__salary-difference--neutral'
            }`}>
              {salaryDiff}
            </span>
          </div>
        </div>
      )}
      
      {commonSkills.length > 0 && (
        <div className="related-occupation-card__skills">
          <div className="related-occupation-card__skills-label">Common Skills:</div>
          <div className="related-occupation-card__skills-list">
            {commonSkills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="blue" className="related-occupation-card__skill-badge">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
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
      prefetch={true}
      prefetchOnMount={true}
      prefetchDelay={120}
      href={occupationURL}
      className="location-opportunity-card location-opportunity-card--link"
    >
      <div className="location-opportunity-card__header">
        <div className="location-opportunity-card__title-section">
          <IconComponent className="location-opportunity-card__icon" />
          <h4>{location}</h4>
        </div>
        <Badge variant="default" className="location-opportunity-card__type">
          {type}
        </Badge>
      </div>
      
      {salary && (
        <div className="location-opportunity-card__salary">
          <div className="location-opportunity-card__salary-row">
            <div className="metric-value">
              {formatCurrency(salary, country)}
            </div>
            <div className={`location-opportunity-card__salary-difference ${
              salaryDiff.startsWith('+') ? 'location-opportunity-card__salary-difference--positive' : 
              salaryDiff.startsWith('-') ? 'location-opportunity-card__salary-difference--negative' : 
              'location-opportunity-card__salary-difference--neutral'
            }`}>
              {salaryDiff}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}

export function RelatedOpportunitiesSmart({ record, allRecords }: RelatedOpportunitiesEnhancedProps) {
  // Find intelligent related occupations
  const findIntelligentRelatedOccupations = (): OccupationRecord[] => {
    const currentTitle = record.title?.toLowerCase() || '';
    const currentIndustry = getIndustryCategory(record.title);
    
    return allRecords
      .filter(occ => {
        // Skip current occupation
        if (occ.slug_url === record.slug_url) return false;
        
        // Must be in same country
        if (occ.country.toLowerCase() !== record.country.toLowerCase()) return false;
        
        const candidateTitle = occ.title?.toLowerCase() || '';
        const candidateIndustry = getIndustryCategory(occ.title);
        
        // Industry-based filtering (most important for career progression)
        if (currentIndustry === candidateIndustry) {
          return true; // Same industry is always relevant for career progression
        }
        
        // Title similarity for cross-industry but related roles (more strict)
        const titleWords = currentTitle.split(/\s+/);
        const candidateWords = candidateTitle.split(/\s+/);
        const commonWords = titleWords.filter(word => candidateWords.includes(word));
        
        // If they share significant words AND are in related industries, include them
        if (commonWords.length >= 2) {
          // Only allow cross-industry if they share 3+ words or are in related industries
          const relatedIndustries = {
            'Finance': ['Finance'],
            'Technology': ['Technology'],
            'Healthcare': ['Healthcare'],
            'Education': ['Education'],
            'Sales & Marketing': ['Sales & Marketing'],
            'Legal': ['Legal'],
            'Engineering': ['Engineering'],
            'Construction': ['Construction'],
            'Manufacturing': ['Manufacturing'],
            'Retail': ['Retail'],
            'Hospitality': ['Hospitality'],
            'Transportation': ['Transportation'],
            'Logistics': ['Logistics'],
            'Real Estate': ['Real Estate'],
            'Insurance': ['Insurance'],
            'Banking': ['Banking'],
            'Consulting': ['Consulting'],
            'Government': ['Government'],
            'Non-Profit': ['Non-Profit'],
            'Media': ['Media'],
            'Entertainment': ['Entertainment'],
            'Sports': ['Sports'],
            'Agriculture': ['Agriculture'],
            'Energy': ['Energy'],
            'Telecommunications': ['Telecommunications'],
            'Aerospace': ['Aerospace'],
            'Automotive': ['Automotive'],
            'Pharmaceuticals': ['Pharmaceuticals'],
            'Biotechnology': ['Biotechnology'],
            'Other': ['Other']
          };
          
          const isRelatedIndustry = relatedIndustries[currentIndustry as keyof typeof relatedIndustries]?.includes(candidateIndustry);
          if (commonWords.length >= 3 || isRelatedIndustry) {
            return true;
          }
        }
        
        // Check for specific career progression patterns
        const progressionPatterns = [
          ['junior', 'senior'],
          ['assistant', 'manager'],
          ['analyst', 'senior'],
          ['coordinator', 'manager'],
          ['specialist', 'lead'],
          ['associate', 'senior']
        ];
        
        for (const [from, to] of progressionPatterns) {
          if (currentTitle.includes(from) && candidateTitle.includes(to) && currentIndustry === candidateIndustry) {
            return true;
          }
        }
        
        return false;
      })
      .sort((a, b) => {
        const industryA = getIndustryCategory(a.title);
        const industryB = getIndustryCategory(b.title);
        
        // Prioritize same industry
        if (industryA === currentIndustry && industryB !== currentIndustry) return -1;
        if (industryB === currentIndustry && industryA !== currentIndustry) return 1;
        
        // Then by title similarity
        const titleA = a.title?.toLowerCase() || '';
        const titleB = b.title?.toLowerCase() || '';
        const similarityA = calculateTitleSimilarity(currentTitle, titleA);
        const similarityB = calculateTitleSimilarity(currentTitle, titleB);
        
        return similarityB - similarityA;
      })
      .slice(0, 6); // Limit to 6 most relevant
  };

  // Find related locations
  const findRelatedLocations = (): LocationOpportunityProps[] => {
    const locationMap = new Map<string, LocationOpportunityProps>();
    
    allRecords
      .filter(occ => {
        // Same occupation type
        if (occ.title?.toLowerCase() !== record.title?.toLowerCase()) return false;
        
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
    <section className="card-section">
      <Card>
        <CardHeader>
          <h3>Career Progression Opportunities</h3>
          <p>Discover similar roles and geographic opportunities based on your current position. Below are the roles and locations that are similar to your current position. It also provides a salary comparison to your current position.</p>
        </CardHeader>
        <CardContent>
        {relatedOccupations.length > 0 && (
          <div className="related-opportunities-enhanced__section">
            <div className="related-opportunities-enhanced__occupations-grid">
              {relatedOccupations.map(occ => (
                <RelatedOccupationCard 
                  key={occ.slug_url}
                  occupation={occ}
                  currentRecord={record}
                  showSalaryComparison={true}
                />
              ))}
            </div>
          </div>
        )}

        {relatedLocations.length > 0 && (
          <div className="related-opportunities-enhanced__section">
            <div className="related-opportunities-enhanced__section-header">
              <MapPin className="related-opportunities-enhanced__section-icon" />
              <h4>Geographic Opportunities</h4>
            </div>
            <div className="related-opportunities-enhanced__locations-grid">
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
