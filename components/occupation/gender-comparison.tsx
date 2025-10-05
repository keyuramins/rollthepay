"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MaleIcon from '../../app/assets/male.svg';
import FemaleIcon from '../../app/assets/female.svg';

interface GenderComparisonProps {
  record: any;
}

export function GenderComparison({ record }: GenderComparisonProps) {


  const m = Number(record.genderMale || 0);
  const f = Number(record.genderFemale || 0);
  const total = m + f;
  // const center = total > 0 ? `${Math.max(m, f).toFixed(0)}%` : '—';
  const dominant = f > m ? 'female' : m > f ? 'male' : 'equal';
  const role = record.title || record.occupation || 'this role';


  if (total === 0) {
    return null;
  }

  return (
    <section className="card-section">
    <Card>
      <CardHeader>
        <h3>Gender Comparison</h3>
        <p>As indicated, the accent colour represents the percentage share for women and the primary colour represents the percentage share for men.</p>
      </CardHeader>
      <CardContent>
        {(() => {
            const chartData = [
            { name: 'Male', value: m, color: 'var(--chart-6)' },
            { name: 'Female', value: f, color: 'var(--chart-1)' },
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
            <div className="section-cards-grid">
              {/* Visual side */}
              <div className="gender-comparison-visual">
              <div className="gender-icon-container">
                  <MaleIcon className="fill-secondary rounded-lg w-16 h-16" />
                  <span className="metric-label">Male</span>
                </div>

                <div className="gender-chart-container">
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
                          <Cell fill={"var(--secondary-30)"} />
                          <Cell fill={"var(--primary)"} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/*
                    <span className={`gender-chart-center ${dominant === 'female' ? 'gender-chart-center--female' : dominant === 'male' ? 'gender-chart-center--male' : 'gender-chart-center--equal'}`}>
                      {center}
                    </span>
                    */}
                  </div>
                  <div className="gender-legend">
                    <div className="gender-legend-item">
                      <span className="gender-legend-color-block gender-color-female" />
                      <span className="metric-label">Female</span>
                    </div>
                    <div className="gender-legend-item">
                      <span className="gender-legend-color-block gender-color-male" />
                      <span className="metric-label">Male</span>
                    </div>
                  </div>
                </div>

                
                <div className="gender-icon-container">
                    <FemaleIcon className="fill-primary rounded-lg w-16 h-16" />
                    <span className="metric-label">Female</span>
                </div>
              </div>

              {/* Text side */}
              <div className="space-y-4">
                <p>
                  This pie chart demonstrates the gender share for {role}. As indicated, the golden colour represents the percentage share
                  for women and the green represents the percentage share for men.
                </p>
                <p>
                  {total === 0 && 'No gender distribution data is available for this profession.'}
                  {total > 0 && dominant === 'female' && `As shown via chart, female employees are involved ${f}% in contrast with male at ${m}%.`}
                  {total > 0 && dominant === 'male' && `As shown via chart, male employees are involved ${m}% in contrast with female at ${f}%.`}
                  {total > 0 && dominant === 'equal' && 'As shown via chart, the shares are evenly balanced between male and female.'}
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
