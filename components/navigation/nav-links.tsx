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
            key={link.href}
            href={link.href}
            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
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
          key={link.href}
          href={link.href}
          className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}