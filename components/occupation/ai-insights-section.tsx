import { Brain, TrendingUp, Target, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateInsights } from "@/lib/calculations/insights-calculator";
import type { OccupationRecord } from "@/lib/data/types";
import { Card, CardContent, CardHeader } from "../ui/card";

interface InsightsSectionProps {
  record: OccupationRecord;
  country: string;
  location?: string;
}

export function InsightsSection({ record, country, location }: InsightsSectionProps) {
  const data = calculateInsights(record, country, location);

  return (
    <Card>
        <CardHeader>
            <div className="ai-insights__header">
                <Brain className="ai-insights__icon" />
                <h3>Detailed Insights for {data.occupationTitle}</h3>
            </div>
            <p>Intelligent analysis of compensation data and market trends</p>
        </CardHeader>
        <CardContent>
            <div className="ai-insights__content">
                {/* Market Trend Analysis */}
                <div className="ai-insight">
                    <div className="ai-insight__icon">
                        <TrendingUp className="ai-insight__icon-svg" />
                    </div>
                    <div className="ai-insight__content">
                        <div className="ai-insight__header">
                            <h4>Market Trend Analysis</h4>
                            <Badge 
                                variant={data.marketTrendConfidence === 'high' ? 'green' : data.marketTrendConfidence === 'medium' ? 'secondary' : 'yellow'}
                                className="text-xs sm:text-sm"
                            >
                                {data.marketTrendConfidence === 'high' ? 'High' : data.marketTrendConfidence === 'medium' ? 'Medium' : 'Low'} Confidence
                            </Badge>
                        </div>
                        <p>Salaries for {data.occupationTitle} have increased by <strong>{data.salaryIncreasePercent}%</strong> over the past year, {data.inflationComparison}. 
                            The demand for senior-level {data.occupationTitle} positions is currently <strong>{data.demandStrength}</strong> in {data.formattedLocation}.
                        </p>
                    </div>
                </div>
                {/* Positioning Recommendation */}
                <div className="ai-insight">
                    <div className="ai-insight__icon">
                        <Target className="ai-insight__icon-svg" />
                    </div>
                    <div className="ai-insight__content">
                        <div className="ai-insight__header">
                            <h4>Positioning Recommendation</h4>
                            <Badge 
                                variant={data.positioningConfidence === 'high' ? 'green' : data.positioningConfidence === 'medium' ? 'secondary' : 'yellow'}
                                className="text-xs sm:text-sm"
                            >
                                {data.positioningConfidence === 'high' ? 'High' : data.positioningConfidence === 'medium' ? 'Medium' : 'Low'} Confidence
                            </Badge>
                        </div>
                        <p>Based on current salary data, compensation for {data.occupationTitle} is considered <strong>{data.compensationCompetitiveness}</strong>. 
                            The typical salary range reflects various experience levels, skill sets, and market demand. 
                            Professionals in this field can expect fair compensation based on their qualifications and experience level.
                        </p>
                    </div>
                </div>
                {/* Growth Forecast */}
                <div className="ai-insight">
                    <div className="ai-insight__icon">
                        <ArrowUp className="ai-insight__icon-svg" />
                    </div>
                    <div className="ai-insight__content">
                        <div className="ai-insight__header">
                            <h4>Growth Forecast</h4>
                            <Badge 
                                variant={data.growthForecastConfidence === 'high' ? 'green' : data.growthForecastConfidence === 'medium' ? 'secondary' : 'yellow'}
                                className="text-xs sm:text-sm"
                            >
                                {data.growthForecastConfidence === 'high' ? 'High' : data.growthForecastConfidence === 'medium' ? 'Medium' : 'Low'} Confidence
                            </Badge>
                        </div>
                        <p>Career progression for {data.occupationTitle} typically follows a structured path from entry-level to senior roles. 
                            Significant advancement opportunities exist for individuals who consistently demonstrate excellence and commit to continuous professional development in {data.formattedLocation}.
                        </p>
                    </div>
                </div>
            </div>
            <div className="additional-metrics">
                <div className="salary-metric salary-metric--secondary">
                    <div className="metric-value text-sm sm:text-base">{data.percentileRankOrdinal}</div>
                    <div className="metric-label text-xs sm:text-sm">Position in salary range</div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                    <div className="metric-value text-sm sm:text-base">+{data.entryLevelComparison}%</div>
                    <div className="metric-label text-xs sm:text-sm">
                        Above entry-level salary
                        {!data.entryLevelComparisonData.hasData && (
                            <span className="text-xs text-muted-foreground block">
                                ({data.entryLevelComparisonData.fallbackReason})
                            </span>
                        )}
                    </div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                    <div className="metric-value text-sm sm:text-base">
                        {data.costOfLivingFactor > 0 ? '+' : ''}{data.costOfLivingFactor}%
                    </div>
                    <div className="metric-label text-xs sm:text-sm">
                        Cost of living vs global average
                        <span className="text-xs text-muted-foreground block">
                            {data.costOfLivingFactorData.description}
                        </span>
                    </div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                    <div className="metric-value text-sm sm:text-base">{data.projectedIncreaseRange}</div>
                    <div className="metric-label text-xs sm:text-sm">{data.nextYear} Projected increase</div>
                </div>
            </div>
      </CardContent>
    </Card>
  );
}
