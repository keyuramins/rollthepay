import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
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
  );
}
