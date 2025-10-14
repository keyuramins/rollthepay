"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MaleIcon from '../../app/assets/male.svg';
import FemaleIcon from '../../app/assets/female.svg';
import { removeAveragePrefix } from "@/lib/utils/remove-average-cleaner";

interface GenderComparisonProps {
  record: any;
}

export function GenderComparison({ record }: GenderComparisonProps) {


  const m = Number(record.genderMale || 0);
  const f = Number(record.genderFemale || 0);
  const total = m + f;
  const dominant = f > m ? 'female' : m > f ? 'male' : 'equal';
  const role = removeAveragePrefix(record.title || record.occupation || 'this role');


  if (total === 0) {
    return null;
  }

  return (
    <section className="card-section">
    <Card>
      <CardHeader>
        <h3>Gender Distribution</h3>
        <p>Examining gender representation to understand diversity within the workforce..</p>
      </CardHeader>
      <CardContent>
        {(() => {
            const chartData = [
            { name: 'Male', value: m, color: 'var(--accent)' },
            { name: 'Female', value: f, color: 'var(--primary/50)' },
          ];

          const renderSegmentLabel = (props: any) => {
            const { cx, cy, midAngle, innerRadius, outerRadius, percent, value } = props;
            if (!value || value <= 0) return null;
            const RADIAN = Math.PI / 180;
            const ringCenterRadius = innerRadius + (outerRadius - innerRadius) / 2;
            const x = cx + ringCenterRadius * Math.cos(-midAngle * RADIAN);
            const y = cy + ringCenterRadius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill="black" textAnchor="middle"
                dominantBaseline="central" fontSize={12} fontWeight={700}>
                {Math.round(percent * 100)}%
              </text>
            );
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visual side */}
              <div className="grid grid-cols-3 gap-20 sm:gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                  <MaleIcon className="fill-accent rounded-lg w-16 h-16" />
                  <span className="metric-label">Male</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="gender-chart-wrapper">
                    <ResponsiveContainer width="100%" height={192}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={88}
                          stroke="#ffffff"
                          strokeWidth={2}
                          labelLine={false}
                          label={renderSegmentLabel}
                        >
                          <Cell fill={"var(--accent)"} />
                          <Cell fill={"var(--primary-50)"} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-3 rounded-sm bg-primary/50" />
                      <span className="metric-label">Female</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-3 rounded-sm bg-accent" />
                      <span className="metric-label">Male</span>
                    </div>
                  </div>
                </div>

                
                <div className="flex flex-col items-center gap-2">
                    <FemaleIcon className="fill-primary/50 rounded-lg w-16 h-16" />
                    <span className="metric-label">Female</span>
                </div>
              </div>

              {/* Text side */}
              <div className="space-y-4">
                <p>
                  This visualization shows the current gender distribution in {role}. The data reflects real workforce composition and highlights opportunities for greater diversity and inclusion.
                </p>
                <p>
                  {total === 0 && 'Gender distribution data is not available for this role.'}
                  {total > 0 && dominant === 'female' && `Women represent ${f}% of the workforce in this field, while men comprise ${m}%.`}
                  {total > 0 && dominant === 'male' && `Men represent ${m}% of the workforce in this field, while women comprise ${f}%.`}
                  {total > 0 && dominant === 'equal' && 'The workforce shows balanced representation with equal participation from both genders.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Understanding these patterns helps identify areas where diversity initiatives can create more inclusive workplaces.
                </p>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
    </section>
  );
}
