import Link from "next/link";
import { formatCurrency } from "@/lib/format/currency";

// Helper function to normalize slugs for URLs (handles special characters)
function normalizeSlugForURL(slug: string): string {
  return slug
    .replace(/#/g, '-sharp')  // Replace # with -sharp
    .replace(/\+/g, '-plus'); // Replace + with -plus
}

interface OccupationCategoryCardProps {
  occupation: string;
  records: Array<{
    slug_url: string;
    title: string;
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{occupation}</h3>
        <div className="text-sm text-gray-500">
          {records.length} {records.length === 1 ? 'salary record' : 'salary records'}
        </div>
      </div>
      
      <div className="space-y-4">
        {avgSalary > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Average Salary:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(avgSalary, countrySlug, undefined)}
            </span>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-3">
            {records.slice(0, 5).map((record) => (
              <Link
                key={record.slug_url}
                href={`/${countrySlug}${record.state ? `/${record.state.toLowerCase().replace(/\s+/g, '-')}` : ''}${record.location ? `/${record.location.toLowerCase().replace(/\s+/g, '-')}` : ''}/${normalizeSlugForURL(record.slug_url)}`}
                className="block p-3 rounded-md border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {record.title}
                    </h4>
                    {record.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {record.location}
                        {record.state && `, ${record.state}`}
                      </p>
                    )}
                  </div>
                  {record.avgAnnualSalary && (
                    <div className="text-sm font-medium text-gray-900 ml-4">
                      {formatCurrency(record.avgAnnualSalary, countrySlug, undefined)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
            
            {records.length > 5 && (
              <div className="text-center pt-2">
                <Link
                  href={`/${countrySlug}?occupation=${encodeURIComponent(occupation)}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all {records.length} {occupation} salary records →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
