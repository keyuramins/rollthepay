import { JobCategoryCard } from "./job-category-card";

interface JobCategoriesSectionProps {
  jobs: Array<{
    slug: string;
    title: string;
    occupation?: string | null;
    avgAnnualSalary?: string | number | null;
    avgHourlySalary?: string | number | null;
  }>;
  stateName: string;
  country: string;
}

export function JobCategoriesSection({ jobs, stateName, country }: JobCategoriesSectionProps) {
  return (
    <section className="job-categories-section">
      <div className="job-categories-section__container">
        <h2 className="job-categories-section__title">
          Salary Records in {stateName}
        </h2>
        
        <div className="job-categories-section__grid">
          {jobs.map((job) => (
            <JobCategoryCard 
              key={job.slug} 
              job={job} 
              country={country} 
              state={stateName.toLowerCase().replace(/\s+/g, '-')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
