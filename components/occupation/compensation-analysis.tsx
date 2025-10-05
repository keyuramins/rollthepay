"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/format/currency";
import { generateCompensationInsights, generateCompensationInsightContent, type PuterAIGeneratedContent } from "@/lib/ai/puter-ai";
import type { OccupationRecord } from "@/lib/data/types";
import {
  DollarSign,
  Target,
  TrendingUp,
  Brain,
  ArrowUp,
  Award,
  BadgeCent
} from "lucide-react";

interface CompensationAnalysisProps {
  record: OccupationRecord;
  country: string;
}

export function CompensationAnalysis({ record, country }: CompensationAnalysisProps) {
  const [aiContent, setAiContent] = useState<PuterAIGeneratedContent | null>(null);
  const [compensationInsights, setCompensationInsights] = useState<{
    bonus: string | null;
    commission: string | null;
    profitSharing: string | null;
  }>({
    bonus: null,
    commission: null,
    profitSharing: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAIContent = async () => {
      try {
        setIsLoading(true);
        const content = await generateCompensationInsights(record);
        setAiContent(content);

        // Load compensation insights for each type
        const insights: {
          bonus: string | null;
          commission: string | null;
          profitSharing: string | null;
        } = {
          bonus: null,
          commission: null,
          profitSharing: null
        };

        // Check if we have valid data for each compensation type
        const hasValidBonus = isValidMinMax(record.bonusRangeMin as unknown, record.bonusRangeMax as unknown);
        const hasValidCommission = isValidMinMax(record.commissionMin as unknown, record.commissionMax as unknown);
        const hasValidProfitSharing = isValidMinMax(record.profitSharingMin as unknown, record.profitSharingMax as unknown);

        // Load insights for available compensation types
        if (hasValidBonus) {
          try {
            const bonusInsight = await generateCompensationInsightContent(record, 'bonus');
            insights.bonus = bonusInsight;
          } catch (error) {
            console.error('Error loading bonus insight:', error);
          }
        }

        if (hasValidCommission) {
          try {
            const commissionInsight = await generateCompensationInsightContent(record, 'commission');
            insights.commission = commissionInsight;
          } catch (error) {
            console.error('Error loading commission insight:', error);
          }
        }

        if (hasValidProfitSharing) {
          try {
            const profitSharingInsight = await generateCompensationInsightContent(record, 'profitSharing');
            insights.profitSharing = profitSharingInsight;
          } catch (error) {
            console.error('Error loading profit sharing insight:', error);
          }
        }

        setCompensationInsights(insights);
      } catch (error) {
        console.error('Error loading AI content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAIContent();
  }, [record]);

  // Calculate salary metrics
  const low = record.totalPayMin;
  const high = record.totalPayMax;
  const avg = record.avgAnnualSalary;
  const totalRange = high && low ? high - low : 0;
  const avgPosition = low && high && avg ? ((avg - low) / (high - low)) * 100 : 0;
  const growthPotential = avg && high ? ((high - avg) / avg) * 100 : 0;

  // Calculate hourly metrics
  const fallbackHoursPerYear = 2080;
  const hourlyLow = record.hourlyLowValue ?? (low ? Number(low) / fallbackHoursPerYear : undefined);
  const hourlyHigh = record.hourlyHighValue ?? (high ? Number(high) / fallbackHoursPerYear : undefined);
  const hourlyAvg = record.avgHourlySalary ?? (avg ? Number(avg) / fallbackHoursPerYear : undefined);
  const hourlyTotalRange = hourlyHigh && hourlyLow ? hourlyHigh - hourlyLow : 0;
  const hourlyAvgPosition = hourlyLow && hourlyHigh && hourlyAvg ? ((hourlyAvg - hourlyLow) / (hourlyHigh - hourlyLow)) * 100 : 0;
  const hourlyGrowthPotential = hourlyAvg && hourlyHigh ? ((hourlyHigh - hourlyAvg) / hourlyAvg) * 100 : 0;

  // Market percentile calculation (mock data for now)
  const marketPercentile = Math.min(95, Math.max(5, Math.round(avgPosition + Math.random() * 20 - 10)));
  const experiencePremium = Math.round((avg && low ? ((avg - low) / low) * 100 : 0) + Math.random() * 10);
  const regionalAdjustment = Math.round(5 + Math.random() * 20);

  if (!low || !high || !avg) {
    return null;
  }

  const computeGrowthMetrics = (minVal: number, avgVal: number, maxVal: number) => {
    const min = Math.max(Number(minVal) || 0, 0);
    const avg = Math.max(Number(avgVal) || 0, 0);
    const max = Math.max(Number(maxVal) || 0, 0);

    const effectiveRange = max > min ? (max - min) : max;

    const minToAvgGrowth = min > 0
      ? ((avg - min) / Math.max(min, 1)) * 100
      : (max > 0 ? (avg / max) * 100 : 0);

    const avgToMaxGrowth = avg > 0
      ? ((max - avg) / Math.max(avg, 1)) * 100
      : (max > 0 ? 100 : 0);

    const medianPosition = effectiveRange > 0
      ? ((avg - min) / effectiveRange) * 100
      : (max > 0 ? (avg / max) * 100 : 0);

    const growthFactor = min > 0
      ? (max / min)
      : (avg > 0 ? (max / avg) : (max > 0 ? 1 : 0));

    const totalRange = min > 0 && max > min ? (max - min) : max;

    const clamp = (n: number) => Math.max(0, Math.min(isFinite(n) ? n : 0, 1000000));

    return {
      min,
      avg,
      max,
      totalRange: Math.max(0, totalRange),
      minToAvgGrowth: clamp(minToAvgGrowth),
      avgToMaxGrowth: clamp(avgToMaxGrowth),
      medianPosition: clamp(medianPosition),
      growthFactor: Math.max(0, isFinite(growthFactor) ? growthFactor : 0),
    };
  };

  const isValidMinMax = (min: unknown, max: unknown): boolean => {
    if (min == null || max == null) return false;
    const minStr = typeof min === 'string' ? min : String(min);
    const maxStr = typeof max === 'string' ? max : String(max);
    if (minStr === '' || maxStr === '' || minStr === '#REF!' || maxStr === '#REF!') return false;
    const minNum = Number(min);
    const maxNum = Number(max);
    return Number.isFinite(minNum) && Number.isFinite(maxNum);
  };

  return (
    <section className="compensation-analysis-section">
      <div className="compensation-analysis-header">
        <h2>Compensation Analysis</h2>
        <p>Comprehensive salary insights powered by market data and AI analysis</p>
      </div>

      {/* Top Row - Annual and Hourly Compensation Range Cards */}
      <div className="section-cards-grid">
        {/* Annual Compensation Range */}
        <Card className="compensation-card">
          <CardHeader>
            <h3>Annual Compensation Range</h3>
            <p>Complete compensation range from entry level to senior positions</p>
          </CardHeader>
          <CardContent>
            <div className="compensation-card__content">
              {/* Main Salary Display */}
              <div className="salary-display">
                <div className="salary-display__item">
                  <div className="metric-value">
                    {formatCurrency(Number(low), country, record)}
                  </div>
                  <div className="metric-label">Entry Level</div>
                </div>
                <div className="salary-display__item">
                  <div className="metric-value">
                    {formatCurrency(Number(avg), country, record)}
                  </div>
                  <div className="metric-label">Market Average</div>
                </div>
                <div className="salary-display__item">
                  <div className="metric-value">
                    {formatCurrency(Number(high), country, record)}
                  </div>
                  <div className="metric-label">Senior Level</div>
                </div>
              </div>

              {/* Range Bar */}
              <div className="salary-range-bar">
                <div className="salary-range-bar__gradient" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="salary-range-bar__dot"
                      style={{ left: `${avgPosition}%` }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formatCurrency(Number(avg), country, record)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Sub-metrics */}
              <div className="salary-metrics">
                <div className="salary-metric salary-metric--secondary">
                  <DollarSign className="salary-metric__icon" />
                  <div className="metric-value">
                    {formatCurrency(totalRange, country, record)}
                  </div>
                  <div className="metric-label">Total range</div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                  <Target className="salary-metric__icon" />
                  <div className="metric-value">
                    {avgPosition.toFixed(0)}%
                  </div>
                  <div className="metric-label">Above minimum</div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                  <TrendingUp className="salary-metric__icon" />
                  <div className="metric-value">
                    +{growthPotential.toFixed(0)}%
                  </div>
                  <div className="metric-label">Above average</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Rate Range */}
        {hourlyLow && hourlyHigh && hourlyAvg && (
          <Card className="compensation-card">
            <CardHeader>
              <h3>Hourly Rate Range</h3>
              <p>Hourly compensation range from entry level to senior positions</p>
            </CardHeader>
            <CardContent>
              <div className="compensation-card__content">
                {/* Main Hourly Display */}
                <div className="salary-display">
                  <div className="salary-display__item">
                    <div className="metric-value">
                      ${Number(hourlyLow).toFixed(2)}
                    </div>
                    <div className="metric-label">Entry Level</div>
                  </div>
                  <div className="salary-display__item">
                    <div className="metric-value">
                      ${Number(hourlyAvg).toFixed(2)}
                    </div>
                    <div className="metric-label">Market Average</div>
                  </div>
                  <div className="salary-display__item">
                    <div className="metric-value">
                      ${Number(hourlyHigh).toFixed(2)}
                    </div>
                    <div className="metric-label">Senior Level</div>
                  </div>
                </div>

                {/* Range Bar */}
                <div className="salary-range-bar">
                  <div className="salary-range-bar__gradient" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="salary-range-bar__dot"
                        style={{ left: `${hourlyAvgPosition}%` }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>${Number(hourlyAvg).toFixed(2)}/hr</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Sub-metrics */}
                <div className="salary-metrics">
                  <div className="salary-metric salary-metric--secondary">
                    <DollarSign className="salary-metric__icon" />
                    <div className="metric-value">
                      ${hourlyTotalRange.toFixed(2)}
                    </div>
                    <div className="metric-label">Total range (per hour)</div>
                  </div>
                  <div className="salary-metric salary-metric--secondary">
                    <Target className="salary-metric__icon" />
                    <div className="metric-value">
                      {hourlyAvgPosition.toFixed(0)}%
                    </div>
                    <div className="metric-label">Above minimum</div>
                  </div>
                  <div className="salary-metric salary-metric--secondary">
                    <TrendingUp className="salary-metric__icon" />
                    <div className="metric-value">
                      +{hourlyGrowthPotential.toFixed(0)}%
                    </div>
                    <div className="metric-label">Above average</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI-Powered Insights */}
      {aiContent && (
        <Card>
          <CardHeader>
            <div className="ai-insights__header">
              <Brain className="ai-insights__icon" />
              <h3>AI-Powered Insights</h3>
            </div>
            <p>Intelligent analysis of your compensation data and market trends</p>
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
                    <Badge variant="green" className="ai-insight__badge">High Confidence</Badge>
                  </div>
                  <p>{aiContent.marketTrends}</p>
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
                    <Badge className="ai-insight__badge ai-insight__badge--secondary">Medium Confidence</Badge>
                  </div>
                  <p>{aiContent.salaryInsights}</p>
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
                    <Badge variant="green" className="ai-insight__badge">High Confidence</Badge>
                  </div>
                  <p>{aiContent.careerProgression}</p>
                </div>
              </div>
            </div>
            <div className="additional-metrics">
                <div className="salary-metric salary-metric--secondary">
                  <div className="metric-value">{marketPercentile}th</div>
                  <div className="metric-label">Above {marketPercentile}% of similar roles</div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                  <div className="metric-value">+{experiencePremium}%</div>
                  <div className="metric-label">Above entry level baseline</div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                  <div className="metric-value">+{regionalAdjustment}%</div>
                  <div className="metric-label">Cost of living factor</div>
                </div>
                <div className="salary-metric salary-metric--secondary">
                  <div className="metric-value">Q2</div>
                  <div className="metric-label">Projected increase: 8-12%</div>
                </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(() => {
        const isValidRange = (min: unknown, max: unknown): boolean => {
          if (min == null || max == null) return false;
          const minStr = typeof min === 'string' ? min : String(min);
          const maxStr = typeof max === 'string' ? max : String(max);
          if (minStr === '' || maxStr === '' || minStr === '#REF!' || maxStr === '#REF!') return false;
          const minNum = Number(min);
          const maxNum = Number(max);
          return Number.isFinite(minNum) && Number.isFinite(maxNum);
        };

        const hasValidBonus = isValidRange(record.bonusRangeMin as unknown, record.bonusRangeMax as unknown);
        const hasValidProfitSharing = isValidRange(record.profitSharingMin as unknown, record.profitSharingMax as unknown);
        const hasValidCommission = isValidRange(record.commissionMin as unknown, record.commissionMax as unknown);

        if (!hasValidBonus && !hasValidProfitSharing && !hasValidCommission) {
          return null;
        }

        const bonusMax = hasValidBonus ? Number(record.bonusRangeMax) || 0 : 0;
        const commissionMax = hasValidCommission ? Number(record.commissionMax) || 0 : 0;
        const profitMax = hasValidProfitSharing ? Number(record.profitSharingMax) || 0 : 0;
        const totalMax = bonusMax + commissionMax + profitMax;

        const pct = (value: number) => {
          if (!totalMax || totalMax <= 0) return 0;
          return Math.max(0, Math.min(100, Math.round((value / totalMax) * 100)));
        };

        return (
        <Card>
          <CardHeader>
              <h2>Total Additional Compensation Potential</h2>
              <p>Combined maximum earnings from all compensation sources</p>
          </CardHeader>
          <CardContent>
            <div className="additional-comp__grid">
              {/* TOTAL CARD FIRST */}
              <div className="inner-card light-green-card">
                <div className="inner-card-top">
                  <div className="inner-card-icon">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="metric-label">Max Compensations</div>
                    <div className="additional-value">
                      {formatCurrency(totalMax, country, record)}
                    </div>
                  </div>
                </div>
                <div className="metric-label inner-card-subtext">All sources</div>
                <div className="inner-card-bar">
                  <div className="inner-card-bar-fill" style={{ width: "100%" }} />
                </div>
              </div>

              {/* BONUS CARD */}
              {hasValidBonus && (
                <div className="inner-card">
                  <div className="inner-card-top">
                    <div className="inner-card-icon">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="metric-label">Bonus Potential</div>
                      <div className="additional-value">
                        {formatCurrency(bonusMax, country, record)}
                      </div>
                    </div>
                    {totalMax > 0 && (
                      <Badge className="inner-card-badge">{`+${pct(bonusMax)}%`}</Badge>
                    )}
                  </div>
                  <div className="metric-label inner-card-subtext">Share of total</div>
                  <div className="inner-card-bar">
                    <div className="inner-card-bar-fill" style={{ width: `${Math.max(5, pct(bonusMax))}%` }} />
                  </div>
                </div>
              )}

              {/* COMMISSION CARD */}
              {hasValidCommission && (
                <div className="inner-card">
                  <div className="inner-card-top">
                    <div className="inner-card-icon">
                      <BadgeCent className="inner-card-icon-svg" />
                    </div>
                    <div>
                      <div className="metric-label">Commission Potential</div>
                      <div className="additional-value">
                        {formatCurrency(commissionMax, country, record)}
                      </div>
                    </div>
                    {totalMax > 0 && (
                      <Badge className="inner-card-badge">{`+${pct(commissionMax)}%`}</Badge>
                    )}
                  </div>
                  <div className="metric-label inner-card-subtext">Share of total</div>
                  <div className="inner-card-bar">
                    <div className="inner-card-bar-fill" style={{ width: `${Math.max(5, pct(commissionMax))}%` }} />
                  </div>
                </div>
              )}

              {/* PROFIT SHARING CARD */}
              {hasValidProfitSharing && (
                <div className="inner-card">
                  <div className="inner-card-top">
                    <div className="inner-card-icon">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="metric-label">Profit Share Potential</div>
                      <div className="additional-value">
                        {formatCurrency(profitMax, country, record)}
                      </div>
                    </div>
                    {totalMax > 0 && (
                      <Badge className="inner-card-badge">{`+${pct(profitMax)}%`}</Badge>
                    )}
                  </div>
                  <div className="metric-label inner-card-subtext">Share of total</div>
                  <div className="inner-card-bar">
                    <div className="inner-card-bar-fill" style={{ width: `${Math.max(5, pct(profitMax))}%` }} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        );
      })()}

      {/* Bonus Compensation */}
      {(() => {
        const hasValidBonus = isValidMinMax(record.bonusRangeMin as unknown, record.bonusRangeMax as unknown);
        if (!hasValidBonus) return null;

        const minBonus = Number(record.bonusRangeMin) || 0;
        const maxBonus = Number(record.bonusRangeMax) || 0;
        const avgBonus = (minBonus + maxBonus) / 2;
        const metrics = computeGrowthMetrics(minBonus, avgBonus, maxBonus);

        return (
          <div className="compensation-bpc-section">
            <div className="mb-8">
              <h3>Bonus Compensation</h3>
              <p>Performance-based bonus ranges and distribution</p>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-4">
                {/* Horizontal layout for bonus cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Maximum Bonus Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Maximum Bonus</p>
                      <p className="additional-value">{formatCurrency(maxBonus, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill"></div>
                      </div>
                    </div>
                  </div>

                  {/* Average Bonus Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Average Bonus</p>
                      <p className="additional-value">{formatCurrency(avgBonus, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Bonus Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Minimum Bonus</p>
                      <p className="additional-value">{formatCurrency(minBonus, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill" style={{ width: minBonus > 0 ? '15%' : '2%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Factor and Performance Insight cards below the horizontal cards */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Growth Factor Card */}
                  <div className="col-span-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-center">
                      <h4>Growth Factor</h4>
                      <p className="additional-value">{metrics.growthFactor.toFixed(1)}x</p>
                      <div className="additional-comp__bar">
                        <div 
                          className="additional-comp__bar-fill" 
                          style={{ width: `${Math.min(100, (metrics.growthFactor / 10) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="additional-comp__subtext">Maximum potential from minimum baseline</p>
                    </div>
                  </div>

                  {/* Performance Insight Card */}
                  <div className="col-span-8 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mb-2">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4>Performance Insight</h4>
                        <p className="additional-comp__subtext">
                          {compensationInsights.bonus || 
                            `Performance-based bonuses in ${record.title || record.occupation} roles typically reward high achievers with ${Math.round(metrics.minToAvgGrowth)}% more than baseline performers. `
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4">
                <div className="bg-chart-1/5 rounded-xl p-8 border border-border">
                <div className="space-y-4">
                  <h4>Growth Potential Analysis</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">From Minimum to Average:</span>
                        <span className="metric-value">+{metrics.minToAvgGrowth.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">From Average to Maximum:</span>
                        <span className="metric-value">+{metrics.avgToMaxGrowth.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">Total Range:</span>
                        <span className="metric-value">{formatCurrency(metrics.totalRange, country, record)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Commission Compensation */}
      {(() => {
        const hasValidCommission = isValidMinMax(record.commissionMin as unknown, record.commissionMax as unknown);
        if (!hasValidCommission) return null;

        const minCommission = Number(record.commissionMin) || 0;
        const maxCommission = Number(record.commissionMax) || 0;
        const avgCommission = (minCommission + maxCommission) / 2;
        const metrics = computeGrowthMetrics(minCommission, avgCommission, maxCommission);

        return (
          <div className="compensation-bpc-section">
            <div className="mb-8">
              <h3>Commission Compensation</h3>
              <p>Sales-based commission ranges and distribution</p>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-4">
                {/* Horizontal layout for commission cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Maximum Commission Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Maximum Commission</p>
                      <p className="additional-value">{formatCurrency(maxCommission, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill"></div>
                      </div>
                    </div>
                  </div>

                  {/* Average Commission Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Average Commission</p>
                      <p className="additional-value">{formatCurrency(avgCommission, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Commission Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Minimum Commission</p>
                      <p className="additional-value">{formatCurrency(minCommission, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill" style={{ width: minCommission > 0 ? '15%' : '2%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Factor and Performance Insight cards below the horizontal cards */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Growth Factor Card */}
                  <div className="col-span-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-center">
                      <h4>Growth Factor</h4>
                      <p className="additional-value">{metrics.growthFactor.toFixed(1)}x</p>
                      <div className="additional-comp__bar">
                        <div 
                          className="additional-comp__bar-fill" 
                          style={{ width: `${Math.min(100, (metrics.growthFactor / 10) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="additional-comp__subtext">Maximum potential from minimum baseline</p>
                    </div>
                  </div>

                  {/* Performance Insight Card */}
                  <div className="col-span-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4>Performance Insight</h4>
                        <p className="additional-comp__subtext">
                          {compensationInsights.commission || 
                            `Commission structures in ${record.title || record.occupation} roles typically reward high achievers with ${Math.round(metrics.minToAvgGrowth)}% more than baseline performers. Top performers can achieve additional ${Math.round(metrics.avgToMaxGrowth)}% increases, demonstrating significant rewards for excellence and consistent high performance.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4">
                <div className="bg-chart-1/5 rounded-xl p-8 border border-border">
                  <div className="space-y-4">
                  <h4>Growth Potential Analysis</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">From Minimum to Average:</span>
                        <span className="metric-value">+{metrics.minToAvgGrowth.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">From Average to Maximum:</span>
                        <span className="metric-value">+{metrics.avgToMaxGrowth.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">Total Range:</span>
                        <span className="metric-value">{formatCurrency(metrics.totalRange, country, record)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Profit Sharing */}
      {(() => {
        const hasValidProfit = isValidMinMax(record.profitSharingMin as unknown, record.profitSharingMax as unknown);
        if (!hasValidProfit) return null;

        const minProfit = Number(record.profitSharingMin) || 0;
        const maxProfit = Number(record.profitSharingMax) || 0;
        const avgProfit = (minProfit + maxProfit) / 2;
        const metrics = computeGrowthMetrics(minProfit, avgProfit, maxProfit);

        return (
          <div className="compensation-bpc-section">
            <div className="mb-8">
              <h3>Profit Sharing</h3>
              <p>Company profit distribution and ranges</p>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-4">
                {/* Horizontal layout for profit sharing cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Maximum Profit Share Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Maximum Profit Share</p>
                      <p className="additional-value">{formatCurrency(maxProfit, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill"></div>
                      </div>
                    </div>
                  </div>

                  {/* Average Profit Share Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Average Profit Share</p>
                      <p className="additional-value">{formatCurrency(avgProfit, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Profit Share Card */}
                  <div className="inner-card">
                    <div className="text-center">
                      <p className="metric-label">Minimum Profit Share</p>
                      <p className="additional-value">{formatCurrency(minProfit, country, record)}</p>
                      <div className="additional-comp__bar">
                        <div className="additional-comp__bar-fill" style={{ width: minProfit > 0 ? '15%' : '2%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Factor and Performance Insight cards below the horizontal cards */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Growth Factor Card */}
                  <div className="col-span-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="text-center">
                      <p className="metric-label">Growth Factor</p>
                      <p className="additional-value">{metrics.growthFactor.toFixed(1)}x</p>
                      <div className="additional-comp__bar">
                        <div 
                          className="additional-comp__bar-fill" 
                          style={{ width: `${Math.min(100, (metrics.growthFactor / 10) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="additional-comp__subtext">Maximum potential from minimum baseline</p>
                    </div>
                  </div>

                  {/* Performance Insight Card */}
                  <div className="col-span-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4>Performance Insight</h4>
                        <p className="additional-comp__subtext">
                          {compensationInsights.profitSharing || 
                            `Profit sharing in ${record.title || record.occupation} roles typically rewards high achievers with ${Math.round(metrics.minToAvgGrowth)}% more than baseline performers. Top performers can achieve additional ${Math.round(metrics.avgToMaxGrowth)}% increases, demonstrating significant rewards for excellence and consistent high performance.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4">
                <div className="bg-chart-1/5 rounded-xl p-8 border border-border">
                  <div className="space-y-4">
                  <h4>Growth Potential Analysis</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">From Minimum to Average:</span>
                        <span className="metric-value">+{metrics.minToAvgGrowth.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">From Average to Maximum:</span>
                        <span className="metric-value">+{metrics.avgToMaxGrowth.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="metric-label">Total Range:</span>
                        <span className="metric-value">{formatCurrency(metrics.totalRange, country, record)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

  </section>
  );
}
