"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { continents } from "@/app/constants/continents";
import { deslugify, slugify } from "@/lib/format/slug";

const COUNTRY_SLUG_SET = new Set(
  continents.flatMap((continent) => continent.countries.map((country) => country.slug))
);

export function TailoredNotFound() {
  const pathname = usePathname() ?? "/";
  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  const [maybeCountry, maybeState, maybeThird, maybeFourth] = segments;
  const country = maybeCountry;
  const state = maybeState;
  const hasLocation = segments.length === 4;
  const location = hasLocation ? maybeThird : undefined;
  const slug = hasLocation ? maybeFourth : maybeThird;
  const isKnownCountry = country ? COUNTRY_SLUG_SET.has(country.toLowerCase()) : false;

  if (!isKnownCountry) {
    return <Generic404 />;
  }

  const countryDisplay = formatCountrySegment(country);
  const stateDisplay = formatSegment(state);
  const locationDisplay = formatSegment(location);
  const slugDisplay = formatSegment(slug);

  const hierarchyLinks = buildHierarchyLinks({
    country,
    state,
    location,
    countryDisplay,
    stateDisplay,
    locationDisplay,
  });

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col gap-4 justify-center flex-wrap">
        {hierarchyLinks.map((entry) => (
          <Button key={entry.href} asChild size="lg">
            <Link href={entry.href}>{entry.label}</Link>
          </Button>
        ))}
      </div>

      <HiddenBreadcrumbs
        country={countryDisplay}
        state={stateDisplay}
        location={locationDisplay}
        slug={slugDisplay}
        pathname={pathname}
      />
    </div>
  );
}

type HierarchyContext = {
  country?: string;
  state?: string;
  location?: string;
  countryDisplay: string;
  stateDisplay: string;
  locationDisplay: string;
};

function buildHierarchyLinks({
  country,
  state,
  location,
  countryDisplay,
  stateDisplay,
  locationDisplay,
}: HierarchyContext) {
  const links: Array<{ href: string; label: string }> = [];

  if (country && state && location) {
    links.push({
      href: `/${country}/${state}/${location}`,
      label: locationLabel(locationDisplay, stateDisplay),
    });
  }

  if (country && state) {
    links.push({
      href: `/${country}/${state}`,
      label: stateLabel(stateDisplay),
    });
  }

  if (country) {
    links.push({
      href: `/${country}`,
      label: countryLabel(countryDisplay),
    });
  }

  if (links.length === 0) {
    links.push({ href: '/', label: 'Browse all salaries' });
  }

  return links;
}

function locationLabel(locationDisplay: string, stateDisplay: string) {
  if (locationDisplay) {
    const context = stateDisplay ? `${locationDisplay}, ${stateDisplay}` : locationDisplay;
    return `Explore salary data for ${context}`;
  }
  if (stateDisplay) {
    return `Explore salary data for this location in ${stateDisplay}`;
  }
  return "Explore salary data for this location";
}

function stateLabel(stateDisplay: string) {
  return stateDisplay
    ? `Explore salary data for ${stateDisplay}`
    : "Explore salary data for this state";
}

function countryLabel(countryDisplay: string) {
  return countryDisplay
    ? `Browse salary data for ${countryDisplay}`
    : "Browse salary data by country";
}

function formatSegment(value?: string) {
  if (!value) return "";

  const cleaned = stripSalarySuffix(value);
  const display = deslugify(cleaned) || deslugify(cleaned.toLowerCase());
  return display || cleaned.split("-").map(capitalize).join(" ");
}

function formatCountrySegment(value?: string) {
  if (!value) return "";

  const cleaned = stripSalarySuffix(value);
  const display = deslugify(cleaned) || deslugify(cleaned.toLowerCase());
  if (display) {
    return display;
  }

  return cleaned
    .split("-")
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
}

function stripSalarySuffix(value: string) {
  return value
    .replace(/(-)?salary-data$/i, "")
    .replace(/(-)?salary$/i, "")
    .replace(/(-)?salaries$/i, "");
}

function capitalize(segment: string) {
  if (!segment) return "";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

type BreadcrumbProps = {
  country: string;
  state: string;
  location: string;
  slug: string;
  pathname: string;
};

function HiddenBreadcrumbs({ country, state, location, slug, pathname }: BreadcrumbProps) {
  // The breadcrumbs are created for potential analytics/logging needs but remain hidden.
  const breadcrumbs = [
    { label: "Home", href: "/" },
    country ? { label: country, href: `/${safeSlugify(country)}` } : null,
    state ? { label: state, href: `/${safeSlugify(country)}/${safeSlugify(state)}` } : null,
    location
      ? {
          label: location,
          href: `/${safeSlugify(country)}/${safeSlugify(state)}/${safeSlugify(location)}`,
        }
      : null,
    slug ? { label: slug, href: pathname } : null,
  ].filter(Boolean);

  void breadcrumbs;

  return null;
}

function safeSlugify(value: string) {
  if (!value) return "";
  return slugify(value);
}

function Generic404() {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-3">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or you entered the wrong URL.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="default" size="lg">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="default" size="lg">
          <Link href="/about">About Us</Link>
        </Button>
      </div>

      <div className="pt-6 border-t border-gray-200">
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
  );
}

