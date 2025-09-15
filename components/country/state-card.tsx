import { InstantLink } from "@/components/ui/enhanced-link";
import { formatCurrency } from "@/lib/format/currency";

interface StateCardProps {
  state: string;
  recordCount: number;
  avgSalary: number;
  countrySlug: string;
}

export function StateCard({ state, recordCount, avgSalary, countrySlug }: StateCardProps) {
  return (
    <InstantLink
      href={`/${countrySlug}/${state?.toLowerCase().replace(/\s+/g, '-') || ''}`}
      className="block group"
    >
      <div className="bg-muted rounded-lg border p-6 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {state}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Salary Records:</span>
            <span className="font-medium text-foreground">{recordCount}</span>
          </div>
          {avgSalary > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Salary:</span>
              <span className="font-medium text-foreground">
                {formatCurrency(avgSalary, countrySlug, undefined)}
              </span>
            </div>
          )}
        </div>
      </div>
    </InstantLink>
  );
}
