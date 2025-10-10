import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'yellow' | 'green' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variantClasses = {
    default: "bg-muted text-foreground",
    yellow: "bg-secondary/30 text-primary",
    green: "bg-green-100 text-primary",
    secondary: "bg-secondary text-secondary-foreground"
  };
  
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}
