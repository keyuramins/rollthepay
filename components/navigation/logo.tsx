import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <TrendingUp className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">RollThePay</span>
    </Link>
  );
}
