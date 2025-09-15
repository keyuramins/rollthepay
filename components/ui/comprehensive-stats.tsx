"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PercentilesChart } from "@/components/ui/percentiles-chart";
import { SalaryBreakdownTable } from "@/components/ui/salary-breakdown-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import {
  DollarSign,
  Clock,
  Users,
  Target,
  TrendingUp,
  MapPin,
  Building,
  Award,
  Zap,
  BadgeCent,
  AwardIcon,
  MessageCircleIcon,
  CodeIcon,
  UserIcon,
  Venus,
  Mars,
  CalculatorIcon,
  ChartAreaIcon,
  FlowerIcon
} from "lucide-react";

interface ComprehensiveStatsProps {
  record: any;
  country: string;
}

// Skills Filter Component
interface SkillsFilterProps {
  skills: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
    marketShare: number;
    salaryImpact: number;
    demandLevel: string;
    demandColor: string;
    category: string;
  }>;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  activeFilter: string;
  activeSort: string;
}

function SkillsFilter({ skills, onFilterChange, onSortChange, activeFilter, activeSort }: SkillsFilterProps) {
  // Extract unique categories from skills data
  const categories = useMemo(() => {
    const categoryCounts = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count and take top 4-5 categories
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);

    // Debug logging (remove in production)
    // console.log('Skills categories detected:', categoryCounts);
    // console.log('Sorted categories for filters:', sortedCategories);

    // Ensure we always have at least the categories that exist in the data
    return sortedCategories.length > 0 ? sortedCategories : ['Technical'];
  }, [skills]);

  const categoryIcons: Record<string, string> = {
    'Software': '<>',
    'Management': '👤',
    'Accounting': '📊',
    'Analysis': '📈',
    'Technical': '⚙️',
    'Process': '🔄',
    'Communication': '💬'
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl text-center font-bold text-foreground mb-2">Top Skills & Market Demand</h3>
      <p className="text-sm text-muted-foreground mb-6 text-center">Most in-demand skills with proficiency levels and salary impact analysis</p>

      {/* Skill Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center items-center">
        <Button
          onClick={() => onFilterChange('All')}
          variant={activeFilter === 'All' ? 'default' : 'outline'}
          size="sm"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => onFilterChange(category)}
            variant={activeFilter === category ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <span dangerouslySetInnerHTML={{ __html: categoryIcons[category] || '📋' }} />
            {category}
          </Button>
        ))}
      </div>

      {/* Sorting Options */}
      <div className="flex gap-2 justify-center items-center">
        <Button
          onClick={() => onSortChange('proficiency')}
          variant={activeSort === 'proficiency' ? 'secondary' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
        >
          <span>🔽</span> By Proficiency
        </Button>
        <Button
          onClick={() => onSortChange('demand')}
          variant={activeSort === 'demand' ? 'secondary' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
        >
          <span>📊</span> By Demand
        </Button>
      </div>
    </div>
  );
}

// Mini Pie Chart Component for Gender Split
function MiniPie({ malePercent, femalePercent }: { malePercent: number; femalePercent: number }) {
  const radius = 20;

  // Ensure we have valid percentages
  const male = malePercent || 0;
  const female = femalePercent || 0;

  return (
    <div className="relative">
      <svg width="50" height="50" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="#F3F4F6"
          stroke="none"
        />

        {/* Male segment - Blue with white border */}
        {male > 0 && (
          <path
            d={describeArc(25, 25, radius, 0, (male / 100) * 360)}
            fill="#3B82F6"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Female segment - Pink with white border */}
        {female > 0 && (
          <path
            d={describeArc(25, 25, radius, (male / 100) * 360, 360)}
            fill="#EC4899"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Outer ring for clear separation */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Helper function to describe an arc path
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
}

// Helper function to convert polar coordinates to cartesian
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Enhanced Horizontal Salary Range Bar Component using Recharts
function SalaryRangeBar({ record }: { record: any }) {
  // Use totalPayMin and totalPayMax from the data
  const low = record.totalPayMin;
  const high = record.totalPayMax;
  const avg = record.avgAnnualSalary;

  if (!low || !high || !avg) return null;

  // Create data for the chart with proper structure
  const chartData = [
    { name: 'Entry Level', value: low, fill: 'oklch(--primary)/50' },
    { name: 'Market Average', value: avg, fill: 'oklch(--primary)' },
    { name: 'Senior Level', value: high, fill: 'oklch(--primary)' }
  ];

  // Calculate positions for markers
  const totalRange = high - low;
  const avgPosition = ((avg - low) / totalRange) * 100;

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Salary Range</CardTitle>
        <CardDescription className="text-muted-foreground">Complete compensation range from entry level to senior positions</CardDescription>
      </CardHeader>
      <CardContent>

        <div className="space-y-6">
          {/* Main Chart Container */}
          <div className="relative">
            {/* Value labels above the chart */}
            <div className="flex justify-between mb-3">
              <div className="text-center">
                <span className="text-sm font-medium text-muted-foreground">${Number(low).toLocaleString()}</span>
                <div className="text-xs text-muted-foreground mt-1">Entry Level</div>
              </div>
              <div className="text-center absolute" style={{ left: `${avgPosition}%`, transform: 'translateX(-50%)' }}>
                <span className="text-sm font-semibold text-primary">${Number(avg).toLocaleString()}</span>
                <div className="text-xs text-primary mt-1">Market Average</div>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-muted-foreground">${Number(high).toLocaleString()}</span>
                <div className="text-xs text-muted-foreground mt-1">Senior Level</div>
              </div>
            </div>




            {/* Custom Range Bar with Gradient */}
            <div className="relative h-12 bg-muted rounded-full overflow-hidden border shadow-inner mt-4">
            {/* Gradient definitions */}
            <svg className="absolute w-0 h-0">
              <defs>
                <linearGradient id="salaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset={`${avgPosition}%`} stopColor="#10B981" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            {/* Range bar with gradient */}
            <div
              className="absolute h-full rounded-full"
              style={{
                width: '100%',
                background: 'linear-gradient(to right, var(--accent) 0%, var(--primary) 40%, var(--primary) 80%)'
              }}
            />

            {/* Average marker line */}
            <div
              className="absolute top-0 h-full w-1.5 bg-accent shadow-lg"
              style={{ left: `${avgPosition}%` }}
            />

            {/* Average marker dot with enhanced visibility and hover tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-1/2 w-5 h-5 bg-primary rounded-full border-4 border-background shadow-xl transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-20 hover:scale-110 transition-transform duration-200"
                  style={{ left: `${avgPosition}%` }}
                />
              </TooltipTrigger>
              <TooltipContent
                className="z-[9999] bg-primary text-white border-0 shadow-2xl px-4 py-2 text-sm font-bold"
                side="top"
                sideOffset={12}
                align="center"
              >
                <p className="text-white">${Number(avg).toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>

          </div>

          {/* Enhanced labels below the chart */}
          <div className="flex justify-between mt-4 relative">
            <div className="text-center">
              <div className="w-1 h-5 bg-primary mx-auto mb-2 rounded-full"></div>
              <span className="text-xs font-medium text-muted-foreground">Entry Level</span>
              <div className="text-xs text-muted-foreground mt-1">${Number(low).toLocaleString()}</div>
            </div>
            <div className="text-center absolute" style={{ left: `${avgPosition}%`, transform: 'translateX(-50%)' }}>
              <div className="w-1 h-5 bg-primary mx-auto mb-2 rounded-full"></div>
              <span className="text-xs font-medium text-primary">Market Average</span>
              <div className="text-xs text-primary mt-1">${Number(avg).toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="w-1 h-5 bg-primary mx-auto mb-2 rounded-full"></div>
              <span className="text-xs font-medium text-primary">Senior Level</span>
              <div className="text-xs text-muted-foreground mt-1">${Number(high).toLocaleString()}</div>
            </div>
          </div>
        </div>

          {/* Additional Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs font-medium text-orange-600 mb-2">Range Spread</p>
              <p className="text-lg font-bold text-orange-600">
                ${(Number(high) - Number(low)).toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 mt-1">Total range</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-600 mb-2">Average Position</p>
              <p className="text-lg font-bold text-green-600">
                {((Number(avg) - Number(low)) / (Number(high) - Number(low)) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-green-600 mt-1">Above minimum</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs font-medium text-primary mb-2">Growth Potential</p>
              <p className="text-lg font-bold text-primary">
                +{((Number(high) - Number(avg)) / Number(avg) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-primary mt-1">Above average</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Gender Salary Comparison Card */}
    <Card className="mt-6">
      <CardHeader>
        {(() => {
          const titleText = record.title || record.h1Title || record.occupation || 'This Role';
          return (
            <>
              <CardTitle>Gender comparison</CardTitle>
              <CardDescription>
                As indicated, the accent colour represents the percentage share for women and the
                primary colour represents the percentage share for men.
              </CardDescription>
            </>
          );
        })()}
      </CardHeader>
      <CardContent>
        {(() => {
          const m = Number(record.genderMale || 0);
          const f = Number(record.genderFemale || 0);
          const total = m + f;
          const center = total > 0 ? `${Math.max(m, f).toFixed(0)}%` : '—';
          const dominant = f > m ? 'female' : m > f ? 'male' : 'equal';
          const role = record.title || record.occupation || 'this role';
          const chartData = [
            { name: 'Male', value: m, color: '#16a34a' },
            { name: 'Female', value: f, color: '#f59e0b' },
          ];

          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Visual side */}
              <div className="grid grid-cols-3 gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Venus className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">Female</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="bg-card rounded-full border w-48 h-48 flex items-center justify-center">
                      <ResponsiveContainer width={192} height={192}>
                        <PieChart>
                          <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={88} stroke="#ffffff" strokeWidth={2}>
                            <Cell fill={chartData[0].color} />
                            <Cell fill={chartData[1].color} />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <span className="absolute text-sm font-semibold text-foreground">{center}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-3 rounded-sm bg-amber-500" />
                      <span className="text-xs text-muted-foreground">Female</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-3 rounded-sm bg-green-600" />
                      <span className="text-xs text-muted-foreground">Male</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Mars className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">Male</span>
                </div>
              </div>

              {/* Text side */}
              <div className="space-y-4">
                <p className="text-sm text-foreground">
                  This pie chart demonstrates the gender share for {role}. As indicated, the golden colour represents the percentage share
                  for women and the green represents the percentage share for men.
                </p>
                <p className="text-sm text-foreground">
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
    </>
  );
}

// Comprehensive Experience Analysis Component with Line Charts
function ComprehensiveExperienceAnalysis({ record }: { record: any }) {
  // Experience level data
  const experienceLevels = [
    { name: 'Entry Level', value: record.entryLevel, color: '#3B82F6' },
    { name: 'Early Career', value: record.earlyCareer, color: '#10B981' },
    { name: 'Mid Career', value: record.midCareer, color: '#F59E0B' },
    { name: 'Experienced', value: record.experienced, color: '#EF4444' },
    { name: 'Late Career', value: record.lateCareer, color: '#8B5CF6' },
  ].filter(level => level.value != null);

  // Years of experience data
  const yearsExperience = [
    { name: '1 Year', value: record.oneYr, color: '#06B6D4' },
    { name: '1-4 Years', value: record.oneFourYrs, color: '#84CC16' },
    { name: '5-9 Years', value: record.fiveNineYrs, color: '#F97316' },
    { name: '10-19 Years', value: record.tenNineteenYrs, color: '#EC4899' },
    { name: '20+ Years', value: record.twentyYrsPlus, color: '#6366F1' },
  ].filter(exp => exp.value != null);

  if (experienceLevels.length === 0 && yearsExperience.length === 0) return null;

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border ">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Comprehensive Experience Analysis</h3>
          <p className="text-muted-foreground">Salary progression across experience levels and years of experience</p>
      </div>

      <div className="space-y-12">
        {/* Experience Levels Line Chart */}
        {experienceLevels.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Experience Level Salaries (Hourly)</h4>
              <p className="text-sm text-muted-foreground mb-6">Hourly rate by experience level</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={experienceLevels} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value: number) => `$${value.toLocaleString()}/hr`} />
                  
                  <RechartsTooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}/hr`, 'Hourly rate']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    dot={{ r: 6, fill: 'var(--chart-1)', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: 'var(--chart-1)', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-start">
              <div className="flex justify-center w-full">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-chart-1" />
                  <span className="text-sm text-foreground">Hourly salary</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Years of Experience Line Chart */}
        {yearsExperience.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Years of Experience Salaries</h4>
              <p className="text-sm text-muted-foreground mb-6">Annual salary progression by years of experience</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearsExperience} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-2)"
                    strokeWidth={3}
                    dot={{ r: 6, fill: 'var(--chart-2)', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: 'var(--chart-2)', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-start">
              <div className="flex justify-center w-full">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2" />
                  <span className="text-sm text-foreground">Annual salary</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Combined Legend - REMOVED */}
    </div>
  );
}

// Mini Line Chart Component for Cards - Shows main value and entry level
function MiniLineChart({ data, color, height = 40, width = 80, mainValue }: {
  data: number[];
  color: string;
  height?: number;
  width?: number;
  mainValue: string;
}) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height
  }));

  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create gradient for the line
  const gradientId = `line-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="opacity-90">
      {/* Gradient definitions */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* X and Y axis lines - very subtle */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={height}
        stroke="#E5E7EB"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line
        x1="0"
        y1={height}
        x2={width}
        y2={height}
        stroke="#E5E7EB"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Gradient line path */}
      <path
        d={pathData}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="2.5"
          fill="white"
          stroke={color}
          strokeWidth="1.5"
        />
      ))}

      {/* Show only main value and one other key value */}
      {(() => {
        // Show main value in center and entry level at start
        const mainIndex = Math.floor(data.length / 2); // Middle point
        const entryIndex = 0; // First point

        return [
          // Main value (center)
          <text
            key="main-value"
            x={points[mainIndex].x}
            y={points[mainIndex].y - 8}
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={color}
            className="drop-shadow-sm"
          >
            {mainValue}
          </text>,
          // Entry level value (start)
          <text
            key="entry-value"
            x={points[entryIndex].x}
            y={points[entryIndex].y + 12}
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            fill={color}
            opacity="0.8"
            className="drop-shadow-sm"
          >
            {data[entryIndex] >= 1000 ? `$${(data[entryIndex] / 1000).toFixed(0)}k` : `$${data[entryIndex].toFixed(0)}`}
          </text>
        ];
      })()}
    </svg>
  );
}

export function ComprehensiveStats({ record, country }: ComprehensiveStatsProps) {
  // State for skills filtering and sorting
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('proficiency');

  // Helper function to check if value exists and is not #REF! or invalid
  const isValidValue = (value: any) => {
    if (!value || value === '#REF!' || value === '' || value === '0' || value === '00') return false;
    const numValue = Number(value);
    return !isNaN(numValue) && numValue > 0;
  };

  // Generate simple, logical data for mini charts
  const annualSalaryData = [
    Math.round(record.avgAnnualSalary * 0.8),  // Entry level
    Math.round(record.avgAnnualSalary * 0.9),  // Early career
    record.avgAnnualSalary,                      // Average
    Math.round(record.avgAnnualSalary * 1.1),  // Mid career
    Math.round(record.avgAnnualSalary * 1.25)  // Experienced
  ];

  const hourlySalaryData = [
    Math.round(record.avgHourlySalary * 0.85), // Entry level
    Math.round(record.avgHourlySalary * 0.95), // Early career
    record.avgHourlySalary,                     // Average
    Math.round(record.avgHourlySalary * 1.1),  // Mid career
    Math.round(record.avgHourlySalary * 1.2)   // Experienced
  ];

  // Calculate salary percentiles
  const percentiles = [
    { label: '10th Percentile', value: record['10P'], color: 'red' },
    { label: '25th Percentile', value: record['25P'], color: 'orange' },
    { label: '50th Percentile', value: record['50P'], color: 'yellow' },
    { label: '75th Percentile', value: record['75P'], color: 'blue' },
    { label: '90th Percentile', value: record['90P'], color: 'green' },
  ].filter(p => isValidValue(p.value));

  // Salary breakdown table data (moved here to place after Percentiles section)
  const salaryBreakdownData = [
    isValidValue(record.weeklySalary)
      ? { period: 'Weekly', amount: `$${Number(record.weeklySalary).toLocaleString()}`, description: 'Gross weekly salary' }
      : null,
    isValidValue(record.fortnightlySalary)
      ? { period: 'Fortnightly', amount: `$${Number(record.fortnightlySalary).toLocaleString()}`, description: 'Gross fortnightly salary' }
      : null,
    isValidValue(record.monthlySalary)
      ? { period: 'Monthly', amount: `$${Number(record.monthlySalary).toLocaleString()}`, description: 'Gross monthly salary', highlight: true }
      : null,
    isValidValue(record.avgAnnualSalary)
      ? { period: 'Annual', amount: `$${Number(record.avgAnnualSalary).toLocaleString()}`, description: 'Gross annual salary', highlight: true }
      : null,
  ].filter(Boolean) as { period: string; amount: string; description?: string; highlight?: boolean }[];

  // Skills data (include percentage with proper key)
  const skills = [
    { name: record.skillsNameOne, value: record.skillsNamePercOne || 0, percentage: record.skillsNamePercOne, color: '#0088FE' },
    { name: record.skillsNameTwo, value: record.skillsNamePercTwo || 0, percentage: record.skillsNamePercTwo, color: '#00C49F' },
    { name: record.skillsNameThree, value: record.skillsNamePercThree || 0, percentage: record.skillsNamePercThree, color: '#FFBB28' },
    { name: record.skillsNameFour, value: record.skillsNamePercFour || 0, percentage: record.skillsNamePercFour, color: '#FF8042' },
    { name: record.skillsNameFive, value: record.skillsNamePercFive || 0, percentage: record.skillsNamePercFive, color: '#8884D8' },
    { name: record.skillsNameSix, value: record.skillsNamePercSix || 0, percentage: record.skillsNamePercSix, color: '#FFC300' },
    { name: record.skillsNameSeven, value: record.skillsNamePercSeven || 0, percentage: record.skillsNamePercSeven, color: '#FF5733' },
    { name: record.skillsNameEight, value: record.skillsNamePercEight || 0, percentage: record.skillsNamePercEight, color: '#33FF57' },
    { name: record.skillsNameNine, value: record.skillsNamePercNine || 0, percentage: record.skillsNamePercNine, color: '#3357FF' },
    { name: record.skillsNameTen, value: record.skillsNamePercTen || 0, percentage: record.skillsNamePercTen, color: '#FF33A1' },
    { name: record.skillsNameEleven, value: record.skillsNamePercEleven || 0, percentage: record.skillsNamePercEleven, color: '#FF33A1' },
    { name: record.skillsNameTwelve, value: record.skillsNamePercTwelve || 0, percentage: record.skillsNamePercTwelve, color: '#FF33A1' },
    { name: record.skillsNameThirteen, value: record.skillsNamePercThirteen || 0, percentage: record.skillsNamePercThirteen, color: '#FF33A1' },
    { name: record.skillsNameFourteen, value: record.skillsNamePercFourteen || 0, percentage: record.skillsNamePercFourteen, color: '#FF33A1' },
    { name: record.skillsNameFifteen, value: record.skillsNamePercFifteen || 0, percentage: record.skillsNamePercFifteen, color: '#FF33A1' },
    { name: record.skillsNameSixteen, value: record.skillsNamePercSixteen || 0, percentage: record.skillsNamePercSixteen, color: '#FF33A1' },
    { name: record.skillsNameSeventeen, value: record.skillsNamePercSeventeen || 0, percentage: record.skillsNamePercSeventeen, color: '#FF33A1' },
  ]
    .filter(skill => skill.name && skill.name !== '#REF!' && skill.value > 0)
    .map(skill => ({
      name: skill.name!,
      value: skill.value,
      percentage: skill.percentage,
      color: skill.color
    }));

  // Related occupations
  const relatedOccupations = [
    record.relLinkOcc1, record.relLinkOcc2, record.relLinkOcc3, record.relLinkOcc4, record.relLinkOcc5,
    record.relLinkOcc6, record.relLinkOcc7, record.relLinkOcc8, record.relLinkOcc9, record.relLinkOcc10,
    record.relLinkOcc11, record.relLinkOcc12
  ].filter(occ => isValidValue(occ));

  // Related locations
  const relatedLocations = [
    record.relLinkLoc1, record.relLinkLoc2, record.relLinkLoc3, record.relLinkLoc4, record.relLinkLoc5,
    record.relLinkLoc6, record.relLinkLoc7, record.relLinkLoc8, record.relLinkLoc9, record.relLinkLoc10,
    record.relLinkLoc11, record.relLinkLoc12
  ].filter(loc => isValidValue(loc));

  // Related states
  const relatedStates = [
    record.relLinkState1, record.relLinkState2, record.relLinkState3, record.relLinkState4, record.relLinkState5,
    record.relLinkState6, record.relLinkState7, record.relLinkState8, record.relLinkState9, record.relLinkState10,
    record.relLinkState11, record.relLinkState12
  ].filter(state => isValidValue(state));

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Annual */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-primary text-white shadow">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Average Annual</p>
                <p className="text-3xl font-extrabold text-primary tracking-tight">
                  ${record.avgAnnualSalary?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
            {/* Mini Line Chart */}
            {/* <div className="absolute top-4 right-4">
              <MiniLineChart
                data={annualSalaryData}
                color="#2563EB"
                mainValue={`$${record.avgAnnualSalary?.toLocaleString() || 'N/A'}`}
              />
            </div> */}
          </div>
        </div>

        {/* Average Hourly */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-green-600 text-white shadow">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Average Hourly</p>
                <p className="text-3xl font-extrabold text-green-600 tracking-tight">
                  ${record.avgHourlySalary?.toFixed(2) || 'N/A'}/hr
                </p>
              </div>
            </div>
            {/* Mini Line Chart */}
            {/* <div className="absolute top-4 right-4">
              <MiniLineChart
                data={hourlySalaryData}
                color="#059669"
                mainValue={`$${record.avgHourlySalary?.toFixed(2) || 'N/A'}/hr`}
              />
            </div> */}
          </div>
        </div>

        {/* Gender Split with mini pie */}
        <div className="p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-purple-600 text-white shadow">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-600">Gender Split</p>
                <p className="text-xl font-bold text-purple-600 tracking-tight">
                  {record.genderMale || 0}% M / {record.genderFemale || 0}% F
                </p>
              </div>
            </div>
            <MiniPie malePercent={record.genderMale} femalePercent={record.genderFemale} />
          </div>
        </div>
      </div>

      {/* Enhanced Salary Range horizontal graph below cards */}
      <SalaryRangeBar
        record={record}
      />

      {/* Salary Percentiles Graph */}
      {percentiles.length > 0 && (
        <PercentilesChart
          title="Salary Percentiles"
          subtitle="Distribution from 10th to 90th percentile"
          data={percentiles.map(p => ({
            name: p.label.replace(' Percentile', ''),
            value: Number(p.value),
          }))}
        />
      )}

      {/* Salary Breakdown by Period - placed immediately after Salary Percentiles for continuity */}
      {salaryBreakdownData.length > 0 && (
        <SalaryBreakdownTable
          data={salaryBreakdownData}
          title="Salary Breakdown by Period"
          subtitle="Detailed breakdown of compensation across different time periods"
        />
      )}

      {/* Comprehensive Experience Analysis */}
      <ComprehensiveExperienceAnalysis record={record} />

      {/* Top Skills & Market Demand */}
      {skills.length > 0 && (() => {
        // Enhanced skills data with market demand analysis
        // console.log('Processing skills:', skills);
        const enhancedSkills = skills.map((skill, index) => {
          // Derive market share from proficiency percentage
          const marketShare = Math.min(skill.percentage * 1.2, 30); // Cap at 30%

          // Derive salary impact based on skill importance
          const salaryImpact = Math.min(skill.percentage * 0.6, 20); // Cap at 20%

          // Determine demand level based on market share
          let demandLevel = 'Low Demand';
          let demandColor = 'blue';
          if (marketShare >= 20) {
            demandLevel = 'High Demand';
            demandColor = 'green';
          } else if (marketShare >= 10) {
            demandLevel = 'Medium Demand';
            demandColor = 'orange';
          }

          // Determine skill category based on skill name - more comprehensive detection
          let category = 'Technical';
          const skillName = skill.name.toLowerCase();

          // Software & Programming
          if (skillName.includes('programming') || skillName.includes('software') || skillName.includes('development') ||
            skillName.includes('coding') || skillName.includes('api') || skillName.includes('framework') ||
            skillName.includes('javascript') || skillName.includes('python') || skillName.includes('java') ||
            skillName.includes('c#') || skillName.includes('c++') || skillName.includes('php') ||
            skillName.includes('react') || skillName.includes('angular') || skillName.includes('vue') ||
            skillName.includes('node') || skillName.includes('sql') || skillName.includes('database') ||
            skillName.includes('mvc') || skillName.includes('microsoft') || skillName.includes('server')) {
            category = 'Software';
          }
          // Management & Leadership
          else if (skillName.includes('management') || skillName.includes('leadership') || skillName.includes('supervision') ||
            skillName.includes('team') || skillName.includes('project') || skillName.includes('budget') ||
            skillName.includes('planning') || skillName.includes('strategy') || skillName.includes('coordination')) {
            category = 'Management';
          }
          // Accounting & Finance
          else if (skillName.includes('accounting') || skillName.includes('financial') || skillName.includes('finance') ||
            skillName.includes('ledger') || skillName.includes('bookkeeping') || skillName.includes('audit') ||
            skillName.includes('tax') || skillName.includes('payroll') || skillName.includes('billing') ||
            skillName.includes('invoice') || skillName.includes('revenue') || skillName.includes('expense')) {
            category = 'Accounting';
          }
          // Analysis & Data
          else if (skillName.includes('analysis') || skillName.includes('analytics') || skillName.includes('modeling') ||
            skillName.includes('data') || skillName.includes('reporting') || skillName.includes('forecasting') ||
            skillName.includes('statistics') || skillName.includes('metrics') || skillName.includes('kpi') ||
            skillName.includes('dashboard') || skillName.includes('visualization') || skillName.includes('research')) {
            category = 'Analysis';
          }
          // Process & Operations
          else if (skillName.includes('process') || skillName.includes('operations') || skillName.includes('workflow') ||
            skillName.includes('procedure') || skillName.includes('close') || skillName.includes('month') ||
            skillName.includes('quarterly') || skillName.includes('compliance') || skillName.includes('quality') ||
            skillName.includes('efficiency') || skillName.includes('optimization') || skillName.includes('automation')) {
            category = 'Process';
          }
          // Communication & Customer Service
          else if (skillName.includes('communication') || skillName.includes('customer') || skillName.includes('service') ||
            skillName.includes('support') || skillName.includes('presentation') || skillName.includes('training') ||
            skillName.includes('documentation') || skillName.includes('writing') || skillName.includes('verbal')) {
            category = 'Communication';
          }

          return {
            ...skill,
            marketShare: Math.round(marketShare),
            salaryImpact: Math.round(salaryImpact),
            demandLevel,
            demandColor,
            category
          };
        });

        // console.log('Enhanced skills with categories:', enhancedSkills);

        // Filter skills based on active filter
        const filteredSkills = activeFilter === 'All'
          ? enhancedSkills
          : enhancedSkills.filter(skill => skill.category === activeFilter);

        // Sort skills based on active sort
        const sortedSkills = useMemo(() => {
          const skillsToSort = [...filteredSkills];
          if (activeSort === 'proficiency') {
            return skillsToSort.sort((a, b) => b.percentage - a.percentage);
          } else if (activeSort === 'demand') {
            return skillsToSort.sort((a, b) => b.marketShare - a.marketShare);
          }
          return skillsToSort;
        }, [filteredSkills, activeSort]);

        return (
          <div className=" bg-card rounded-2xl p-8 border border-green-200 shadow-md">
            {/* Header Section with Filter Component */}
            {/* <SkillsFilter
              skills={enhancedSkills}
              onFilterChange={setActiveFilter}
              onSortChange={setActiveSort}
              activeFilter={activeFilter}
              activeSort={activeSort}
            /> */}

            <h3 className="text-2xl font-bold text-foreground mb-2">Top Skills & Market Demand</h3>
            <p className="text-sm text-muted-foreground mb-6">Most in-demand skills with proficiency levels and salary impact analysis</p>

            {/* Skills Analysis Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AwardIcon className="w-4 h-4 text-primary" />
                <h4 className="text-lg font-semibold text-primary ">Skills Analysis ({sortedSkills.length} skills)</h4>
              </div>

              <div className="space-y-2">
                {sortedSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-center p-2 text-lg text-primary bg-primary/10 rounded-md mr-4">
                      {
                        /* Show icons basedon the skill */
                        skill.category === 'Software' ? <CodeIcon className="w-4 h-4 text-primary" /> :
                          skill.category === 'Management' ? <UserIcon className="w-4 h-4 text-green-600" /> :
                            skill.category === 'Accounting' ? <CalculatorIcon className="w-4 h-4 text-primary" /> :
                              skill.category === 'Analysis' ? <ChartAreaIcon className="w-4 h-4 text-primary" /> :
                                skill.category === 'Technical' ? <CodeIcon className="w-4 h-4 text-primary" /> :
                                  skill.category === 'Process' ? <FlowerIcon className="w-4 h-4 text-green-600" /> :
                                    skill.category === 'Communication' ? <MessageCircleIcon className="w-4 h-4 text-primary" /> : <CodeIcon className="w-4 h-4 text-primary" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-foreground text-sm">{skill.name}</h5>
                          <span className="px-2 py-1 bg-background text-xs border rounded-md">
                          {skill.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${skill.demandColor === 'green' ? 'bg-primary' :
                            skill.demandColor === 'orange' ? 'bg-destructive' : 'bg-chart-1'
                            }`}></div>
                          <span className="text-xs text-muted-foreground">{skill.demandLevel}</span>
                        </div>

                        <span className="text-xs text-foreground font-medium">
                          +{skill.salaryImpact}% salary impact
                        </span>
                      </div>
                      <div className="w-full bg-primary/20 rounded-full h-2 mt-3">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(skill.marketShare / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="">
                      <div className="w-auto">
                        {/* <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(skill.marketShare / 30) * 100}%` }}
                          ></div>
                        </div> */}
                        <div className="block text-center">
                        <div className="text-sm font-semibold text-chart-1">
                          {skill.marketShare}%
                           </div>
                           <div className="text-xs font-light text-foreground">
                           Market Share
                           </div>
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Annual Salary Information and Hourly Rate Information Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Annual Salary Details */}
        {isValidValue(record.avgAnnualSalary) && (
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Average Annual Salary Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Average Low Range</span>
                <span className="text-lg font-semibold text-destructive">
                  ${record.lowSalary ? Number(record.lowSalary).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Average High Range</span>
                <span className="text-lg font-semibold text-chart-1">
                  ${record.highSalary ? Number(record.highSalary).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="bg-secondary p-4 rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${record.avgAnnualSalary ? Number(record.avgAnnualSalary).toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Annual Salary</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hourly Rate Details */}
        {isValidValue(record.avgHourlySalary) && (
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Average Hourly Rate Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Average Low Hourly</span>
                <span className="text-lg font-semibold text-destructive">
                  ${record.hourlyLowValue ? Number(record.hourlyLowValue).toFixed(2) : 'N/A'}/hr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Average High Hourly</span>
                <span className="text-lg font-semibold text-chart-1">
                  ${record.hourlyHighValue ? Number(record.hourlyHighValue).toFixed(2) : 'N/A'}/hr
                </span>
              </div>
              <div className="bg-secondary p-4 rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${record.avgHourlySalary ? Number(record.avgHourlySalary).toFixed(2) : 'N/A'}/hr
                  </div>
                  <div className="text-sm text-muted-foreground">Average Hourly Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Compensation */}
      {(() => {
        // Check if there are any valid compensation types - modified to handle 0 values properly
        const hasValidBonus = (record.bonusRangeMin != null && record.bonusRangeMin !== '#REF!' && record.bonusRangeMin !== '') ||
          (record.bonusRangeMax != null && record.bonusRangeMax !== '#REF!' && record.bonusRangeMax !== '');
        const hasValidProfitSharing = record.profitSharingMin != null && record.profitSharingMax != null &&
          record.profitSharingMin !== '#REF!' && record.profitSharingMax !== '#REF!' &&
          record.profitSharingMin !== '' && record.profitSharingMax !== '';
        const hasValidCommission = record.commissionMin != null && record.commissionMax != null &&
          record.commissionMin !== '#REF!' && record.commissionMax !== '#REF!' &&
          record.commissionMin !== '' && record.commissionMax !== '';

        // Only render if there's at least one valid compensation type
        if (!hasValidBonus && !hasValidProfitSharing && !hasValidCommission) {
          return null;
        }

        return (
          <div className="space-y-8">

            {/* Debug: Show bonus data */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-yellow-800 mb-2">Debug: Bonus Data</h4>
                <p className="text-sm text-yellow-700">bonusRangeMin: {String(record.bonusRangeMin)}</p>
                <p className="text-sm text-yellow-700">bonusRangeMax: {String(record.bonusRangeMax)}</p>
                <p className="text-sm text-yellow-700">hasValidBonus: {String(hasValidBonus)}</p>
              </div>
            )} */}

            {/* Bonus Compensation - New Design */}
            {hasValidBonus && (() => {
              // Calculate bonus values
              const minBonus = Number(record.bonusRangeMin) || 0;
              const maxBonus = Number(record.bonusRangeMax) || 0;
              const avgBonus = (minBonus + maxBonus) / 2;
              const totalRange = maxBonus - minBonus;

              // Calculate growth percentages
              const minToAvgGrowth = minBonus > 0 ? ((avgBonus - minBonus) / minBonus * 100) : 0;
              const avgToMaxGrowth = avgBonus > 0 ? ((maxBonus - avgBonus) / avgBonus * 100) : 0;

              // Calculate median position and growth factor
              const medianPosition = totalRange > 0 ? ((avgBonus - minBonus) / totalRange * 100) : 0;
              const growthFactor = minBonus > 0 ? (maxBonus / minBonus) : 0;

              return (
                <div className="bg-card rounded-2xl p-8 border border-border">
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-foreground mb-2">Bonus Compensation</h4>
                    <p className="text-sm text-muted-foreground font-medium">Performance-based bonus ranges and distribution</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Three Vertical Cards */}
                    <div className="px-8">
                      {/* Maximum Bonus Card */}
                      <div className="bg-secondary rounded-xl p-6 border border-border shadow-lg">
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground mb-2">Maximum Bonus</p>
                          <p className="text-3xl font-bold text-chart-1 mb-4">
                            ${maxBonus.toLocaleString()}
                          </p>
                          <div className="w-full h-3 bg-secondary rounded-full">
                            <div className="w-full h-3 bg-chart-1 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-chart-1"></div>
                      </div>

                      {/* Average Bonus Card */}
                      <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground mb-2">Average Bonus</p>
                          <p className="text-3xl font-bold text-chart-1 mb-4">
                            ${avgBonus.toLocaleString()}
                          </p>
                          <div className="w-full h-3 bg-secondary rounded-full">
                            <div
                              className="h-3 bg-chart-1 rounded-full"
                              style={{ width: '67%' }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-chart-1"></div>
                      </div>

                      {/* Minimum Bonus Card */}
                      <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground mb-2">Minimum Bonus</p>
                          <p className="text-3xl font-bold text-chart-1 mb-4">
                            ${minBonus.toLocaleString()}
                          </p>
                          <div className="flex justify-center">
                            <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Growth Potential Analysis */}
                    <div className="space-y-6">
                      {/* Growth Potential Analysis Card */}
                      <div className="bg-chart-1/5 rounded-xl p-8 border border-border">
                        <h5 className="text-xl font-bold text-green-800 mb-6">Growth Potential Analysis</h5>
                        <div className="space-y-4">
                          <div className="bg-background rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-foreground">From Minimum to Average:</span>
                              <span className="text-xl font-bold text-chart-1">
                                +{minToAvgGrowth.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-foreground">From Average to Maximum:</span>
                              <span className="text-xl font-bold text-chart-1">
                                +{avgToMaxGrowth.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div className="bg-background rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-foreground">Total Range:</span>
                              <span className="text-xl font-bold text-chart-1">
                                ${totalRange.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Two smaller cards below */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Median Position Card */}
                        <div className="bg-chart-1/5 rounded-xl p-6 border border-border">
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground mb-3">Median Position</p>
                            <p className="text-3xl font-bold text-chart-1">
                              {medianPosition.toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        {/* Growth Factor Card */}
                        <div className="bg-chart-1/5 rounded-xl p-6 border border-border">
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground mb-3">Growth Factor</p>
                            <p className="text-3xl font-bold text-chart-1">
                              {growthFactor.toFixed(1)}x
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Commission Compensation Chart */}
            {hasValidCommission && (
              <div className="bg-card rounded-lg shadow-md p-6 border border">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">Commission Structure</h4>
                    <p className="text-sm text-muted-foreground">Sales-based commission ranges and potential earnings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Commission Range Area Chart */}
                  <div className="lg:col-span-2">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={(() => {
                          const min = Number(record.commissionMin) || 0;
                          const max = Number(record.commissionMax) || 0;
                          const avg = (min + max) / 2;

                          // If minimum is 0, use average as the starting point
                          if (min === 0) {
                            return [
                              { name: 'Average', value: avg, fill: '#10B981' },
                              { name: 'Maximum', value: max, fill: '#EF4444' }
                            ];
                          }

                          return [
                            { name: 'Minimum', value: min, fill: '#F59E0B' },
                            { name: 'Average', value: avg, fill: '#10B981' },
                            { name: 'Maximum', value: max, fill: '#EF4444' }
                          ];
                        })()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value: number) => `$${value.toLocaleString()}`} />
                          <RechartsTooltip
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Commission Amount']}
                            labelStyle={{ color: '#374151' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Commission Statistics */}
                  <div className="space-y-4">
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-900">
                          ${(Number(record.commissionMax) || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-pink-600">Maximum Commission</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          ${(((Number(record.commissionMin) || 0) + (Number(record.commissionMax) || 0)) / 2).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">Average Commission</div>
                      </div>
                    </div>

                    {(() => {
                      const min = Number(record.commissionMin) || 0;
                      if (min > 0) {
                        return (
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">
                                ${min.toLocaleString()}
                              </div>
                              <div className="text-sm text-orange-600">Minimum Commission</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Profit Sharing Chart */}
            {hasValidProfitSharing && (
              <div className="bg-card rounded-lg shadow-md p-6 border border">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">Profit Sharing</h4>
                    <p className="text-sm text-muted-foreground">Company profit distribution and employee benefits</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profit Sharing Pie Chart */}
                  <div className="lg:col-span-2">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <Pie
                            data={(() => {
                              const min = Number(record.profitSharingMin) || 0;
                              const max = Number(record.profitSharingMax) || 0;
                              const avg = (min + max) / 2;

                              // If minimum is 0, use average as the starting point
                              if (min === 0) {
                                return [
                                  { name: 'Average', value: avg, fill: '#10B981' },
                                  { name: 'Maximum', value: max, fill: '#EF4444' }
                                ];
                              }

                              return [
                                { name: 'Minimum', value: min, fill: '#F59E0B' },
                                { name: 'Average', value: avg, fill: '#10B981' },
                                { name: 'Maximum', value: max, fill: '#EF4444' }
                              ];
                            })()}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: $${(value || 0).toLocaleString()}`}
                          />
                          <RechartsTooltip
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit Share Amount']}
                            labelStyle={{ color: '#374151' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Profit Sharing Statistics */}
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-900">
                          ${(Number(record.profitSharingMax) || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-indigo-600">Maximum Profit Share</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          ${(((Number(record.profitSharingMin) || 0) + (Number(record.profitSharingMax) || 0)) / 2).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">Average Profit Share</div>
                      </div>
                    </div>

                    {(() => {
                      const min = Number(record.profitSharingMin) || 0;
                      if (min > 0) {
                        return (
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">
                                ${min.toLocaleString()}
                              </div>
                              <div className="text-sm text-orange-600">Minimum Profit Share</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Combined Compensation Summary */}
            {(() => {
              const validCompensations = [hasValidBonus, hasValidProfitSharing, hasValidCommission].filter(Boolean);

              if (validCompensations.length > 1) {
                const totalMax = (
                  (hasValidBonus ? (Number(record.bonusRangeMax) || 0) : 0) +
                  (hasValidProfitSharing ? (Number(record.profitSharingMax) || 0) : 0) +
                  (hasValidCommission ? (Number(record.commissionMax) || 0) : 0)
                );

                return (
                  <div className="bg-card rounded-lg shadow-md p-6 border border">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-foreground mb-2">Total Additional Compensation Potential</h4>
                        <p className="text-sm text-muted-foreground">Combined maximum earnings from all compensation sources</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {hasValidBonus && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-900">
                              ${(Number(record.bonusRangeMax) || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-yellow-600">Bonus Potential</div>
                          </div>
                        </div>
                      )}

                      {hasValidCommission && (
                        <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                          <div className="text-center">
                            <div className="text-lg font-bold text-pink-900">
                              ${(Number(record.commissionMax) || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-pink-600">Commission Potential</div>
                          </div>
                        </div>
                      )}

                      {hasValidProfitSharing && (
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="text-center">
                            <div className="text-lg font-bold text-indigo-900">
                              ${(Number(record.profitSharingMax) || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-indigo-600">Profit Share Potential</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">
                            ${totalMax.toLocaleString()}
                          </div>
                          <div className="text-lg text-primary font-medium">Total Maximum Additional Compensation</div>
                          <div className="text-sm text-primary mt-1">Combined from all sources</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        );
      })()}

      {/* Related Data */}
      {(relatedOccupations.length > 0 || relatedLocations.length > 0 || relatedStates.length > 0) && (
        <div className="bg-card rounded-lg shadow-md p-6 border border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Related Information</h3>

          {relatedOccupations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-foreground mb-3">Related Occupations</h4>
              <div className="flex flex-wrap gap-2">
                {relatedOccupations.map((occ, index) => (
                  <Badge key={index} variant="blue" className="bg-primary/10 text-primary border-primary/20">
                    {occ}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {relatedLocations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-foreground mb-3">Related Locations</h4>
              <div className="flex flex-wrap gap-2">
                {relatedLocations.map((loc, index) => (
                  <Badge key={index} variant="green" className="bg-green-50 text-green-600 border-green-200">
                    <MapPin className="w-3 h-3 mr-1" />
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {relatedStates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-foreground mb-3">Related States</h4>
              <div className="flex flex-wrap gap-2">
                {relatedStates.map((state, index) => (
                  <Badge key={index} variant="purple" className="bg-purple-50 text-purple-600 border-purple-200">
                    <Building className="w-3 h-3 mr-1" />
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
