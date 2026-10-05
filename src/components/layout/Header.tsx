"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent } from "@/content/ContentProvider";
import { safeHref } from "@/content/normalize";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const { site } = useContent();
  const navLinks = site.nav.filter((l) => l.label && l.href);
  const cta = site.headerCta;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_6px_24px_-12px_rgba(11,42,122,0.25)]" : ""
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Logo name={site.name} />

        <nav aria-label="Menu chính" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((l) => (
              <li key={l.label + l.href}>
                <Link
                  href={safeHref(l.href)}
                  className={`relative py-2 text-[15px] font-medium transition-colors hover:text-brand-600 ${
                    isActive(l.href)
                      ? "text-brand-600 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-600"
                      : "text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {cta.label && cta.href && (
            <div className="hidden sm:block">
              <Button href={safeHref(cta.href)} size="sm" arrow>
                {cta.label}
              </Button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full text-brand-900 hover:bg-brand-50 lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Menu di động" className="border-t border-brand-100 bg-white lg:hidden">
          <ul className="container-x flex flex-col py-3">
            {navLinks.map((l) => (
              <li key={l.label + l.href}>
                <Link
                  href={safeHref(l.href)}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-3 font-medium ${
                    isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-brand-50"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {cta.label && cta.href && (
              <li className="mt-2 px-3 pb-2 sm:hidden">
                <Button href={safeHref(cta.href)} arrow className="w-full">
                  {cta.label}
                </Button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
