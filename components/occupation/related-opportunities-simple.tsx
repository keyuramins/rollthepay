import { InstantLink as Link } from "@/components/ui/enhanced-link";
import type { OccupationRecord } from "@/lib/data/types";
import type { PuterAIGeneratedContent } from "@/lib/ai/puter-ai";
import { getIndustryCategory, calculateTitleSimilarity } from "@/lib/utils/similarity";
import { Card, CardContent, CardHeader } from "../ui/card";

// Helper function to normalize slugs for URLs (handles special characters)
function normalizeSlugForURL(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}

interface CareerProgressionSectionProps {
  content: PuterAIGeneratedContent | undefined;
  record: OccupationRecord;
  allOccupations: Array<{
    country: string;
    title: string;
    slug: string;
    state: string | null;
    location: string | null;
  }>;
}

export function RelatedOpportunitiesSimple({ content, record, allOccupations }: CareerProgressionSectionProps) {
  // Find related occupations using a hybrid approach
  const findRelatedOccupations = () => {
    const currentTitle = record.title?.toLowerCase() || '';
    const currentIndustry = getIndustryCategory(record.title);
    
    const related = allOccupations
      .filter(occ => {
        // Skip the current occupation
        if (occ.slug === record.slug_url) return false;
        
        // Must be in the same country
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
      .slice(0, 6); // Limit to 6 most relevant occupations

    // Return only relevant matches, even if fewer than 6
    return related;
  };

  const relatedOccupations = findRelatedOccupations();

  return (
    <section className="card-section pb-8">
      <Card>
        <CardHeader>
          <h3>Explore Related Roles in {getIndustryCategory(record.title)}</h3>
          <p>Find roles that are similar to your current position in the same industry.</p>
        </CardHeader>
        <CardContent>
              {relatedOccupations.length > 0 && (
                <div className="bg-background rounded-lg p-4 border border-input">
                  <div className="grid grid-cols-1 gap-2">
                    {relatedOccupations.map((occupation, index) => {
                      const industry = getIndustryCategory(occupation.title);
                      const isSameIndustry = industry === getIndustryCategory(record.title);
                      
                      return (
                        <Link
                          prefetch={true}
                          prefetchOnMount={true}
                          prefetchDelay={120}
                          key={index}
                          href={`/${occupation.country.toLowerCase()}${occupation.state ? `/${occupation.state.toLowerCase().replace(/\s+/g, '-')}` : ''}${occupation.location ? `/${occupation.location.toLowerCase().replace(/\s+/g, '-')}` : ''}/${normalizeSlugForURL(occupation.slug)}`}
                          className="flex items-center justify-between bg-card p-3 rounded-lg border border-input hover:border-primary hover:bg-green-100"
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground truncate block">
                              {occupation.title?.replace("Average", "")}
                            </span>
                            {!isSameIndustry && (
                              <span className="text-xs text-muted-foreground">
                                {industry}
                              </span>
                            )}
                          </div>
                          <svg className="w-4 h-4 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
      </Card>
    </section>
  );
}
