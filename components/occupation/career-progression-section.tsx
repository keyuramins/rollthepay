import Link from "next/link";
import type { OccupationRecord } from "@/lib/data/types";
import type { AIGeneratedContent } from "@/lib/ai/content-generator";

// Helper function to normalize slugs for URLs (handles special characters)
function normalizeSlugForURL(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}

interface CareerProgressionSectionProps {
  content: AIGeneratedContent;
  record: OccupationRecord;
  allOccupations: Array<{
    country: string;
    title: string;
    slug: string;
    state: string | null;
    location: string | null;
  }>;
}

export function CareerProgressionSection({ content, record, allOccupations }: CareerProgressionSectionProps) {
  // Find related occupations based on the current record's data
  const findRelatedOccupations = () => {
    const currentOccupation = record.occupation?.toLowerCase() || record.title?.toLowerCase() || '';
    const currentSkills = [
      record.skillsNameOne?.toLowerCase(),
      record.skillsNameTwo?.toLowerCase(),
      record.skillsNameThree?.toLowerCase()
    ].filter(Boolean);

    // Filter occupations that might be related
    const related = allOccupations
      .filter(occ => {
        // Skip the current occupation
        if (occ.slug === record.slug_url) return false;
        
        // Must be in the same country
        if (occ.country.toLowerCase() !== record.country.toLowerCase()) return false;
        
        // Prefer same state/location if available
        const sameLocation = !record.state || occ.state === record.state;
        const sameCity = !record.location || occ.location === record.location;
        
        return sameLocation && sameCity;
      })
      .slice(0, 6); // Limit to 6 related occupations

    return related;
  };

  const relatedOccupations = findRelatedOccupations();

  // Generate related opportunities using AI content
  const relatedOpportunities = content.relatedOpportunities;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-gray-900 mb-4">
             Career Opportunities
           </h2>
           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
             Explore related opportunities and career paths in your field
           </p>
         </div>

         <div className="grid grid-cols-1 gap-8">

          {/* Related Opportunities */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Related Opportunities</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {relatedOpportunities}
              </p>
              
              {relatedOccupations.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Explore Related Roles</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {relatedOccupations.map((occupation, index) => (
                      <Link
                        key={index}
                        href={`/${occupation.country.toLowerCase()}${occupation.state ? `/${occupation.state.toLowerCase().replace(/\s+/g, '-')}` : ''}${occupation.location ? `/${occupation.location.toLowerCase().replace(/\s+/g, '-')}` : ''}/${normalizeSlugForURL(occupation.slug)}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
                      >
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {occupation.title?.replace("Average", "")}
                        </span>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Career Development Tips */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Career Development Strategies
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Build a successful career path with these strategic insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Continuous Learning</h4>
              <p className="text-gray-600 text-sm">
                Stay updated with industry trends and new technologies to remain competitive
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Network Building</h4>
              <p className="text-gray-600 text-sm">
                Connect with professionals in your field to discover new opportunities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Skill Certification</h4>
              <p className="text-gray-600 text-sm">
                Obtain relevant certifications to validate your expertise and advance your career
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
