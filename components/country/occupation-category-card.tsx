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
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{occupation}</h3>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Average Salary</div>
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(avgSalary, countrySlug, undefined)}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-muted-foreground">
          {records.length} salary record{records.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <div className="grid grid-cols-1 gap-3">
          {records.slice(0, 5).map((record) => (
            <InstantLink
              key={record.slug_url}
              href={`/${countrySlug}${record.state ? `/${record.state.toLowerCase().replace(/\s+/g, '-')}` : ''}${record.location ? `/${record.location.toLowerCase().replace(/\s+/g, '-')}` : ''}/${normalizeSlugForURL(record.slug_url)}`}
              className="block p-3 rounded-md border hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {record.title}
                  </h4>
                  {record.location && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {record.location}
                      {record.state && `, ${record.state}`}
                    </p>
                  )}
                </div>
                {record.avgAnnualSalary && (
                  <div className="text-sm font-medium text-foreground ml-4">
                    {formatCurrency(record.avgAnnualSalary, countrySlug, undefined)}
                  </div>
                )}
              </div>
            </InstantLink>
          ))}
          
          {records.length > 5 && (
            <div className="text-center pt-2">
              <InstantLink
                href={`/${countrySlug}?occupation=${encodeURIComponent(occupation)}`}
                className="text-primary hover:text-primary/80 text-sm font-medium"
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
