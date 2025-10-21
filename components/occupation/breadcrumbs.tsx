import { removeAveragePrefix } from "@/lib/utils/remove-average-cleaner";
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
    <nav 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" 
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      <ol className="flex flex-wrap gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li 
              key={breadcrumb.name} 
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={(index + 1).toString()} />
              {isLast ? (
                <span 
                  className="text-muted-foreground text-sm sm:text-base" 
                  aria-current="page"
                  itemProp="name"
                >
                  {removeAveragePrefix(breadcrumb.name)}
                </span>
              ) : (
                <Link 
                  href={breadcrumb.href} 
                  className="text-sm sm:text-base text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  itemProp="item"
                >
                  <span itemProp="name">{breadcrumb.name}</span>
                </Link>
              )}
              {!isLast && (
                <span 
                  className="ml-2 text-muted-foreground/80 text-xs sm:text-sm" 
                  aria-hidden="true"
                  role="presentation"
                >
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
