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
              <span className="text-gray-500">{breadcrumb.name}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {breadcrumb.name}
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="ml-4 text-gray-400">→</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
