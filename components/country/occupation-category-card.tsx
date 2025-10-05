import { InstantLink } from "@/components/ui/enhanced-link";
import { formatCurrency } from "@/lib/format/currency";
import { normalizeSlugForURL } from "@/lib/format/slug";

interface OccupationCategoryCardProps {
  occupation: string;
  records: Array<{
    slug_url: string;
    title: string | null;
    location?: string;
    state?: string;
    avgAnnualSalary?: number;
  }>;
  countrySlug: string;
  avgSalary: number;
}

export function OccupationCategoryCard({ 
  occupation, 
  records, 
  countrySlug, 
  avgSalary 
}: OccupationCategoryCardProps) {
  return (
    <div className="occupation-category-card">
      <div className="occupation-category-card__header">
        <h3 className="occupation-category-card__title">{occupation}</h3>
        <div className="occupation-category-card__salary">
          <div className="occupation-category-card__salary-label">Average Salary</div>
          <div className="occupation-category-card__salary-value">
            {formatCurrency(avgSalary, countrySlug, undefined)}
          </div>
        </div>
      </div>
      
      <div className="occupation-category-card__count">
        <div className="occupation-category-card__count-text">
          {records.length} salary record{records.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="occupation-category-card__records">
        <div className="occupation-category-card__records-grid">
          {records.slice(0, 5).map((record) => (
            <InstantLink
              key={record.slug_url}
              href={`/${countrySlug}${record.state ? `/${record.state.toLowerCase().replace(/\s+/g, '-')}` : ''}${record.location ? `/${record.location.toLowerCase().replace(/\s+/g, '-')}` : ''}/${normalizeSlugForURL(record.slug_url)}`}
              className="occupation-category-card__record-link"
            >
              <div className="occupation-category-card__record-content">
                <div className="occupation-category-card__record-info">
                  <h4 className="occupation-category-card__record-title">
                    {record.title}
                  </h4>
                  {record.location && (
                    <p className="occupation-category-card__record-location">
                      📍 {record.location}
                      {record.state && `, ${record.state}`}
                    </p>
                  )}
                </div>
                {record.avgAnnualSalary && (
                  <div className="occupation-category-card__record-salary">
                    {formatCurrency(record.avgAnnualSalary, countrySlug, undefined)}
                  </div>
                )}
              </div>
            </InstantLink>
          ))}
          
          {records.length > 5 && (
            <div className="occupation-category-card__view-all">
              <InstantLink
                href={`/${countrySlug}?occupation=${encodeURIComponent(occupation)}`}
                className="occupation-category-card__view-all-link"
              >
                View all {records.length} {occupation} salary records →
              </InstantLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
