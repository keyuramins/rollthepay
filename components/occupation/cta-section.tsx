import Link from "next/link";

interface OccupationCTASectionProps {
  countryName: string;
  locationText: string;
}

export function OccupationCTASection({ countryName, locationText }: OccupationCTASectionProps) {
  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Explore More Salary Data
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Compare salaries across different locations and discover career opportunities 
          in {locationText}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${countryName.toLowerCase().replace(/\s+/g, '-')}`}>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              View All Salary Data in {countryName}
            </button>
          </Link>

        </div>
      </div>
    </section>
  );
}
