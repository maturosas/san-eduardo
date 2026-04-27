"use client";

import { motion } from "framer-motion";

const MARCAS = [
  "Roca", "Saint-Gobain", "Rheem", "Ferrum",
  "Daccord", "Lipa", "Murvi", "Novoplack",
  "Loma Negra", "CEFAS", "Weber", "Plakor",
  "Cattáneo", "Cerámica San Lorenzo", "Hergo", "Orbis",
  "Sinteplast", "Akapol", "Isover", "Durlock",
  "FV", "Glorisa", "Geka", "Cormela",
  "Sipar", "Knauf", "Cambre", "Espiroflex",
  "Portolan", "Porcelanato Del Conca", "Grecia", "Pisos del Sur",
];

export default function Marcas() {
  return (
    <section id="marcas" className="py-24 overflow-hidden" style={{ background: "#0D4A72" }}>
      <div className="se-container mb-14">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-1 w-10" style={{ background: "#FFD700", borderRadius: "2px" }} />
          <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#FFD700" }}>
            Con quiénes trabajamos
          </span>
        </div>
        <h2 className="font-display text-white leading-none" style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", letterSpacing: "0.02em" }}>
          MARCAS LÍDERES
        </h2>
        <p className="font-body text-white/50 text-lg mt-3 max-w-xl" style={{ fontWeight: 300 }}>
          Más de 30 marcas reconocidas. Calidad garantizada, disponibilidad real.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0D4A72, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0D4A72, transparent)" }} />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {[...MARCAS, ...MARCAS].map((m, i) => (
              <div
                key={`${m}-${i}`}
                className="flex items-center px-8 py-4 whitespace-nowrap"
                style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="font-display text-white/40 tracking-widest" style={{ fontSize: "0.95rem", letterSpacing: "0.1em" }}>
                  {m.toUpperCase()}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="se-container mt-14">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {MARCAS.slice(0, 12).map((m) => (
            <div key={m} className="flex items-center justify-center p-5 text-center" style={{ background: "#0D4A72" }}>
              <span className="font-body text-white/40 text-xs font-semibold tracking-widest uppercase">
                {m}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
