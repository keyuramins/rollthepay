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
    <section className="breadcrumbs-section">
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.name}>
              {index === breadcrumbs.length - 1 ? (
                <span className="breadcrumb-current">{breadcrumb.name}</span>
              ) : (
                <Link prefetch href={breadcrumb.href} className="breadcrumb-link">
                  {breadcrumb.name}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">&gt;</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
