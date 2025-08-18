import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, Target } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

function MetricCard({ title, value, subtitle, icon, trend, color = "blue" }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200 text-green-800';
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'red': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/50">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
          </div>
        </div>
        {getTrendIcon()}
      </div>
    </div>
  );
}

interface MetricsGridProps {
  metrics: MetricCardProps[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
