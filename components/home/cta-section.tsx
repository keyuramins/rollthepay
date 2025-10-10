import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users } from "lucide-react";

export function CTASection() {
  return (
    <section role="region" aria-labelledby="cta-heading" className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="cta-heading" className="text-3xl font-bold text-white sm:text-4xl mb-6">
          Ready to Discover Your Market Value?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join millions of professionals who use our platform to research salaries, 
          negotiate better offers, and advance their careers. Start your salary research today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" variant="secondary" className="text-base bg-secondary text-primary px-8 py-3 sm:text-lg sm:px-8 sm:py-4 rounded-md font-semibold hover:bg-card transition-colors cursor-pointer flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" />
            Search Salaries Now
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <Users className="w-4 h-4 text-white/80" />
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <ArrowRight className="w-4 h-4 text-white/80" />
            <span>No registration required</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <Search className="w-4 h-4 text-white/80" />
            <span>Instant results</span>
          </div>
        </div>
      </div>
    </section>
  );
}
