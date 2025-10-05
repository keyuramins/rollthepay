import { InstantLink } from "@/components/ui/enhanced-link";
import { normalizeSlugForURL } from "@/lib/format/slug";

interface JobCategoryCardProps {
  job: {
    slug: string;
    title: string;
    occupation?: string | null;
    avgAnnualSalary?: string | number | null;
    avgHourlySalary?: string | number | null;
  };
  country: string;
  state: string;
}

export function JobCategoryCard({ job, country, state }: JobCategoryCardProps) {
  return (
    <InstantLink href={`/${country}/${state}/${normalizeSlugForURL(job.slug)}`} className="job-category-card">
      <div className="job-category-card__container">
        <h3 className="job-category-card__title">
          {job.title}
        </h3>
        <p className="job-category-card__occupation">
          {job.occupation || 'Professional role'}
        </p>
        
        {job.avgAnnualSalary && (
          <div className="job-category-card__salary-row">
            <span className="job-category-card__salary-label">Average Salary</span>
            <span className="job-category-card__salary-value">
              {job.avgAnnualSalary}
            </span>
          </div>
        )}
        
        {job.avgHourlySalary && (
          <div className="job-category-card__salary-row--hourly">
            <span className="job-category-card__salary-label">Hourly Rate</span>
            <span className="job-category-card__hourly-value">
              {job.avgHourlySalary}
            </span>
          </div>
        )}
      </div>
    </InstantLink>
  );
}
