import Link from "next/link";
import { formatCurrency } from "@/lib/format/currency";

interface StateCardProps {
  state: string;
  recordCount: number;
  avgSalary: number;
  countrySlug: string;
}

export function StateCard({ state, recordCount, avgSalary, countrySlug }: StateCardProps) {
  return (
    <Link
      href={`/${countrySlug}/${state?.toLowerCase().replace(/\s+/g, '-') || ''}`}
      className="block group"
    >
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {state}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Salary Records:</span>
            <span className="font-medium text-gray-900">{recordCount}</span>
          </div>
          {avgSalary > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Salary:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(avgSalary, countrySlug, undefined)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
