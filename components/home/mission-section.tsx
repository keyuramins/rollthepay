export function MissionSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We make it easier to find information on salaries of specific jobs, providing reliable access to accurate data so everyone can get more out of their career.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              How Much Should You Earn?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Many people are interested in knowing how much they should be paid for their job. Because this varies so widely depending on many factors, simply asking can be difficult.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Roll The Pay offers you a way to find this information without asking. All of this is available by simply browsing our website, with data specific to particular countries and salary ranges.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Find Your Average Salary
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We have already published over a million salaries from thousands of employers around the globe. Data isn't always easy to find, so we have made it our mission to compile as much information as possible.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This is an excellent opportunity for people who want to learn about the average salary of a particular profession but aren't sure how to do so.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
