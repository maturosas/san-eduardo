"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Testimonio } from "@/data/testimonios";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";
import { splitLines } from "@/lib/siteContent";

export default function TestimoniosGrid({ items, content = CONTENT_DEFAULTS }: { items: Testimonio[]; content?: SiteContent }) {
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24" style={{ background: "#F4F8FC" }}>
      <div className="se-container">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>
              {content.testimonios_eyebrow}
            </span>
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
            {splitLines(content.testimonios_title).map((line, i) => (
              <span key={line} className="block" style={{ color: i === 1 ? "#C41E2A" : "#0D4A72" }}>{line}</span>
            ))}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.nombre + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col p-6"
              style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px", boxShadow: "0 2px 8px rgba(13,74,114,0.06)" }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.estrellas || 5 }).map((_, j) => (
                  <Star key={j} size={13} style={{ fill: "#E07B10", color: "#E07B10" }} />
                ))}
              </div>
              <blockquote className="font-body text-sm leading-relaxed flex-1 mb-5" style={{ color: "#3D5A6E", fontWeight: 300 }}>
                &ldquo;{t.texto}&rdquo;
              </blockquote>
              <div className="border-t pt-4" style={{ borderColor: "rgba(13,74,114,0.08)" }}>
                <div className="font-body font-semibold text-sm" style={{ color: "#0D4A72" }}>{t.nombre}</div>
                {(t.barrio || t.tipoObra) && (
                  <div className="font-body text-xs mt-0.5" style={{ color: "#9DAEBF" }}>
                    {[t.barrio, t.tipoObra].filter(Boolean).join(" · ")}
                  </div>
                )}
                {t.fecha && <div className="font-body text-xs mt-0.5" style={{ color: "#C4CDD6" }}>{t.fecha}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
