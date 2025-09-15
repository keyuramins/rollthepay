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
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-destructive" />;
    return null;
  };

  const getColorClasses = () => {
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200 text-green-600';
      case 'blue': return 'bg-primary/10 border-primary/20 text-primary';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-600';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-600';
      case 'red': return 'bg-destructive/10 border-destructive/20 text-destructive';
      default: return 'bg-muted border text-foreground';
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getColorClasses()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-background/50">
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
