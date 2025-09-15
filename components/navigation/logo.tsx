import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Logo() {
  return (
    <Link prefetch={true} href="/" className="flex items-center space-x-2">
      <TrendingUp className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold text-foreground">RollThePay</span>
    </Link>
  );
}
