export function AboutCTASection() {
  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Explore Salary Data?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Start your journey to better compensation insights today. 
          Explore our comprehensive salary database and make informed career decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/countries" className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Browse Countries
          </a>
          <a href="/" className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    </section>
  );
}
