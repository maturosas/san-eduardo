"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "¿Dónde está el local de San Eduardo Design?",
    a: "Estamos en Dr. Carlos Collivadino 57, Temperley, Buenos Aires. A metros del centro de Temperley, con fácil acceso desde Lomas de Zamora, Adrogué y toda la zona sur.",
  },
  {
    q: "¿Hacen entregas a domicilio en el GBA Sur?",
    a: "Sí. Entregamos en toda la zona sur del GBA: Lomas de Zamora, Banfield, Adrogué, Lanús, Quilmes, Almirante Brown y más. Coordinamos la entrega directamente con el cliente según la disponibilidad.",
  },
  {
    q: "¿Cuáles son los horarios de atención?",
    a: "Lunes a viernes de 7:30 a 18:00 hs. Sábados de 7:30 a 13:00 hs. Fuera de horario podés contactarnos por WhatsApp y te respondemos a la brevedad.",
  },
  {
    q: "¿Trabajan con particulares o solo con constructores?",
    a: "Trabajamos con todos: particulares que refaccionan su casa, arquitectos, constructores y empresas. Los precios y condiciones se ajustan según el volumen y tipo de compra.",
  },
  {
    q: "¿Tienen catálogo de precios online?",
    a: "Tenemos las categorías y productos en el sitio, pero los precios de materiales de construcción varían frecuentemente. La mejor forma de obtener precios actualizados es enviarnos un WhatsApp o completar el formulario de consulta.",
  },
  {
    q: "¿Qué marcas manejan?",
    a: "Trabajamos con más de 30 marcas: Roca, Ferrum, Rheem, Saint-Gobain, Daccord, Loma Negra, Sinteplast, Cambre, FV y muchas más. Si buscás una marca específica, consultanos.",
  },
  {
    q: "¿Cómo pido un presupuesto?",
    a: "Podés usar el formulario de esta página, escribirnos por WhatsApp al +54 9 11 2161-3339, o llamarnos al 4264-4848. Respondemos en el día en horario comercial.",
  },
  {
    q: "¿Puedo retirar materiales en el local?",
    a: "Sí. Podés venir al local en Temperley a retirar sin costo de flete. Te recomendamos consultar stock por anticipado para materiales específicos o pedidos grandes.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="py-16 md:py-24" style={{ background: "#FFFFFF" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="se-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
              <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>Preguntas frecuentes</span>
              <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            </div>
            <h2 className="font-display leading-none" style={{ fontSize: "clamp(2rem,5vw,3.2rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
              LO QUE MÁS NOS PREGUNTAN.
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px", overflow: "hidden" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: open === i ? "#0D4A72" : "#FFFFFF" }}
                >
                  <span
                    className="font-body font-semibold text-sm pr-4 leading-snug"
                    style={{ color: open === i ? "#FFFFFF" : "#0D2A3D" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{
                      color: open === i ? "#FFD700" : "#9DAEBF",
                      transform: open === i ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p
                        className="px-5 py-4 font-body text-sm leading-relaxed"
                        style={{ color: "#5A6A7E", background: "#F4F8FC", fontWeight: 300 }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="font-body text-sm font-semibold" style={{ color: "#C41E2A" }}>
              Ver todas las preguntas frecuentes →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
