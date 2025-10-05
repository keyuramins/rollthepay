import type { OccupationRecord } from "@/lib/data/types";
import { formatCurrency, formatHourlyRate } from "@/lib/format/currency";

interface DataOverviewSectionProps {
  record: OccupationRecord;
  country: string;
}

export function DataOverviewSection({ record, country }: DataOverviewSectionProps) {
  const locationText = record.location ? 
    `${record.location}, ${record.state}, ${record.country}` : 
    record.state ? 
    `${record.state}, ${record.country}` : 
    record.country;

  const hasSalaryData = record.avgAnnualSalary || record.lowSalary || record.highSalary;
  const hasHourlyData = record.avgHourlySalary || record.hourlyLowValue || record.hourlyHighValue;
  const hasExperienceData = record.entryLevel || record.earlyCareer || record.midCareer || record.experienced || record.lateCareer;
  const hasSkillsData = record.skillsNameOne && record.skillsNamePercOne;

  // Calculate salary range if available
  const salaryRange = record.lowSalary && record.highSalary ? 
    `${formatCurrency(record.lowSalary, country, record)} - ${formatCurrency(record.highSalary, country, record)}` : 
    'Not available';

  // Calculate hourly range if available
  const hourlyRange = record.hourlyLowValue && record.hourlyHighValue ? 
    `${formatHourlyRate(record.hourlyLowValue, country)} - ${formatHourlyRate(record.hourlyHighValue, country)}` : 
    'Not available';

  // Experience level summary
  const experienceSummary = hasExperienceData ? 
    `Experience levels show progression from entry-level (${record.entryLevel ? formatCurrency(record.entryLevel, country, record) : 'N/A'}) to late career (${record.lateCareer ? formatCurrency(record.lateCareer, country, record) : 'N/A'})` : 
    'Experience level data not available';

  // Skills summary
  const skillsSummary = hasSkillsData ? 
    `Top skills include ${record.skillsNameOne} (${record.skillsNamePercOne}%), ${record.skillsNameTwo ? `${record.skillsNameTwo} (${record.skillsNamePercTwo}%)` : ''}${record.skillsNameThree ? `, and ${record.skillsNameThree} (${record.skillsNamePercThree}%)` : ''}` : 
    'Skills data not available';

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Data Overview
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive summary of salary data, experience requirements, and market insights for {record.title || record.occupation} in {locationText}.
          </p>
        </div>

        <div className="bg-muted rounded-xl p-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Right Column - Market Insights */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Market Insights</h3>
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-2">Location Analysis</h4>
                    <p className="text-sm text-foreground">
                      {locationText} offers competitive compensation for {record.title || record.occupation} professionals. 
                      {record.state && ` Regional variations within ${record.state} may affect salary expectations.`}
                    </p>
                  </div>

                  {hasSkillsData && (
                    <div className="bg-card p-4 rounded-lg border">
                      <h4 className="font-medium text-foreground mb-2">Skills Demand</h4>
                      <p className="text-sm text-foreground">
                        {skillsSummary}
                      </p>
                    </div>
                  )}

                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-2">Career Outlook</h4>
                    <p className="text-sm text-foreground">
                      The demand for {record.title || record.occupation} professionals remains strong, with opportunities for advancement 
                      based on experience and skill development. Market conditions support competitive compensation packages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Summary */}
          <div className="mt-8 pt-8 border-t">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Summary</h3>
              <p className="text-foreground leading-relaxed max-w-4xl mx-auto">
                {record.title || record.occupation} represents a {hasSalaryData ? 'well-compensated' : 'competitive'} role in {locationText}. 
                {hasExperienceData ? ' Experience significantly impacts earning potential, with clear progression paths available.' : ' The role offers growth opportunities for professionals at various career stages.'} 
                {hasSkillsData ? ' Key skills are in high demand and directly correlate with compensation.' : ' Continuous skill development is essential for career advancement.'} 
                This position provides a solid foundation for long-term career growth in the industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
