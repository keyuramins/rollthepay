import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SalaryCardProps {
  title: string;
  amount: string;
  variant?: 'low' | 'high' | 'average' | 'hourly';
}

export function SalaryCard({ title, amount, variant = 'average' }: SalaryCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'low':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'hourly':
        return 'bg-green-50 text-green-600 border-green-200';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getTextSize = () => {
    return variant === 'average' ? 'text-3xl' : 'text-lg';
  };

  return (
    <Card className={cn("p-4", getVariantStyles())}>
      <CardContent className="p-0">
        <div className="text-center">
          <div className={cn("font-bold", getTextSize())}>
            {amount}
          </div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
