// app/not-found.tsx
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { TailoredNotFound } from './not-found/tailored-not-found';

export const metadata = {
  title: 'Page Not Found - RollThePay',
  description: 'The page you are looking for could not be found. Explore salary data by country, state, and occupation.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <Card className="max-w-3xl w-full p-8 shadow-xl space-y-6 text-center">
        <div className="space-y-3">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <Suspense fallback={<SuggestionsFallback />}> 
          <TailoredNotFound />
        </Suspense>
        <div className="space-y-3">
          <Button asChild variant="secondary" size="lg">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SuggestionsFallback() {
  return (
    <div className="space-y-6 text-center">
      <p className="text-sm text-gray-500">Preparing suggestions…</p>
      <div className="flex justify-center gap-3">
        <Button asChild variant="default" size="sm">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/about">About Us</Link>
        </Button>
      </div>
    </div>
  );
}
