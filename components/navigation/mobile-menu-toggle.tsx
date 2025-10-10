'use client';
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { continents } from "@/app/constants/continents";
import Link from "next/link";
import { gsap } from "gsap";

export function MobileMenuToggle() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const continentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      // Open animation
      gsap.fromTo(
        menuRef.current,
        { y: "-100%", opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );

      if (continentsRef.current) {
        const continentBlocks = continentsRef.current.children;
        gsap.fromTo(
          continentBlocks,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.35,
            ease: "power3.out",
            delay: 0.15,
          }
        );
      }
    } else {
      // Close animation
      gsap.to(menuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);
  
  return (
    <>
    <div className="fixed top-4 right-4 z-[60] lg:hidden">
      <Button
        variant="mobilertp"
        size="rtp"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full z-50 bg-primary shadow-xl max-h-screen overflow-y-auto lg:hidden"
      >
        <div ref={continentsRef} className="px-4 pt-24 pb-8 space-y-6">
          {continents.map((continent) => (
            <div key={continent.code} className="space-y-1">
              <div className="px-3 py-2 text-sm font-semibold text-foreground bg-muted rounded-md">
                {continent.name}
              </div>
              {continent.countries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/${country.slug}`}
                  className="block px-6 py-2 text-sm text-card hover:bg-secondary hover:text-primary hover:font-semibold transition-transform duration-150 transform hover:scale-105 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {country.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
