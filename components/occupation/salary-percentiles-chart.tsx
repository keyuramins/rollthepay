"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PercentilesChart } from "./percentiles-chart";
import { formatCurrency } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";

interface SalaryPercentilesChartProps {
  record: OccupationRecord;
  country: string;
}

export function SalaryPercentilesChart({ record, country }: SalaryPercentilesChartProps) {
  const percentilesData = useMemo(() => {
    // Generate percentile data based on salary range
    const min = record.totalPayMin;
    const max = record.totalPayMax;
    const avg = record.avgAnnualSalary;

    if (!min || !max || !avg) {
      return [];
    }

    // Create percentile distribution
    const percentiles = [
      { label: "10th Percentile", value: record['10P'] },
      { label: "25th Percentile", value: record['25P'] },
      { label: "50th Percentile", value: record['50P'] },
      { label: "75th Percentile", value: record['75P'] },
      { label: "90th Percentile", value: record['90P'] }
    ].filter(p => p.value && p.value > 0);

    return percentiles.map(p => ({
      name: p.label.replace(' Percentile', ''),
      value: Number(p.value)
    }));
  }, [record]);

  if (percentilesData.length === 0) {
    return null;
  }

  return (
    <section className="card-section">
      <Card>
        <CardHeader>
          <div className="salary-percentiles-header">
            <h3>Salary Distribution by Percentiles</h3>
            <p>See how salaries are distributed across different performance levels</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="salary-percentiles-content">
            <PercentilesChart
              title="Salary Percentiles"
              subtitle="Distribution from 10th to 90th percentile"
              data={percentilesData}
              country={country}
            />
            
            {/* Additional percentile insights */}
            <div className="percentile-insights">
              <div className="percentile-insight">
                <h4>Market Position</h4>
                <div className="additional-value">
                  {formatCurrency(Number(record.avgAnnualSalary), country, record)}
                </div>
                <div className="metric-label">
                  Average salary represents the 50th percentile
                </div>
              </div>
              
              <div className="percentile-insight">
                <h4>Top Performers</h4>
                <div className="additional-value">
                  {formatCurrency(Number(record.totalPayMax) * 0.95, country, record)}
                </div>
                <div className="metric-label">
                  90th percentile - top 10% of earners
                </div>
              </div>
              
              <div className="percentile-insight">
                <h4>Entry Level</h4>
                <div className="additional-value">
                  {formatCurrency(Number(record.totalPayMin) * 0.85, country, record)}
                </div>
                <div className="metric-label">
                  10th percentile - starting positions
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
