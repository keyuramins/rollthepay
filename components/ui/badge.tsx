import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'yellow' | 'green' | 'secondary';
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
