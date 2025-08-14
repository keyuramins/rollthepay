import { Metadata } from "next";
import { Header } from "@/components/navigation/header";

export const revalidate = 31536000;
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "About - Roll The Pay",
  description: "Learn about Roll The Pay's mission to provide accurate salary information and increase transparency in the labor market.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                About Roll The Pay
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                We're on a mission to make salary information accessible, transparent, and accurate for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Roll The Pay was created with a simple yet powerful goal: to provide accurate salary information 
                  that helps people make informed career decisions. We believe that transparency in compensation 
                  leads to better career outcomes and a more equitable workplace.
                </p>
                <p className="text-lg text-gray-600">
                  By compiling data from thousands of employers and employees worldwide, we're building the most 
                  comprehensive salary database available, organized by country, state, and job title.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency First</h3>
                  <p className="text-gray-600">
                    We believe everyone deserves access to accurate salary information to make informed career decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What We Do
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We collect, organize, and present salary data in an easy-to-understand format, 
                helping you navigate the complex world of compensation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Collection</h3>
                <p className="text-gray-600">
                  We gather salary information from thousands of employers and employees across different industries and locations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Analysis</h3>
                <p className="text-gray-600">
                  Our team analyzes and validates the data to ensure accuracy and provide meaningful insights.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Access</h3>
                <p className="text-gray-600">
                  We make this information freely available through our easy-to-use website, accessible to anyone, anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters Section */}
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

        {/* Data Quality Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Commitment to Data Quality
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We take data accuracy seriously and have implemented rigorous processes to ensure the information we provide is reliable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Sources</h3>
                <p className="text-sm text-gray-600">
                  Data comes from verified employers and employees
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Updates</h3>
                <p className="text-sm text-gray-600">
                  Information is updated regularly to reflect current market conditions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Aggregation</h3>
                <p className="text-sm text-gray-600">
                  Statistical methods ensure reliable averages and ranges
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive data from multiple countries and regions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
      </main>
    </div>
  );
}
