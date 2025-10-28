// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils/cn"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("card", className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("card-header", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="card-title" className={cn("card-title", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("card-description", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("card-action", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("card-content", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("card-footer", className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }