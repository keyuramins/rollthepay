import Link from "next/link";

export function CountryCTASection() {
  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Explore More Salary Data?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Discover salary information for specific jobs, compare compensation across regions, 
          and get the insights you need to advance your career.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link href="/" prefetch={true}>
            <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
