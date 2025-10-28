//components/ui/button.tsx
import { cn } from "@/lib/utils/cn"
import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "rtp" | "mobilertp"
  size?: "default" | "sm" | "lg" | "icon" | "rtp"
  asChild?: boolean
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? "span" : "button"

  const variants = {
    default: "bg-primary text-white shadow-xs hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
    rtp: "text-card hover:bg-secondary hover:text-secondary-foreground",
    mobilertp: "text-primary bg-secondary hover:bg-secondary/80",
  }

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md gap-1.5 px-3",
    lg: "h-10 rounded-md px-6",
    icon: "size-9",
    rtp: "h-8 rounded-md gap-1 px-2",
  }

  return (
    <Comp
      data-slot="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
