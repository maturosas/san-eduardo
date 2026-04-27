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
    <section id="zonas" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="se-container">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
              <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>
                Dónde llegamos
              </span>
            </div>
            <h2 className="font-display leading-none mb-6" style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
              ZONA DE<br />ENTREGA.
            </h2>
            <p className="font-body text-[#5A6A7E] text-lg leading-relaxed mb-8" style={{ fontWeight: 300 }}>
              Hacemos entregas en todo el GBA Sur con fletes propios.
              Coordinamos horario con vos. Para obras grandes, consultá condiciones especiales.
            </p>

            <div
              className="p-6 mb-6"
              style={{
                background: "#F4F8FC",
                border: "1px solid rgba(13,74,114,0.12)",
                borderRadius: "4px",
                borderLeft: "4px solid #0D4A72",
              }}
            >
              <div className="flex items-start gap-4">
                <MapPin size={18} style={{ color: "#0D4A72", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div className="font-body font-semibold text-[#0D4A72] mb-1">Local principal</div>
                  <div className="font-body text-[#5A6A7E] text-sm">
                    Dr. Carlos Collivadino 57, Temperley<br />Buenos Aires, Argentina
                  </div>
                  <div className="font-body text-[#5A6A7E]/60 text-xs mt-2">
                    Lun–Vie 7:30–18hs · Sáb 7:30–13hs
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=San+Eduardo+Design+Temperley"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm font-semibold transition-colors"
              style={{ color: "#C41E2A" }}
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
            <div className="grid grid-cols-2 gap-3">
              {ZONAS.map((zona, i) => (
                <motion.div
                  key={zona}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    background: "#F4F8FC",
                    border: "1px solid rgba(13,74,114,0.1)",
                    borderRadius: "3px",
                  }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#0D4A72" }} />
                  <span className="font-body text-sm" style={{ color: "#0D2A3D" }}>{zona}</span>
                </motion.div>
              ))}
            </div>
            <p className="font-body text-[#5A6A7E]/60 text-xs mt-5 text-center">
              ¿Tu zona no está? Consultanos — llegamos a más lugares.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
