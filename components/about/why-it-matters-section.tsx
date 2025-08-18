export function WhyItMattersSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Salary Transparency Matters
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access to accurate salary information benefits everyone in the workforce ecosystem.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              For Job Seekers
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Negotiate better compensation packages
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Make informed career decisions
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Understand market value for skills
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Plan career transitions effectively
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              For Employers
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Set competitive compensation rates
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Attract and retain top talent
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Ensure pay equity and fairness
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Make informed hiring decisions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
