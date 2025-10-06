"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, Label } from 'recharts';
import { formatCurrency } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";
import { Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "../ui/badge";

interface ExperienceLevelSalariesChartProps {
  record: OccupationRecord;
  country: string;
}

export function ExperienceLevelSalariesChart({ record, country }: ExperienceLevelSalariesChartProps) {
  const experienceLevelsData = useMemo(() => {
    // Experience level data
    const experienceLevels = [
      { name: 'Entry Level', value: record.entryLevel, color: '#3B82F6' },
      { name: 'Early Career', value: record.earlyCareer, color: '#10B981' },
      { name: 'Mid Career', value: record.midCareer, color: '#F59E0B' },
      { name: 'Experienced', value: record.experienced, color: '#EF4444' },
      { name: 'Late Career', value: record.lateCareer, color: '#8B5CF6' },
    ].filter(level => level.value != null && level.value > 0);

    // Years of experience data
  const yearsExperience = [
    { name: '1 Year', value: record.oneYr, color: '#06B6D4' },
    { name: '1-4 Years', value: record.oneFourYrs, color: '#84CC16' },
    { name: '5-9 Years', value: record.fiveNineYrs, color: '#F97316' },
    { name: '10-19 Years', value: record.tenNineteenYrs, color: '#EC4899' },
    { name: '20+ Years', value: record.twentyYrsPlus, color: '#6366F1' },
  ].filter(exp => exp.value != null && exp.value > 0);

    return { experienceLevels, yearsExperience };
  }, [record]);

  if (experienceLevelsData.experienceLevels.length === 0 && experienceLevelsData.yearsExperience.length === 0) {
    return null;
  }

  return (
    <section className="card-section">
      {/* Experience Levels Line Chart */}
      {experienceLevelsData.experienceLevels.length > 0 && (
        <Card className="experience-level-salaries-card">
          <CardHeader>
            <div className="experience-level-salaries-header">
              <h3>Experience Level Salaries (Hourly)</h3>
              <p>Hourly rate by experience level</p>
            </div>
          </CardHeader>
          <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={experienceLevelsData.experienceLevels} margin={{ top: 50, right: 30, left: 56, bottom: 48 }}>
                <defs>
                  <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--foreground)"
                  strokeOpacity={0.3}
                  vertical={true}
                  horizontal={true}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    const text: string = String(payload?.value ?? '');
                    const padX = 1; // horizontal padding inside pill
                    const height = 28; // fixed pill height
                    const fontSize = 12;
                    const baseWidth = Math.max(42, text.length * 8); // approximate text width
                    const width = (baseWidth + padX * 2) - 12;
                    const rectX = x - width / 2;
                    const rectY = y ; // place below axis line
                    return (
                      <g>
                        <rect
                          x={rectX}
                          y={rectY}
                          width={width}
                          height={height}
                          rx={14}
                          ry={14}
                          fill="var(--background)"
                          stroke="var(--border)"
                          strokeWidth={1}
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
                        />
                        <text
                          x={x}
                          y={rectY + height / 2 + 4}
                          textAnchor="middle"
                          fill="var(--primary)"
                          fontSize={fontSize}
                          fontWeight={700}
                        >
                          {text}
                        </text>
                      </g>
                    );
                  }}
                >
                  <Label value="Experience level" position="insideBottom" offset={-44} style={{ fill: 'var(--muted-foreground)', fontSize: 14, fontWeight: 500 }} />
                </XAxis>
                <YAxis
                  width={80}
                  axisLine={false}
                  tickLine={false}
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    const v = Number(payload?.value ?? 0);
                    const text = v >= 1000 ? `$${Math.round(v / 1000)}k/hr` : `$${v.toLocaleString()}/hr`;
                    const padX = 1; // horizontal padding inside pill
                    const height = 28; // fixed pill height
                    const fontSize = 12;
                    const baseWidth = Math.max(48, text.length * 8); // approximate text width
                    const width = (baseWidth + padX * 2);
                    const rectX = x - width - 12; // place to the left of axis
                    const rectY = y - height / 2; // center vertically on tick
                    return (
                      <g>
                        <rect
                          x={rectX}
                          y={rectY}
                          width={width}
                          height={height}
                          rx={14}
                          ry={14}
                          fill="var(--background)"
                          stroke="var(--border)"
                          strokeWidth={1}
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
                        />
                        <text
                          x={rectX + width / 2}
                          y={rectY + height / 2 + 4}
                          textAnchor="middle"
                          fill="var(--primary)"
                          fontSize={fontSize}
                          fontWeight={700}
                        >
                          {text}
                        </text>
                      </g>
                    );
                  }}
                >
                  <Label value="Hourly rate ($/hr)" angle={-90} position="insideLeft" offset={-20} style={{ fill: 'var(--muted-foreground)', fontSize: 14, fontWeight: 500, textAnchor: 'middle' }} />
                </YAxis>

                <RechartsTooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}/hr`, 'Hourly rate']}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: '600' }}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  fill="url(#stepGradient)"
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const value = payload?.value;
                    if (!value) return (<g></g>);
                    
                    const text = `$${Number(value).toLocaleString()}/hr`;
                    const textWidth = Math.max(text.length * 8, 55);
                    const pillWidth = textWidth;
                    const pillHeight = 32;
                    
                    return (
                      <g>
                        <defs>
                          <linearGradient id={`pillGradient-${cx}-${cy}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <rect
                          x={cx - pillWidth / 2}
                          y={cy - pillHeight / 2}
                          width={pillWidth}
                          height={pillHeight}
                          rx={16}
                          ry={16}
                          fill={`url(#pillGradient-${cx}-${cy})`}
                          // stroke="var(--background)"
                          // strokeWidth={2}
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                        />
                        <text
                          x={cx}
                          y={cy + 4}
                          textAnchor="middle"
                          fill="var(--background)"
                          fontSize="12"
                          fontWeight="700"
                        >
                          {text}
                        </text>
                      </g>
                    );
                  }}
                  activeDot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const value = payload?.value;
                    if (!value) return (<g></g>);
                    
                    const text = `$${Number(value).toLocaleString()}/hr`;
                    const textWidth = Math.max(text.length * 8, 55);
                    const pillWidth = textWidth + 2;
                    const pillHeight = 36;
                    
                    return (
                      <g>
                        <defs>
                          <linearGradient id={`activePillGradient-${cx}-${cy}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <rect
                          x={cx - pillWidth / 2}
                          y={cy - pillHeight / 2}
                          width={pillWidth}
                          height={pillHeight}
                          rx={18}
                          ry={18}
                          fill={`url(#activePillGradient-${cx}-${cy})`}
                          // stroke="var(--background)"
                          // strokeWidth={3}
                          filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                        />
                        <text
                          x={cx}
                          y={cy + 5}
                          textAnchor="middle"
                          fill="var(--background)"
                          fontSize="13"
                          fontWeight="700"
                        >
                          {text}
                        </text>
                      </g>
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex items-center space-x-2 rounded-full px-2 py-1 bg-secondary/30 border border-input   mt-2">
                <div className="w-3 h-3 rounded-full bg-chart-1" />
                <span className="text-sm text-black font-bold">Hourly salary by experience level</span>
              </div>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Years of Experience Cards */}
      {experienceLevelsData.yearsExperience.length > 0 && (() => {
        const maxValue = Math.max(...experienceLevelsData.yearsExperience.map((y) => Number(y.value) || 0));
        const getIcon = (index: number) => {
          if (index === 0) return <Calendar className="w-5 h-5" />;
          if (index === 1) return <Users className="w-5 h-5" />;
          if (index === 2) return <TrendingUp className="w-5 h-5" />;
          if (index === 3) return <DollarSign className="w-5 h-5" />;
          return <TrendingUp className="w-5 h-5" />;
        };

        return (
          <Card className="experience-level-salaries-card">
            <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {experienceLevelsData.yearsExperience.map((item, index) => {
                const value = Number(item.value) || 0;
                const prev = index > 0 ? Number(experienceLevelsData.yearsExperience[index - 1].value) || 0 : value;
                const delta = value - prev;
                const percent = prev > 0 ? (delta / prev) * 100 : 0;
                const widthPct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
                const isBaseline = index === 0;

                return (
                  <div key={item.name} className="experience-level-insight">
                    <div className="experience-level-insight-flex">
                      <div className="experience-level-insight__header">
                        <div className="experience-level-insight__icon">
                          {getIcon(index)}
                        </div>
                        <div>
                          <p className="metric-label">{item.name}</p>
                          <p className="additional-value">
                            {formatCurrency(value, country)}
                          </p>
                        </div>
                      </div>
                      {!isBaseline && (
                        <Badge variant="secondary" className="experience-level-insight__badge">{percent > 0 ? `+${percent.toFixed(0)}%` : `${percent.toFixed(0)}%`}</Badge>
                      )}
                    </div>
                    <div className="experience-level-insight__growth">
                      {isBaseline ? (
                        <span>Entry Level</span>
                      ) : (
                        <span>↑ {formatCurrency(Math.abs(delta), country)}</span>
                      )}
                    </div>
                    <div className="experience-level-insight__growth-label">
                      <div className="experience-level-insight__growth-value" style={{ width: `${widthPct > 90 ? widthPct - 10 : widthPct - 5}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            </CardContent>
          </Card>
        );
      })()}
    </section>
  );
}

