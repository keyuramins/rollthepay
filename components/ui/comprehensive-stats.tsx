"use client";

import { Badge } from "@/components/ui/badge";
import { PercentilesChart } from "@/components/ui/percentiles-chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
        
        {/* Male segment - Bright Blue */}
        {male > 0 && (
          <path
            d={describeArc(25, 25, radius, 0, (male / 100) * 360)}
            fill="#2563EB"
            stroke="none"
          />
        )}
        
        {/* Female segment - Bright Orange */}
        {female > 0 && (
          <path
            d={describeArc(25, 25, radius, (male / 100) * 360, 360)}
            fill="#EA580C"
            stroke="none"
          />
        )}
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

// Enhanced Horizontal Salary Range Bar Component
function SalaryRangeBar({ low, avg, high }: { low: number; avg: number; high: number }) {
  if (!low || !high || !avg) return null;
  
  const totalRange = high - low;
  const avgPosition = ((avg - low) / totalRange) * 100;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary Range</h3>
      <div className="space-y-6">
        {/* Enhanced Horizontal Bar */}
        <div className="relative">
          {/* Value labels above the bar */}
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">${low.toLocaleString()}</span>
            <span className="text-sm font-medium text-green-600">${avg.toLocaleString()}</span>
            <span className="text-sm font-medium text-gray-700">${high.toLocaleString()}</span>
          </div>
          
          {/* Main bar container */}
          <div className="relative h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            {/* Low to Average Range */}
            <div 
              className="absolute h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-l-full shadow-sm"
              style={{ width: `${avgPosition}%` }}
            />
            {/* Average to High Range */}
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-r-full shadow-sm"
              style={{ left: `${avgPosition}%`, width: `${100 - avgPosition}%` }}
            />
            
            {/* Average Line with enhanced styling */}
            <div 
              className="absolute top-0 h-full w-1 bg-green-500 shadow-lg"
              style={{ left: `${avgPosition}%` }}
            />
            
            {/* Average marker dot */}
            <div 
              className="absolute top-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${avgPosition}%` }}
            />
          </div>
          
          {/* Enhanced labels below the bar */}
          <div className="flex justify-between mt-3">
            <div className="text-center">
              <div className="w-0.5 h-4 bg-gray-300 mx-auto mb-1"></div>
              <span className="text-xs font-medium text-gray-600">Low</span>
            </div>
            <div className="text-center">
              <div className="w-0.5 h-4 bg-green-500 mx-auto mb-1"></div>
              <span className="text-xs font-medium text-green-600">Average</span>
            </div>
            <div className="text-center">
              <div className="w-0.5 h-4 bg-gray-300 mx-auto mb-1"></div>
              <span className="text-xs font-medium text-gray-600">High</span>
            </div>
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
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Comprehensive Experience Analysis</h3>
        <p className="text-gray-600 text-center">Salary progression across experience levels and years of experience</p>
      </div>

      <div className="space-y-12">
        {/* Experience Levels Line Chart */}
        {experienceLevels.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">Experience Level Salaries</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={experienceLevels} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
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
          </div>
        )}

        {/* Years of Experience Line Chart */}
        {yearsExperience.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">Years of Experience Salaries</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearsExperience} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
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
          </div>
        )}
      </div>

      {/* Combined Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-6">
          {experienceLevels.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">Experience Levels</span>
            </div>
          )}
          {yearsExperience.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
              <span className="text-sm font-medium text-gray-700">Years of Experience</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ComprehensiveStats({ record, country }: ComprehensiveStatsProps) {
  // Helper function to check if value exists and is not #REF! or invalid
  const isValidValue = (value: any) => {
    if (!value || value === '#REF!' || value === '' || value === '0' || value === '00') return false;
    const numValue = Number(value);
    return !isNaN(numValue) && numValue > 0;
  };

  // Calculate salary percentiles
  const percentiles = [
    { label: '10th Percentile', value: record['10P'], color: 'red' },
    { label: '25th Percentile', value: record['25P'], color: 'orange' },
    { label: '50th Percentile', value: record['50P'], color: 'yellow' },
    { label: '75th Percentile', value: record['75P'], color: 'blue' },
    { label: '90th Percentile', value: record['90P'], color: 'green' },
  ].filter(p => isValidValue(p.value));

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
                <p className="text-2xl md:text-3xl font-extrabold text-purple-900 tracking-tight">
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
        low={record.lowSalary}
        avg={record.avgAnnualSalary}
        high={record.highSalary}
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

      {/* Additional Compensation */}
      {(() => {
        // Check if there are any valid compensation types
        const hasValidBonus = isValidValue(record.bonusRangeMin) && isValidValue(record.bonusRangeMax);
        const hasValidProfitSharing = isValidValue(record.profitSharingMin) && isValidValue(record.profitSharingMax);
        const hasValidCommission = isValidValue(record.commissionMin) && isValidValue(record.commissionMax);
        
        // Only render if there's at least one valid compensation type
        if (!hasValidBonus && !hasValidProfitSharing && !hasValidCommission) {
          return null;
        }
        
        return (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 ">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Additional Compensation</h3>
              <p className="text-sm text-gray-600">Beyond base salary - bonuses, profit sharing, and commissions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasValidBonus && (
                <div className="group relative overflow-hidden p-6 rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Background decoration */}
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-200/20 blur-xl group-hover:bg-yellow-200/30 transition-all duration-300" />
                  
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 rounded-xl bg-yellow-500 text-white shadow-lg">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Bonus Range</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-600">Minimum</span>
                        <span className="text-sm font-medium text-yellow-700">${Number(record.bonusRangeMin).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-600">Maximum</span>
                        <span className="text-sm font-medium text-yellow-700">${Number(record.bonusRangeMax).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-yellow-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-yellow-900">Total Range</span>
                          <span className="text-lg font-bold text-yellow-900">
                            ${Number(record.bonusRangeMin).toLocaleString()} - ${Number(record.bonusRangeMax).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {hasValidProfitSharing && (
                <div className="group relative overflow-hidden p-6 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Background decoration */}
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-200/20 blur-xl group-hover:bg-indigo-200/30 transition-all duration-300" />
                  
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 rounded-xl bg-indigo-500 text-white shadow-lg">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Profit Sharing</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-indigo-600">Minimum</span>
                        <span className="text-sm font-medium text-indigo-700">${Number(record.profitSharingMin).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-indigo-600">Maximum</span>
                        <span className="text-sm font-medium text-indigo-700">${Number(record.profitSharingMax).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-indigo-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-indigo-900">Total Range</span>
                          <span className="text-lg font-bold text-indigo-900">
                            ${Number(record.profitSharingMin).toLocaleString()} - ${Number(record.profitSharingMax).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {hasValidCommission && (
                <div className="group relative overflow-hidden p-6 rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-pink-50 shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Background decoration */}
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-200/20 blur-xl group-hover:bg-pink-200/30 transition-all duration-300" />
                  
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 rounded-xl bg-pink-500 text-white shadow-lg">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-pink-700 uppercase tracking-wide">Commission</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-pink-600">Minimum</span>
                        <span className="text-sm font-medium text-pink-700">${Number(record.commissionMin).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-pink-600">Maximum</span>
                        <span className="text-sm font-medium text-pink-700">${Number(record.commissionMax).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-pink-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-pink-900">Total Range</span>
                          <span className="text-lg font-bold text-pink-900">
                            ${Number(record.commissionMin).toLocaleString()} - ${Number(record.commissionMax).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Summary Section - Only show if there are valid compensation types */}
            {(() => {
              const validCompensations = [hasValidBonus, hasValidProfitSharing, hasValidCommission].filter(Boolean);
              
              if (validCompensations.length > 0) {
                const totalMax = (
                  (hasValidBonus ? Number(record.bonusRangeMax) : 0) + 
                  (hasValidProfitSharing ? Number(record.profitSharingMax) : 0) + 
                  (hasValidCommission ? Number(record.commissionMax) : 0)
                );
                
                return (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Total Additional Compensation Potential</h4>
                          <p className="text-xs text-gray-600">Combined maximum from all sources</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-900">
                            ${totalMax.toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">Maximum Total</div>
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
