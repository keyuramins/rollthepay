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
    <nav className="flex py-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.name}>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-muted-foreground">{breadcrumb.name}</span>
            ) : (
              <Link
                prefetch={true}
                href={breadcrumb.href}
                className="text-chart-2 hover:text-prrimary hover:underline font-medium"
              >
                {breadcrumb.name}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="ml-4 text-muted-foreground/80">→</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
