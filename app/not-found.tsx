import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Page Not Found - RollThePay',
  description: 'The page you are looking for could not be found. Explore salary data by country, state, and occupation.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 text-center shadow-xl">
        <div className="mb-8">
          <h1>404</h1>
          <h2>
            Page Not Found
          </h2>
          <p>
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/">
                Go Home
              </Link>
            </Button>
            <Button asChild variant="default" size="lg">
              <Link href="/about">
                About Us
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for salary data? Try these popular destinations:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button asChild variant="secondary" size="sm">
                <Link href="/australia">Australia</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/india">India</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/switzerland">Switzerland</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
