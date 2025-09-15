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
    <div className="bg-card rounded-lg shadow-md p-6 border">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-foreground">Period</th>
              <th className="text-right py-3 px-4 font-medium text-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b ${
                  row.highlight ? 'bg-primary/10' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-foreground">{row.period}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-bold ${
                    row.highlight ? 'text-primary' : 'text-foreground'
                  }`}>
                    {row.amount}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {row.description && (
                    <span className="text-sm text-muted-foreground">{row.description}</span>
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
