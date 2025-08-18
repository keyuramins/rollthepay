import Link from "next/link";

interface CountryCardProps {
  country: {
    name: string;
    slug: string;
    count: number;
    avgSalary: number;
  };
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <Link href={`/${country.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="capitalize text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {country.name}
          </h3>
          <div className="text-sm text-gray-500">
            {country.count} salary records
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Average Salary:</span>
            <span className="font-medium text-gray-900">
              {country.avgSalary > 0 
                ? new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(country.avgSalary)
                : 'N/A'
              }
            </span>
          </div>
          
          <div className="pt-3 border-t border-gray-100">
            <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
