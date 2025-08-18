import { SalaryCard } from "./salary-card";

interface HourlyRateCardProps {
  avgHourlyRate?: string;
  lowHourlyRate?: string;
  highHourlyRate?: string;
}

export function HourlyRateCard({ avgHourlyRate, lowHourlyRate, highHourlyRate }: HourlyRateCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hourly Rate Information</h2>
      
      {avgHourlyRate && (
        <div className="mb-4">
          <SalaryCard title="Average Hourly Rate" amount={avgHourlyRate} variant="hourly" />
        </div>
      )}
      
      {(lowHourlyRate || highHourlyRate) && (
        <div className="space-y-3">
          {lowHourlyRate && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Low Hourly</span>
              <span className="font-medium text-red-600">
                {lowHourlyRate}
              </span>
            </div>
          )}
          {highHourlyRate && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">High Hourly</span>
              <span className="font-medium text-green-600">
                {highHourlyRate}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
