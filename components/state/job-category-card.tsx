import { InstantLink } from "@/components/ui/enhanced-link";
import { normalizeSlugForURL } from "@/lib/format/slug";

interface JobCategoryCardProps {
  job: {
    slug: string;
    title: string | null;
    occupation: string | null;
    avgAnnualSalary: number | null;
    avgHourlySalary: number | null;
  };
  country: string;
  state: string;
}

export function JobCategoryCard({ job, country, state }: JobCategoryCardProps) {
  return (
    <InstantLink href={`/${country}/${state}/${normalizeSlugForURL(job.slug)}`} className="group">
      <div className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary mb-2">
          {job.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {job.occupation || 'Professional role'}
        </p>
        
        {job.avgAnnualSalary && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Salary</span>
            <span className="text-lg font-bold text-green-600">
              {job.avgAnnualSalary}
            </span>
          </div>
        )}
        
        {job.avgHourlySalary && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Hourly Rate</span>
            <span className="text-sm font-medium text-primary">
              {job.avgHourlySalary}
            </span>
          </div>
        )}
      </div>
    </InstantLink>
  );
}
