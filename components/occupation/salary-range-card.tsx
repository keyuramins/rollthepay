import { SalaryCard } from "./salary-card";

interface SalaryRangeCardProps {
  lowSalary?: string;
  highSalary?: string;
  avgSalary?: string;
}

export function SalaryRangeCard({ lowSalary, highSalary, avgSalary }: SalaryRangeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Annual Salary Information</h2>
      
      {(lowSalary || highSalary) && (
        <div className="space-y-4">
          {lowSalary && (
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Low Range</span>
              <span className="text-lg font-bold text-red-600">
                {lowSalary}
              </span>
            </div>
          )}
          {highSalary && (
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">High Range</span>
              <span className="text-lg font-bold text-green-600">
                {highSalary}
              </span>
            </div>
          )}
        </div>
      )}
      
      {avgSalary && (
        <div className="mt-6">
          <SalaryCard title="Average Annual Salary" amount={avgSalary} variant="average" />
        </div>
      )}
    </div>
  );
}
