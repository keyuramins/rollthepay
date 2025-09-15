import Link from "next/link";

interface NavLinksProps {
  mobile?: boolean;
}

export function NavLinks({ mobile = false }: NavLinksProps) {
  const links = [
    { href: "/about", label: "About" },
  ];

  if (mobile) {
    return (
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            prefetch={true}
            key={link.href}
            href={link.href}
            className="block text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 rounded-md text-base font-medium cursor-pointer"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex space-x-8">
      {links.map((link) => (
        <Link
          prefetch={true}
          key={link.href}
          href={link.href}
          className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium cursor-pointer"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}