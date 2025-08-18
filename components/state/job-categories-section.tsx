import { JobCategoryCard } from "./job-category-card";

interface JobCategoriesSectionProps {
  jobs: Array<{
    slug: string;
    title: string;
    occupation?: string;
    avgAnnualSalary?: string;
    avgHourlySalary?: string;
  }>;
  stateName: string;
  country: string;
}

export function JobCategoriesSection({ jobs, stateName, country }: JobCategoriesSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Salary Records in {stateName}
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
