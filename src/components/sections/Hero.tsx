"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#111110" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            #E07B10 39px,
            #E07B10 40px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            #E07B10 39px,
            #E07B10 40px
          )`,
        }}
      />

      {/* Amber accent bar left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "#E07B10" }}
      />

      <div className="se-container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-[#E07B10]" />
                <span
                  className="font-body text-xs font-semibold tracking-[0.25em] uppercase"
                  style={{ color: "#E07B10" }}
                >
                  Desde 1964 · Temperley
                </span>
              </div>

              <h1
                className="font-display text-white leading-none mb-6"
                style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", letterSpacing: "0.02em" }}
              >
                TODO LO QUE
                <br />
                <span style={{ color: "#E07B10" }}>TU OBRA</span>
                <br />
                NECESITA.
              </h1>

              <p
                className="font-body text-white/55 text-lg leading-relaxed mb-10 max-w-md"
                style={{ fontWeight: 300 }}
              >
                Más de 15.000 artículos. Marcas líderes. Asesoramiento real
                de quien conoce la zona. Entrega en todo el GBA Sur.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-8 py-4 text-white transition-all group"
                  style={{
                    background: "#E07B10",
                    borderRadius: "2px",
                  }}
                >
                  Pedir presupuesto
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-8 py-4 text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/40"
                  style={{ borderRadius: "2px" }}
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "60+", label: "Años en el rubro", sub: "Fundada en 1964" },
                {
                  num: "15.000",
                  label: "Artículos en stock",
                  sub: "Siempre disponible",
                },
                {
                  num: "7.500",
                  label: "M² de depósito",
                  sub: "Temperley, GBA Sur",
                },
                { num: "30+", label: "Marcas líderes", sub: "Roca, Rheem, Ferrum..." },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="font-display text-4xl mb-1"
                    style={{ color: "#E07B10", letterSpacing: "0.02em" }}
                  >
                    {stat.num}
                  </div>
                  <div className="font-body text-white font-medium text-sm mb-1">
                    {stat.label}
                  </div>
                  <div className="font-body text-white/35 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6 sm:gap-12"
        >
          <div className="flex items-center gap-3 text-white/50">
            <MapPin size={14} style={{ color: "#E07B10" }} />
            <span className="font-body text-sm">
              Dr. Carlos Collivadino 57, Temperley
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/50">
            <Clock size={14} style={{ color: "#E07B10" }} />
            <span className="font-body text-sm">
              Lun–Vie 7:30–18hs · Sáb 7:30–13hs
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
