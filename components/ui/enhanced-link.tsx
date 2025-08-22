'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, ReactNode } from 'react';
import { prefetchRoute } from '@/lib/prefetch';

interface EnhancedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  prefetchOnHover?: boolean;
  prefetchOnMount?: boolean;
  prefetchOnFocus?: boolean;
  prefetchDelay?: number;
  onClick?: () => void;
  [key: string]: any;
}

export function EnhancedLink({
  href,
  children,
  className = '',
  prefetch = true,
  prefetchOnHover = true,
  prefetchOnMount = true,
  prefetchOnFocus = true,
  prefetchDelay = 100,
  onClick,
  ...props
}: EnhancedLinkProps) {
  const router = useRouter();
  
  // Aggressive prefetch on mount
  useEffect(() => {
    if (prefetch && prefetchOnMount && href) {
      const timer = setTimeout(() => {
        prefetchRoute(href).catch(console.error);
      }, prefetchDelay);
      
      return () => clearTimeout(timer);
    }
  }, [href, prefetch, prefetchOnMount, prefetchDelay]);

  // Prefetch on hover
  const handleMouseEnter = useCallback(() => {
    if (prefetch && prefetchOnHover && href) {
      prefetchRoute(href).catch(console.error);
    }
  }, [href, prefetch, prefetchOnHover]);

  // Prefetch on focus
  const handleFocus = useCallback(() => {
    if (prefetch && prefetchOnFocus && href) {
      prefetchRoute(href).catch(console.error);
    }
  }, [href, prefetch, prefetchOnFocus]);

  // Enhanced click handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    
    // Prefetch related routes for instant navigation
    if (prefetch && href) {
      // Prefetch parent routes
      const segments = href.split('/').filter(Boolean);
      if (segments.length > 1) {
        const parentRoute = `/${segments.slice(0, -1).join('/')}`;
        prefetchRoute(parentRoute).catch(console.error);
      }
      
      // Prefetch sibling routes (same level)
      if (segments.length >= 2) {
        const baseRoute = `/${segments.slice(0, -1).join('/')}`;
        // This could be enhanced to prefetch actual sibling routes
        prefetchRoute(baseRoute).catch(console.error);
      }
    }
  }, [href, prefetch, onClick]);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onClick={handleClick}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
}

// Specialized link components for different use cases
export function InstantLink({ href, children, ...props }: Omit<EnhancedLinkProps, 'prefetch' | 'prefetchOnHover' | 'prefetchOnMount' | 'prefetchOnFocus'>) {
  return (
    <EnhancedLink
      href={href}
      prefetch={true}
      prefetchOnHover={true}
      prefetchOnMount={true}
      prefetchOnFocus={true}
      prefetchDelay={0}
      {...props}
    >
      {children}
    </EnhancedLink>
  );
}

export function LazyLink({ href, children, ...props }: Omit<EnhancedLinkProps, 'prefetch' | 'prefetchOnHover' | 'prefetchOnMount' | 'prefetchOnFocus'>) {
  return (
    <EnhancedLink
      href={href}
      prefetch={false}
      prefetchOnHover={false}
      prefetchOnMount={false}
      prefetchOnFocus={false}
      {...props}
    >
      {children}
    </EnhancedLink>
  );
}

export function HoverPrefetchLink({ href, children, ...props }: Omit<EnhancedLinkProps, 'prefetch' | 'prefetchOnHover' | 'prefetchOnMount' | 'prefetchOnFocus'>) {
  return (
    <EnhancedLink
      href={href}
      prefetch={true}
      prefetchOnHover={true}
      prefetchOnMount={false}
      prefetchOnFocus={false}
      {...props}
    >
      {children}
    </EnhancedLink>
  );
}
