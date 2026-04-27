"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "#rubros", label: "Rubros" },
  { href: "#marcas", label: "Marcas" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#zonas", label: "Zona de entrega" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#111110] shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="se-container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span
              className="font-display text-white tracking-widest"
              style={{ fontSize: "22px", letterSpacing: "0.15em" }}
            >
              SAN EDUARDO
            </span>
            <span
              className="font-body text-[#E07B10] font-semibold uppercase tracking-[0.3em]"
              style={{ fontSize: "9px" }}
            >
              DESIGN · DESDE 1964
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Phone CTA */}
          <a
            href="tel:+541142644848"
            className="hidden md:flex items-center gap-2 bg-[#E07B10] hover:bg-[#F59332] text-white font-semibold text-sm px-4 py-2 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            <Phone size={14} />
            4264-4848
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111110] border-t border-white/10">
          <div className="se-container py-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-body text-base font-medium text-white/70 hover:text-[#E07B10] transition-colors py-2 border-b border-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="tel:+541142644848"
              className="flex items-center gap-2 bg-[#E07B10] text-white font-semibold text-sm px-4 py-3 mt-2 justify-center"
              style={{ borderRadius: "2px" }}
            >
              <Phone size={14} />
              Llamar: 4264-4848
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
