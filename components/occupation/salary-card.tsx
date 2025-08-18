interface SalaryCardProps {
  title: string;
  amount: string;
  variant?: 'low' | 'high' | 'average' | 'hourly';
}

export function SalaryCard({ title, amount, variant = 'average' }: SalaryCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'low':
        return 'bg-gray-50 text-red-600';
      case 'high':
        return 'bg-gray-50 text-green-600';
      case 'hourly':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  const getTextSize = () => {
    return variant === 'average' ? 'text-3xl' : 'text-lg';
  };

  return (
    <div className={`p-4 rounded-lg ${getVariantStyles()}`}>
      <div className="text-center">
        <div className={`font-bold ${getTextSize()}`}>
          {amount}
        </div>
        <div className="text-sm opacity-80">{title}</div>
      </div>
    </div>
  );
}
