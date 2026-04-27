"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const ZONAS = [
  "Temperley", "Lomas de Zamora", "Banfield", "Adrogué",
  "Lanús", "Quilmes", "Almirante Brown", "Bernal",
  "Wilde", "Avellaneda", "Berazategui", "Florencio Varela",
  "Monte Grande", "San Justo", "La Plata", "Ezeiza",
];

export default function Zonas() {
  return (
    <section id="zonas" className="py-24" style={{ background: "#111110" }}>
      <div className="se-container">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#E07B10]" />
              <span
                className="font-body text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: "#E07B10" }}
              >
                Dónde llegamos
              </span>
            </div>
            <h2
              className="font-display text-white leading-none mb-8"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.02em",
              }}
            >
              ZONA DE
              <br />
              ENTREGA.
            </h2>
            <p
              className="font-body text-white/50 text-lg leading-relaxed mb-8"
              style={{ fontWeight: 300 }}
            >
              Hacemos entregas en todo el GBA Sur con fletes propios.
              Coordinamos el horario con vos. Para obras grandes,
              consultá condiciones especiales.
            </p>

            <div
              className="p-6"
              style={{
                background: "rgba(224,123,16,0.1)",
                border: "1px solid rgba(224,123,16,0.2)",
                borderRadius: "2px",
              }}
            >
              <div className="flex items-start gap-4">
                <MapPin size={20} style={{ color: "#E07B10", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div className="font-body font-semibold text-white mb-1">
                    Local principal
                  </div>
                  <div className="font-body text-white/60 text-sm">
                    Dr. Carlos Collivadino 57, Temperley
                    <br />
                    Buenos Aires, Argentina
                  </div>
                  <div className="font-body text-white/40 text-xs mt-2">
                    Lun–Vie 7:30–18hs · Sáb 7:30–13hs
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=San+Eduardo+Design+Temperley"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 font-body text-sm font-semibold text-[#E07B10] hover:text-[#F59332] transition-colors"
            >
              Ver en Google Maps →
            </a>
          </motion.div>

          {/* Right: zona pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {ZONAS.map((zona, i) => (
                <motion.div
                  key={zona}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#E07B10" }}
                  />
                  <span className="font-body text-sm text-white/70">
                    {zona}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="font-body text-white/30 text-xs mt-6 text-center">
              ¿Tu zona no está en la lista? Consultanos — llegamos a más lugares.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
