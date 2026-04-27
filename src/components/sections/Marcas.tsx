"use client";

import { motion } from "framer-motion";

const MARCAS = [
  "Roca", "Saint-Gobain", "Rheem", "Ferrum",
  "Daccord", "Lipa", "Murvi", "Novoplack",
  "Loma Negra", "CEFAS", "Weber", "Plakor",
  "Cattáneo", "Cerámica San Lorenzo", "Hergo", "Orbis",
  "Sinteplast", "Akapol", "Isover", "Durlock",
  "FV", "Rexel", "Glorisa", "Geka",
  "Cormela", "Sipar", "Knauf", "Pirelli",
  "Tubos Trans Electric", "Cambre", "Bticino", "Espiroflex",
];

export default function Marcas() {
  return (
    <section id="marcas" className="py-24 overflow-hidden" style={{ background: "#111110" }}>
      <div className="se-container mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#E07B10]" />
          <span
            className="font-body text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: "#E07B10" }}
          >
            Con quiénes trabajamos
          </span>
        </div>
        <h2
          className="font-display text-white leading-none"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.02em",
          }}
        >
          MARCAS LÍDERES
        </h2>
        <p
          className="font-body text-white/45 text-lg mt-4 max-w-xl"
          style={{ fontWeight: 300 }}
        >
          Trabajamos con más de 30 marcas reconocidas del mercado.
          Calidad garantizada, disponibilidad real.
        </p>
      </div>

      {/* Scrolling strip */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #111110, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #111110, transparent)",
          }}
        />

        <div className="flex gap-0 overflow-hidden">
          <motion.div
            className="flex gap-0 shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...MARCAS, ...MARCAS].map((marca, i) => (
              <div
                key={`${marca}-${i}`}
                className="flex items-center px-8 py-5 whitespace-nowrap"
                style={{
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="font-display tracking-widest text-white/40"
                  style={{ fontSize: "1rem", letterSpacing: "0.12em" }}
                >
                  {marca.toUpperCase()}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid visual */}
      <div className="se-container mt-16">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          {MARCAS.slice(0, 12).map((marca) => (
            <div
              key={marca}
              className="flex items-center justify-center p-6 text-center"
              style={{ background: "#111110" }}
            >
              <span
                className="font-display text-white/30 text-sm tracking-widest"
                style={{ letterSpacing: "0.08em" }}
              >
                {marca.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
