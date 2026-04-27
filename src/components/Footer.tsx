import { Phone, Mail, MapPin } from "lucide-react";

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="3.5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconYoutube = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A09", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="se-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <div
                className="font-display text-white tracking-widest"
                style={{ fontSize: "24px", letterSpacing: "0.15em" }}
              >
                SAN EDUARDO
              </div>
              <div
                className="font-body text-[#E07B10] font-semibold uppercase tracking-[0.3em]"
                style={{ fontSize: "9px" }}
              >
                DESIGN · DESDE 1964
              </div>
            </div>
            <p className="font-body text-white/35 text-sm leading-relaxed mb-6" style={{ fontWeight: 300 }}>
              Corralón de materiales de construcción en Temperley.
              Más de 60 años al servicio del GBA Sur.
            </p>
            <div className="flex gap-4">
              {[
                { icon: IconInstagram, href: "https://instagram.com/corralonsaneduardo", label: "Instagram" },
                { icon: IconFacebook, href: "https://facebook.com/corralonsaneduardo", label: "Facebook" },
                { icon: IconYoutube, href: "https://youtube.com/@corralonsaneduardo", label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-[#E07B10] border border-white/10 hover:border-[#E07B10]/30 transition-all"
                  style={{ borderRadius: "2px" }}
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="font-body text-xs text-white/30 uppercase tracking-widest mb-6">
              Navegación
            </div>
            <nav className="space-y-3">
              {[
                ["#rubros", "Rubros"],
                ["#marcas", "Marcas"],
                ["#nosotros", "Nosotros"],
                ["#zonas", "Zona de entrega"],
                ["#contacto", "Contacto"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="block font-body text-sm text-white/45 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <div className="font-body text-xs text-white/30 uppercase tracking-widest mb-6">
              Contacto directo
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={14} style={{ color: "#E07B10", marginTop: "3px", flexShrink: 0 }} />
                <span className="font-body text-sm text-white/45 leading-relaxed">
                  Dr. Carlos Collivadino 57
                  <br />
                  Temperley, Buenos Aires
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={14} style={{ color: "#E07B10", marginTop: "3px", flexShrink: 0 }} />
                <div className="font-body text-sm text-white/45">
                  4264-4848 / 4264-7638
                  <br />
                  4264-3889 / 4264-0194
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={14} style={{ color: "#E07B10", marginTop: "3px", flexShrink: 0 }} />
                <a
                  href="mailto:info@saneduardodesign.com.ar"
                  className="font-body text-sm text-white/45 hover:text-[#E07B10] transition-colors"
                >
                  info@saneduardodesign.com.ar
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/05 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/20">
            © {new Date().getFullYear()} San Eduardo Design. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-white/15 text-center">
            Diseñado por{" "}
            <a
              href="https://tododeia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              Tododeia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
