"use client";

import { motion } from "framer-motion";

const RUBROS = [
  { name: "Cerámicas y Pisos", desc: "Porcellanato, cerámicas nacionales e importadas para interior y exterior.", icon: "⬛" },
  { name: "Sanitarios", desc: "Inodoros, lavatorios, bañeras de Roca, Ferrum y Daccord.", icon: "🚿" },
  { name: "Materiales Gruesos", desc: "Cemento, ladrillos, hierro, arena, cal y hormigón.", icon: "🏗️" },
  { name: "Plomería y Gas", desc: "Caños, griferías, termotanques Rheem e instalaciones.", icon: "🔧" },
  { name: "Aberturas", desc: "Puertas, ventanas y marcos de aluminio y madera.", icon: "🚪" },
  { name: "Pinturas", desc: "Látex, esmaltes, impermeabilizantes y texturas.", icon: "🎨" },
  { name: "Eléctrico", desc: "Cables, tableros, tomacorrientes y accesorios.", icon: "⚡" },
  { name: "Herramientas", desc: "Manuales, eléctricas y accesorios para todo tipo de obra.", icon: "🔨" },
];

export default function Rubros() {
  return (
    <section id="rubros" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="se-container">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>
              Lo que encontrás
            </span>
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
            RUBROS
          </h2>
          <p className="font-body text-[#5A6A7E] text-lg mt-3 max-w-xl" style={{ fontWeight: 300 }}>
            Todo para construir, reformar o terminar. Sin perder tiempo buscando en varios lados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RUBROS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group p-6 cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#F4F8FC",
                border: "1px solid rgba(13,74,114,0.1)",
                borderRadius: "4px",
                boxShadow: "0 1px 3px rgba(13,74,114,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#0D4A72";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(13,74,114,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#F4F8FC";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(13,74,114,0.06)";
              }}
            >
              <div className="text-2xl mb-4">{r.icon}</div>
              <h3
                className="font-display text-xl mb-2 group-hover:text-white transition-colors"
                style={{ color: "#0D4A72", letterSpacing: "0.04em" }}
              >
                {r.name}
              </h3>
              <p
                className="font-body text-sm leading-relaxed group-hover:text-white/65 transition-colors"
                style={{ color: "#5A6A7E", fontWeight: 400 }}
              >
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-8 py-4 text-white transition-all hover:opacity-90"
            style={{ background: "#0D4A72", borderRadius: "3px" }}
          >
            Consultar disponibilidad →
          </a>
        </div>
      </div>
    </section>
  );
}
