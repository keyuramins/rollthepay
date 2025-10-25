// components/home/features-section.tsx
import { Search, Shield, Globe, TrendingUp, Users, BarChart3 } from "lucide-react";

const features = [
  { icon: Search, title: "Smart Search", description: "Find exact salary data by job title, location, experience level, and company size. Our intelligent search delivers precise results in seconds." },
  { icon: Shield, title: "Verified Data", description: "All salary information is verified and sourced directly from employees and employers. No estimates, no guesswork—just real, accurate data." },
  { icon: Globe, title: "Global Insights", description: "Compare salaries across countries, states, and cities. Understand how location impacts compensation in your field." },
  { icon: TrendingUp, title: "Market Trends", description: "Track salary growth, demand patterns, and career progression paths. Stay ahead of market changes with our trend analysis." },
  { icon: BarChart3, title: "Detailed Analytics", description: "Get comprehensive salary breakdowns including base pay, bonuses, benefits, and total compensation packages." },
  { icon: Users, title: "Community Driven", description: "Join millions of professionals sharing salary insights. Contribute to transparency and help others in their career journey." }
];

export function FeaturesSection() {
  return (
    <section role="region" aria-labelledby="features-heading" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-foreground">
          Everything You Need to Research Salaries
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto text-muted-foreground pt-4">
          Our comprehensive platform provides all the tools and data you need to make informed career decisions. 
          From detailed salary breakdowns to market insights, we've got you covered.
        </p>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 py-16 sm:py-20">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <article key={index} className="text-center p-6 sm:p-8 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
              <div className="w-16 h-16 sm:w-18 sm:h-18 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 text-primary" />
              </div>
              <h3 className="text-foreground mb-4">{feature.title}</h3>
              <p className="text-base sm:text-lg max-w-3xl mx-auto text-muted-foreground">{feature.description}</p>
            </article>
          );
        })}
      </div>
      </div>
    </section>
  );
}
