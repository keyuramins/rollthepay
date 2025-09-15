import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground sm:text-4xl mb-4 sm:mb-6 px-2">
          Discover What A Job Pays Before You Apply
        </h2>
        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
          We are excited about making this kind of data available for anyone curious about salaries in certain countries. Our mission is to increase transparency by adding more new jobs each day.
        </p>
        <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
          Start Exploring Salaries
        </Button>
      </div>
    </section>
  );
}
