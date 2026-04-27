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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(13,74,114,0.96)" : "rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <div className="se-container">
        <nav
          className="flex items-center justify-between"
          style={{ height: scrolled ? "64px" : "72px", transition: "height 0.3s" }}
        >
          {/* Logo — siempre el color, sobre fondo blanco redondeado */}
          <a href="/" className="flex-shrink-0">
            <div
              className="flex items-center"
              style={{
                background: "#FFFFFF",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              <Image
                src="/images/logo-color.jpg"
                alt="San Eduardo Design — Corralón materiales de construcción Temperley GBA Sur"
                width={160}
                height={52}
                className="h-10 w-auto"
                priority
              />
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-sm font-medium text-white/85 hover:text-white transition-colors tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="#contacto"
              className="flex items-center gap-1.5 font-body font-bold text-sm px-5 py-2.5 text-white transition-all hover:opacity-90"
              style={{ background: "#C41E2A", borderRadius: "4px" }}
            >
              <Phone size={13} />
              Pedir presupuesto
            </a>
          </div>

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
          <div className="se-container py-5 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-body text-base font-medium text-white/75 hover:text-white transition-colors py-2.5 border-b border-white/10"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 font-body font-bold text-sm px-4 py-3.5 mt-2 text-white"
              style={{ background: "#C41E2A", borderRadius: "4px" }}
            >
              <Phone size={14} />
              Pedir presupuesto
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
