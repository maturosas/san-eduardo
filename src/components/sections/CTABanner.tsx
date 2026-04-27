"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export default function CTABanner() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: "#C41E2A" }}
    >
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)`,
        }}
      />

      <div className="se-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2
              className="font-display text-white leading-none mb-2"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "0.03em" }}
            >
              ¿SABÉS QUÉ MATERIALES NECESITÁS?
            </h2>
            <p className="font-body text-white/75 text-base" style={{ fontWeight: 300 }}>
              Envianos la lista y te cotizamos en el día. Sin compromisos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 font-body font-bold text-sm px-8 py-4 text-[#C41E2A] bg-white hover:bg-gray-50 transition-all shadow-lg"
              style={{ borderRadius: "4px" }}
            >
              Pedir presupuesto
              <ArrowRight size={14} />
            </a>
            <a
              href="tel:+541142644848"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-6 py-4 text-white hover:bg-white/10 transition-all"
              style={{ border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: "4px" }}
            >
              <Phone size={13} />
              4264-4848
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
