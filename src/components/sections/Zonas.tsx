"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";
import { splitLines } from "@/lib/siteContent";

export default function Zonas({ content = CONTENT_DEFAULTS }: { content?: SiteContent }) {
  const zonas = content.zonas_list.split(",").map(z => z.trim()).filter(Boolean);

  return (
    <section id="zonas" className="py-16 md:py-24" style={{ background: "#FFFFFF" }}>
      <div className="se-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
              <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>{content.zonas_eyebrow}</span>
            </div>
            <h2 className="font-display leading-none mb-5" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
              {splitLines(content.zonas_title).map(line => <span key={line} className="block">{line}</span>)}
            </h2>
            <p className="font-body text-[#5A6A7E] text-base leading-relaxed mb-7" style={{ fontWeight: 300 }}>
              {content.zonas_description}
            </p>

            <div className="p-5 mb-5" style={{ background: "#F4F8FC", border: "1px solid rgba(13,74,114,0.12)", borderRadius: "4px", borderLeft: "4px solid #0D4A72" }}>
              <div className="flex items-start gap-3">
                <MapPin size={17} style={{ color: "#0D4A72", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div className="font-body font-semibold text-[#0D4A72] mb-1">Local principal</div>
                  <div className="font-body text-[#5A6A7E] text-sm">
                    Dr. Carlos Collivadino 57, Temperley<br />Buenos Aires, Argentina
                  </div>
                  <div className="font-body text-[#5A6A7E]/60 text-xs mt-2">Lun–Vie 7:30–18hs · Sáb 7:30–13hs</div>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              {zonas.map((zona, i) => (
                <motion.div
                  key={zona}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex items-center gap-2.5 px-3 py-2.5"
                  style={{ background: "#F4F8FC", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "3px" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0D4A72" }} />
                  <span className="font-body text-sm" style={{ color: "#0D2A3D" }}>{zona}</span>
                </motion.div>
              ))}
            </div>
            <p className="font-body text-[#5A6A7E]/60 text-xs mt-4 text-center">
              ¿Tu zona no está? Consultanos — llegamos a más lugares.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
