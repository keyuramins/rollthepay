import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";
import { Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "../ui/badge";
import { AdSenseAd } from "@/components/ui/adsense-ad";

interface ExperienceLevelSalariesChartProps {
  record: OccupationRecord;
  country: string;
}
export function ExperienceLevelSalariesChart({ record, country }: ExperienceLevelSalariesChartProps) {
  const yearsExperience = [
      { name: '1 Year', value: record.oneYr, color: '#06B6D4' },
      { name: '1-4 Years', value: record.oneFourYrs, color: '#84CC16' },
      { name: '5-9 Years', value: record.fiveNineYrs, color: '#F97316' },
      { name: '10-19 Years', value: record.tenNineteenYrs, color: '#EC4899' },
      { name: '20+ Years', value: record.twentyYrsPlus, color: '#6366F1' },
    ].filter(exp => exp.value != null && exp.value > 0);

  if (yearsExperience.length === 0) {
    return null;
  }

  const maxValue = Math.max(...yearsExperience.map((y) => Number(y.value) || 0));
  const avgSalary = Number(record.avgAnnualSalary) || 0;
  const getIcon = (index: number) => {
    if (index === 0) return <Calendar className="w-5 h-5" />;
    if (index === 1) return <Users className="w-5 h-5" />;
    if (index === 2) return <TrendingUp className="w-5 h-5" />;
    if (index === 3) return <DollarSign className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

      return (
        <section className="card-section">
          <Card className="experience-level-salaries-card">
            <CardHeader>
              <div className="experience-level-salaries-header">
                <h3>Pay Based on Years of Experience for {record.occ_name}</h3>
                <p>Salary progression by years of experience. Cards show typical salaries with percentages comparing to market average; arrows indicate difference from average annual compensation.</p>
              </div>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {yearsExperience.map((item, index) => {
                const value = Number(item.value) || 0;
                // Compare to average annual salary instead of previous level
                const delta = avgSalary > 0 ? value - avgSalary : 0;
                const percent = avgSalary > 0 ? (delta / avgSalary) * 100 : 0;
                const widthPct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
                const isBaseline = index === 0;

                return (
                  <div key={item.name} className="relative rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-primary text-white shadow">
                          {getIcon(index)}
                        </div>
                        <div>
                          <p className="metric-label flex items-center gap-2 whitespace-nowrap w-full overflow-hidden">
                            {item.name}
                            {avgSalary > 0 && (
                              <Badge className="truncate flex-1 min-w-0 bg-secondary/30 text-black font-semibold rounded-md px-1 py-0.5 ml-auto shrink-0">
                                {percent > 0 ? `+${percent.toFixed(0)}%` : `${percent.toFixed(0)}%`}
                              </Badge>
                            )}
                          </p>
                          <p className="additional-value">
                            {formatCurrency(value, country)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="experience-level-insight__growth">
                      {avgSalary > 0 ? (
                        <span>{delta > 0 ? '↑' : delta < 0 ? '↓' : ''} {delta !== 0 ? formatCurrency(Math.abs(delta), country) : 'Average'}</span>
                      ) : (
                        <span>{isBaseline ? 'Entry Level' : '-'}</span>
                      )}
                    </div>
                    <div className="experience-level-insight__growth-label">
                      <div className="experience-level-insight__growth-value" style={{ width: `${widthPct > 90 ? widthPct - 10 : widthPct - 5}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {avgSalary > 0 && (
              <>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Percentages and differences are calculated compared to the average annual salary ({formatCurrency(avgSalary, country)})
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="mb-2">
                    The salary progression shows how compensation increases with experience. Starting with {yearsExperience[0]?.name} experience at {formatCurrency(Number(yearsExperience[0]?.value) || 0, country)}, professionals see gradual increases as they gain more years in the field.
                  </p>
                  <p>
                    {yearsExperience.map((item, index) => {
                      const value = Number(item.value) || 0;
                      const delta = value - avgSalary;
                      const percent = (delta / avgSalary) * 100;
                      const isLast = index === yearsExperience.length - 1;
                      const isSecondLast = index === yearsExperience.length - 2;
                      
                      if (index === 0) return null; // Skip first one as it's already mentioned
                      
                      return (
                        <span key={item.name}>
                          {index === 1 ? 'By ' : ''}{item.name} experience, the typical salary reaches {formatCurrency(value, country)}
                          {percent !== 0 && (
                            <span>, which is {percent > 0 ? 'above' : 'below'} the market average by {percent.toFixed(0)}% ({formatCurrency(Math.abs(delta), country)} {percent > 0 ? 'more' : 'less'})</span>
                          )}
                          {!isLast && !isSecondLast && <span>. </span>}
                          {isSecondLast && <span>, and </span>}
                          {isLast && <span>.</span>}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </>
            )}
            </CardContent>
          </Card>
          <AdSenseAd 
            adSlot="5300801825" 
            format="fluid"
            layout="in-article"
            fullWidthResponsive={false}
            style={{ textAlign: "center" }}
            className="my-8 sm:my-12 min-h-[100px] sm:min-h-[250px]"
            aria-label="Advertisement"
          />
        </section>
      );
  }