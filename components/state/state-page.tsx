import Link from "next/link";
import { NewHeader } from "@/components/navigation/new-header";
import { Breadcrumbs } from "@/components/occupation/breadcrumbs";
import { StateHeroSection } from "./state-hero-section";
import { OccupationList } from "@/components/ui/occupation-list";
import { getStateData, getDataset } from "@/lib/data/parse";

interface StatePageProps {
  country: string;
  state: string;
}

export function StatePage({ country, state }: StatePageProps) {
  const stateGroups = getStateData(country);
  const stateData = stateGroups.get(state);
  
  if (!stateData) {
    return null; // This should be handled by the parent component
  }
  
  const countryName = getDataset().all.find(r => r.country.toLowerCase() === country)?.country || country;
  const stateName = stateData.name;
  const jobs = stateData.jobs;
  
  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Countries", href: "/countries" },
    { name: countryName, href: `/${country}` },
    { name: stateName, href: "#", current: true },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader />
      
      <main>
        {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
        
        <StateHeroSection 
          stateName={stateName}
          countryName={countryName}
          jobCount={jobs.length}
        />

        <OccupationList 
          items={jobs.map(job => ({
            id: job.slug,
            displayName: job.title || "Unknown Job",
            originalName: job.title || "Unknown Job",
            slug_url: job.slug,
            location: undefined,
            state: undefined,
            avgAnnualSalary: job.avgAnnualSalary,
            countrySlug: country
          }))}
          title={`Salary Records in ${stateName}`}
          description={`Explore salary information and job opportunities in ${stateName}, ${countryName}.`}
          currentState={stateName.toLowerCase().replace(/\s+/g, '-')}
        />

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Explore More Salary Data
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Compare salaries across different locations and discover career opportunities 
              in {stateName}, {countryName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${country}`}>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  View All Salary Data in {countryName}
                </button>
              </Link>
              <Link href="/countries">
                <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Browse All Countries
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
