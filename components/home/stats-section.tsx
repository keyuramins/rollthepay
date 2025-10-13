import { TrendingUp, Globe, Shield, Users, DollarSign, Building2 } from "lucide-react";

interface StatsSectionProps {
  totalSalaries: number;
  countries: number;
}

// Function to format numbers with K, M suffixes
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function StatsSection({ totalSalaries, countries }: StatsSectionProps) {
  const stats = [
    {
      icon: DollarSign,
      value: `${formatNumber(totalSalaries)}+`,
      title: "Salary Records",
      desc: "Real compensation data from verified sources",
    },
    {
      icon: Globe,
      value: countries,
      title: "Countries",
      desc: "Global salary insights across markets",
    },
    {
      icon: Building2,
      value: "10K+",
      title: "Companies",
      desc: "From startups to Fortune 500",
    },
    {
      icon: Users,
      value: "1M+",
      title: "Job Seekers",
      desc: "Trust our data for career decisions",
    },
    {
      icon: Shield,
      value: "100%",
      title: "Free Access",
      desc: "No paywalls, no hidden fees",
    },
    {
      icon: TrendingUp,
      value: "Regular",
      title: "Updates",
      desc: "Fresh data added continuously",
    },
  ];

  return (
    <section role="region" aria-labelledby="stats-heading" className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <h2 id="stats-heading" className="text-3xl sm:text-4xl font-bold text-foreground">
          Trusted by Job Seekers Worldwide
        </h2>
        <p className="max-w-2xl mx-auto">
          Our comprehensive salary database helps millions make informed career decisions
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8">
        {stats.map(({ icon: Icon, value, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center justify-between text-center p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/20"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {value}
            </div>
            <div className="text-base sm:text-lg font-semibold text-foreground mb-1">{title}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
