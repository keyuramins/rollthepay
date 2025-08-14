import { Button } from "@/components/ui/button";
import { getDataset } from "@/lib/data/parse";
import { Header } from "@/components/navigation/header";

export const revalidate = 31536000;

export default function Home() {
  const { all } = getDataset();
  const totalSalaries = all.length;
  const countries = new Set(all.map(rec => rec.country)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Roll The Pay
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Get the most out of your career with accurate salary information from thousands of employers around the globe.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="text-lg px-8 py-4">
                Explore Salaries
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{totalSalaries.toLocaleString()}+</div>
              <div className="mt-2 text-lg text-gray-600">Published Salaries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{countries}</div>
              <div className="mt-2 text-lg text-gray-600">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">100%</div>
              <div className="mt-2 text-lg text-gray-600">Data Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
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

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Search Salary By Jobs, Location & Industry
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our website is easy to use and requires one step to access all available information. You can look at our list of jobs and sort them by location, title, industry or date published.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">Find salary information with simple search terms and filters</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Accurate Data</h3>
              <p className="text-gray-600">Gathered directly from employees and employers</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600">Salary data from countries around the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Discover What A Job Pays Before You Apply
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            We are excited about making this kind of data available for anyone curious about salaries in certain countries. Our mission is to increase transparency by adding more new jobs each day.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Start Exploring Salaries
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Roll The Pay</h3>
            <p className="text-gray-400 mb-6">
              Making salary information accessible and transparent for everyone.
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Roll The Pay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
