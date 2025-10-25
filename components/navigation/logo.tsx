// components/navigation/logo.tsx
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 hover:text-secondary text-card">
      <TrendingUp className="h-8 w-8" />
      <span className="text-xl font-bold">RollThePay</span>
    </Link>
  );
}
