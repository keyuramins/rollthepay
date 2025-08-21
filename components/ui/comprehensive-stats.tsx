"use client";

import { Badge } from "@/components/ui/badge";
import { PercentilesChart } from "@/components/ui/percentiles-chart";
import { SalaryBreakdownTable } from "@/components/ui/salary-breakdown-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie } from 'recharts';
import {
  DollarSign,
  Clock,
  Users,
  Target,
  TrendingUp,
  MapPin,
  Building,
  Award,
  Zap
} from "lucide-react";

interface ComprehensiveStatsProps {
  record: any;
  country: string;
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
    { name: 'Entry Level', value: low, fill: '#F97316' },
    { name: 'Market Average', value: avg, fill: '#10B981' },
    { name: 'Senior Level', value: high, fill: '#3B82F6' }
  ];

  // Calculate positions for markers
  const totalRange = high - low;
  const avgPosition = ((avg - low) / totalRange) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Salary Range</h3>
        <p className="text-sm text-gray-600">Complete compensation range from entry level to senior positions</p>
      </div>

      <div className="space-y-6">
        {/* Main Chart Container */}
        <div className="relative">
          {/* Value labels above the chart */}
          <div className="flex justify-between mb-3">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">${Number(low).toLocaleString()}</span>
              <div className="text-xs text-gray-500 mt-1">Entry Level</div>
            </div>
            <div className="text-center absolute" style={{ left: `${avgPosition}%`, transform: 'translateX(-50%)' }}>
              <span className="text-sm font-medium text-green-600 font-semibold">${Number(avg).toLocaleString()}</span>
              <div className="text-xs text-green-600 mt-1">Market Average</div>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">${Number(high).toLocaleString()}</span>
              <div className="text-xs text-gray-500 mt-1">Senior Level</div>
            </div>
          </div>




          {/* Custom Range Bar with Gradient */}
          <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner mt-4">
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
                  background: 'linear-gradient(to right, #F97316 0%, #10B981 50%, #3B82F6 100%)'
                }}
              />

              {/* Average marker line */}
              <div
                className="absolute top-0 h-full w-1.5 bg-green-500 shadow-lg"
                style={{ left: `${avgPosition}%` }}
              />

              {/* Average marker dot with enhanced visibility and hover tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="absolute top-1/2 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-xl transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-20 hover:scale-110 transition-transform duration-200"
                    style={{ left: `${avgPosition}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent
                  className="z-[9999] bg-green-600 text-white border-0 shadow-2xl px-4 py-2 text-sm font-bold"
                  side="top"
                  sideOffset={12}
                  align="center"
                >
                  <p className="text-white">${Number(avg).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>

              {/* Range indicators */}
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
          </div>

          {/* Enhanced labels below the chart */}
          <div className="flex justify-between mt-4 relative">
            <div className="text-center">
              <div className="w-1 h-5 bg-orange-400 mx-auto mb-2 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Entry Level</span>
              <div className="text-xs text-gray-500 mt-1">${Number(low).toLocaleString()}</div>
            </div>
            <div className="text-center absolute" style={{ left: `${avgPosition}%`, transform: 'translateX(-50%)' }}>
              <div className="w-1 h-5 bg-green-500 mx-auto mb-2 rounded-full"></div>
              <span className="text-xs font-medium text-green-600">Market Average</span>
              <div className="text-xs text-green-600 mt-1">${Number(avg).toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="w-1 h-5 bg-blue-400 mx-auto mb-2 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Senior Level</span>
              <div className="text-xs text-gray-500 mt-1">${Number(high).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs font-medium text-orange-700 mb-2">Range Spread</p>
            <p className="text-lg font-bold text-orange-900">
              ${(Number(high) - Number(low)).toLocaleString()}
            </p>
            <p className="text-xs text-orange-600 mt-1">Total range</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-medium text-green-700 mb-2">Average Position</p>
            <p className="text-lg font-bold text-green-900">
              {((Number(avg) - Number(low)) / (Number(high) - Number(low)) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-green-600 mt-1">Above minimum</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-700 mb-2">Growth Potential</p>
            <p className="text-lg font-bold text-blue-900">
              +{((Number(high) - Number(avg)) / Number(avg) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-blue-600 mt-1">Above average</p>
          </div>
        </div>
      </div>
    </div>
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 ">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Comprehensive Experience Analysis</h3>
        <p className="text-gray-600">Salary progression across experience levels and years of experience</p>
      </div>

      <div className="space-y-12">
        {/* Experience Levels Line Chart */}
        {experienceLevels.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Experience Level Salaries (Hourly)</h4>
            <p className="text-sm text-gray-600 mb-6">Hourly rate by experience level</p>
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
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-start">
              <div className="flex justify-center w-full">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-700">Hourly salary</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Years of Experience Line Chart */}
        {yearsExperience.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Years of Experience Salaries</h4>
            <p className="text-sm text-gray-600 mb-6">Annual salary progression by years of experience</p>
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
                    stroke="#06B6D4"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#06B6D4', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#06B6D4', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-start">
              <div className="flex justify-center w-full">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-sm text-gray-700">Annual salary</span>
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
        <div className="relative overflow-hidden p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Average Annual</p>
                <p className="text-3xl font-extrabold text-blue-900 tracking-tight">
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
                <p className="text-sm font-medium text-green-700">Average Hourly</p>
                <p className="text-3xl font-extrabold text-green-900 tracking-tight">
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
                <p className="text-xs font-medium text-purple-700">Gender Split</p>
                <p className="text-xl font-bold text-purple-900 tracking-tight">
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

      {/* Skills Breakdown */}
      {skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 ">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills & Proficiency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">{skill.name}</span>
                  <Badge variant="green" className="bg-green-100 text-green-800">
                    {skill.percentage}%
                  </Badge>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Annual Salary Information and Hourly Rate Information Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Annual Salary Details */}
        {isValidValue(record.avgAnnualSalary) && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Annual Salary Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Average Low Range</span>
                <span className="text-lg font-semibold text-red-600">
                  ${record.lowSalary ? Number(record.lowSalary).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Average High Range</span>
                <span className="text-lg font-semibold text-green-600">
                  ${record.highSalary ? Number(record.highSalary).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    ${record.avgAnnualSalary ? Number(record.avgAnnualSalary).toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Average Annual Salary</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hourly Rate Details */}
        {isValidValue(record.avgHourlySalary) && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Hourly Rate Information</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    ${record.avgHourlySalary ? Number(record.avgHourlySalary).toFixed(2) : 'N/A'}/hr
                  </div>
                  <div className="text-sm text-gray-600">Average Hourly Rate</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Average Low Hourly</span>
                <span className="text-lg font-semibold text-red-600">
                  ${record.hourlyLowValue ? Number(record.hourlyLowValue).toFixed(2) : 'N/A'}/hr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Average High Hourly</span>
                <span className="text-lg font-semibold text-green-600">
                  ${record.hourlyHighValue ? Number(record.hourlyHighValue).toFixed(2) : 'N/A'}/hr
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Compensation */}
      {(() => {
        // Check if there are any valid compensation types - modified to handle 0 values properly
        const hasValidBonus = record.bonusRangeMin != null && record.bonusRangeMax != null &&
          record.bonusRangeMin !== '#REF!' && record.bonusRangeMax !== '#REF!' &&
          record.bonusRangeMin !== '' && record.bonusRangeMax !== '';
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

            {/* Bonus Compensation Chart */}
            {hasValidBonus && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Bonus Compensation</h4>
                  <p className="text-sm text-gray-600">Performance-based bonus ranges and distribution</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bonus Range Bar Chart */}
                  <div className="lg:col-span-2">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Minimum', value: Number(record.bonusRangeMin) || 0, fill: '#F59E0B' },
                          { name: 'Average', value: ((Number(record.bonusRangeMin) || 0) + (Number(record.bonusRangeMax) || 0)) / 2, fill: '#10B981' },
                          { name: 'Maximum', value: Number(record.bonusRangeMax) || 0, fill: '#EF4444' }
                        ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value: number) => `$${value.toLocaleString()}`} />
                          <RechartsTooltip
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Bonus Amount']}
                            labelStyle={{ color: '#374151' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bonus Statistics */}
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-900">
                          ${(Number(record.bonusRangeMin) || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-yellow-600">Minimum Bonus</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-900">
                          ${(((Number(record.bonusRangeMin) || 0) + (Number(record.bonusRangeMax) || 0)) / 2).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">Average Bonus</div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-900">
                          ${(Number(record.bonusRangeMax) || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-red-600">Maximum Bonus</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Commission Compensation Chart */}
            {hasValidCommission && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Commission Structure</h4>
                  <p className="text-sm text-gray-600">Sales-based commission ranges and potential earnings</p>
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
                        <div className="text-lg font-bold text-green-900">
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
                              <div className="text-lg font-bold text-orange-900">
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
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Profit Sharing</h4>
                  <p className="text-sm text-gray-600">Company profit distribution and employee benefits</p>
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
                        <div className="text-lg font-bold text-green-900">
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
                              <div className="text-lg font-bold text-orange-900">
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
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Total Additional Compensation Potential</h4>
                      <p className="text-sm text-gray-600">Combined maximum earnings from all compensation sources</p>
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

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-900 mb-2">
                            ${totalMax.toLocaleString()}
                          </div>
                          <div className="text-lg text-blue-700 font-medium">Total Maximum Additional Compensation</div>
                          <div className="text-sm text-blue-600 mt-1">Combined from all sources</div>
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>

          {relatedOccupations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Related Occupations</h4>
              <div className="flex flex-wrap gap-2">
                {relatedOccupations.map((occ, index) => (
                  <Badge key={index} variant="blue" className="bg-blue-50 text-blue-700 border-blue-200">
                    {occ}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {relatedLocations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Related Locations</h4>
              <div className="flex flex-wrap gap-2">
                {relatedLocations.map((loc, index) => (
                  <Badge key={index} variant="green" className="bg-green-50 text-green-700 border-green-200">
                    <MapPin className="w-3 h-3 mr-1" />
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {relatedStates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Related States</h4>
              <div className="flex flex-wrap gap-2">
                {relatedStates.map((state, index) => (
                  <Badge key={index} variant="purple" className="bg-purple-50 text-purple-700 border-purple-200">
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
