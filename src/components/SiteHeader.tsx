"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/mission", label: "Mission & Vision" },
  { href: "/domaines", label: "Domaines d'intervention" },
  { href: "/campagnes", label: "Campagnes" },
  { href: "/impact", label: "Impact" },
  { href: "/contact", label: "Contact" },
];

export function BrandMark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="14" r="7" fill="#C4842A" />
      <path d="M4 34C7 24 13 19 20 19C27 19 33 24 36 34" stroke="#5C6B2F" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M11 34C13 27 16 24 20 24C24 24 27 27 29 34" stroke="#A64B2E" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site">
      <div className="nav-row">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <BrandMark />
          <span className="brand-text">
            <strong>Kwetu Ni Kwetu</strong>
            <span>Amour · Fraternité · Travail</span>
          </span>
        </Link>
        <button
          className="menu-btn"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
        <nav className={`links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
