import { Badge } from "@/components/ui/badge";

interface SalaryBreakdownTableProps {
  data: {
    period: string;
    amount: string;
    description?: string;
    highlight?: boolean;
  }[];
  title: string;
  subtitle?: string;
}

export function SalaryBreakdownTable({ data, title, subtitle }: SalaryBreakdownTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 ${
                  row.highlight ? 'bg-blue-50' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{row.period}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-bold ${
                    row.highlight ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {row.amount}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {row.description && (
                    <span className="text-sm text-gray-600">{row.description}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
