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
      className="state-card"
    >
      <div className="state-card__container">
        <h3 className="state-card__title">
          {state}
        </h3>
        <div className="state-card__details">
          <div className="state-card__detail-row">
            <span className="state-card__detail-label">Salary Records:</span>
            <span className="state-card__detail-value">{recordCount}</span>
          </div>
          {avgSalary > 0 && (
            <div className="state-card__detail-row">
              <span className="state-card__detail-label">Avg Salary:</span>
              <span className="state-card__detail-value">
                {formatCurrency(avgSalary, countrySlug, undefined)}
              </span>
            </div>
          )}
        </div>
      </div>
    </InstantLink>
  );
}
