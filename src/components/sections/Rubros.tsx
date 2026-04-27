"use client";

import { motion } from "framer-motion";

const RUBROS = [
  {
    name: "Cerámicas y Pisos",
    desc: "Porcellanato, cerámicas nacionales e importadas, terminaciones premium para interior y exterior.",
    icon: "⬛",
    color: "#8B7355",
  },
  {
    name: "Sanitarios",
    desc: "Inodoros, lavatorios, bañeras y duchas de Roca, Ferrum y Daccord. Para refacciones y obra nueva.",
    icon: "🚿",
    color: "#3B82F6",
  },
  {
    name: "Materiales Gruesos",
    desc: "Cemento, ladrillos, hierro, arena, cal, hormigón y todo para la estructura de tu construcción.",
    icon: "🏗️",
    color: "#E07B10",
  },
  {
    name: "Plomería y Gas",
    desc: "Caños, conexiones, griferías, termotanques Rheem y todo para instalaciones hidráulicas y gas.",
    icon: "🔧",
    color: "#10B981",
  },
  {
    name: "Aberturas",
    desc: "Puertas, ventanas, marcos y rejas. Aluminio y madera. Medidas estándar y a pedido.",
    icon: "🚪",
    color: "#6B7280",
  },
  {
    name: "Pinturas",
    desc: "Látex, esmaltes, impermeabilizantes y revestimientos texturados. Marcas líderes del mercado.",
    icon: "🎨",
    color: "#EC4899",
  },
  {
    name: "Eléctrico",
    desc: "Cables, tableros, tomacorrientes, llaves y todo lo necesario para instalaciones eléctricas seguras.",
    icon: "⚡",
    color: "#EAB308",
  },
  {
    name: "Herramientas",
    desc: "Manuales, eléctricas y accesorios de trabajo. Todo para el professional y el que construye su casa.",
    icon: "🔨",
    color: "#F97316",
  },
];

export default function Rubros() {
  return (
    <section id="rubros" className="py-24" style={{ background: "#F5F0E8" }}>
      <div className="se-container">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#E07B10]" />
            <span
              className="font-body text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ color: "#E07B10" }}
            >
              Lo que encontrás
            </span>
          </div>
          <h2
            className="font-display leading-none"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "#111110",
              letterSpacing: "0.02em",
            }}
          >
            RUBROS
          </h2>
          <p className="font-body text-[#6B7280] text-lg mt-4 max-w-xl" style={{ fontWeight: 300 }}>
            Todo lo que necesitás para construir, reformar o terminar.
            Sin perder tiempo buscando en varios lados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RUBROS.map((rubro, i) => (
            <motion.div
              key={rubro.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group p-6 bg-white hover:bg-[#111110] transition-colors duration-300 cursor-default"
              style={{
                border: "1px solid rgba(17,17,16,0.1)",
                borderRadius: "2px",
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mb-4 text-lg"
                style={{
                  background: `${rubro.color}15`,
                  borderRadius: "2px",
                }}
              >
                {rubro.icon}
              </div>
              <h3
                className="font-display text-xl mb-3 group-hover:text-white transition-colors"
                style={{ color: "#111110", letterSpacing: "0.05em" }}
              >
                {rubro.name}
              </h3>
              <p
                className="font-body text-sm leading-relaxed text-[#6B7280] group-hover:text-white/60 transition-colors"
                style={{ fontWeight: 400 }}
              >
                {rubro.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-8 py-4 text-white transition-all"
            style={{ background: "#111110", borderRadius: "2px" }}
          >
            Consultar disponibilidad →
          </a>
        </div>
      </div>
    </section>
  );
}
