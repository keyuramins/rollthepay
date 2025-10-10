import Link from "next/link";

interface Breadcrumb {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-2">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={breadcrumb.name} className="flex items-center">
              {isLast ? (
                <span className="text-muted-foreground text-sm sm:text-base" aria-current="page">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link prefetch href={breadcrumb.href} className="text-sm sm:text-base text-primary hover:underline font-medium">
                  {breadcrumb.name}
                </Link>
              )}
              {!isLast && (
                <span className="ml-2 text-muted-foreground/80 text-xs sm:text-sm" aria-hidden="true">&gt;</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
