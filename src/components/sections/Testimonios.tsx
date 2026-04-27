"use client";

import { motion } from "framer-motion";
import { TESTIMONIOS } from "@/data/testimonios";
import { Star } from "lucide-react";

export default function Testimonios() {
  return (
    <section className="py-24" style={{ background: "#F4F8FC" }}>
      <div className="se-container">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>
              Lo que dicen nuestros clientes
            </span>
          </div>
          <h2
            className="font-display leading-none"
            style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}
          >
            CLIENTES QUE
            <br />
            <span style={{ color: "#C41E2A" }}>CONSTRUYERON</span> CON NOSOTROS.
          </h2>
          <p className="font-body text-[#5A6A7E] text-lg mt-3 max-w-xl" style={{ fontWeight: 300 }}>
            60 años de obras en el GBA Sur hablan por sí solos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIOS.map((t, i) => (
            <motion.div
              key={t.nombre}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col p-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(13,74,114,0.1)",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(13,74,114,0.06)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.estrellas }).map((_, j) => (
                  <Star key={j} size={13} style={{ fill: "#E07B10", color: "#E07B10" }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="font-body text-sm leading-relaxed flex-1 mb-5"
                style={{ color: "#3D5A6E", fontWeight: 300, fontStyle: "normal" }}
              >
                &ldquo;{t.texto}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="border-t pt-4" style={{ borderColor: "rgba(13,74,114,0.08)" }}>
                <div className="font-body font-semibold text-sm" style={{ color: "#0D4A72" }}>
                  {t.nombre}
                </div>
                <div className="font-body text-xs mt-0.5" style={{ color: "#9DAEBF" }}>
                  {t.barrio} · {t.tipoObra}
                </div>
                <div className="font-body text-xs mt-0.5" style={{ color: "#C4CDD6" }}>
                  {t.fecha}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Schema.org review aggregate (invisible) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "San Eduardo Design",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                reviewCount: TESTIMONIOS.length.toString(),
                bestRating: "5",
              },
              review: TESTIMONIOS.map(t => ({
                "@type": "Review",
                author: { "@type": "Person", name: t.nombre },
                reviewBody: t.texto,
                reviewRating: { "@type": "Rating", ratingValue: t.estrellas.toString() },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
