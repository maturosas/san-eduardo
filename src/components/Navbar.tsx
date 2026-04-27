"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(13,74,114,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(13,74,114,0.25)" : "none",
      }}
    >
      <div className="se-container">
        <nav className="flex items-center justify-between h-18 md:h-20" style={{ height: scrolled ? "68px" : "80px", transition: "height 0.3s" }}>
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <Image
              src="/images/logo-white.png"
              alt="San Eduardo Design"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
              style={{
                filter: scrolled ? "none" : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
              }}
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm font-medium text-white/80 hover:text-white transition-colors tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Phone CTA */}
          <a
            href="tel:+541142644848"
            className="hidden md:flex items-center gap-2 font-body font-semibold text-sm px-5 py-2.5 text-white transition-all"
            style={{
              background: "#C41E2A",
              borderRadius: "3px",
            }}
          >
            <Phone size={13} />
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
        <div style={{ background: "rgba(13,74,114,0.98)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="se-container py-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-body text-base font-medium text-white/75 hover:text-white transition-colors py-2 border-b border-white/10"
              >
                {l.label}
              </a>
            ))}
            <a
              href="tel:+541142644848"
              className="flex items-center gap-2 font-body font-semibold text-sm px-4 py-3 mt-2 justify-center text-white"
              style={{ background: "#C41E2A", borderRadius: "3px" }}
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
