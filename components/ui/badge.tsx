import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'purple' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const classes = `badge badge--${variant} badge--${size} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}
