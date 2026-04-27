import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | San Eduardo Design — Corralón Temperley",
  description: "Respondemos las dudas más comunes sobre materiales de construcción, entregas, horarios, marcas y presupuestos. San Eduardo Design, Temperley GBA Sur.",
};

const FAQS = [
  {
    q: "¿Dónde está el local de San Eduardo Design?",
    a: "Estamos en Dr. Carlos Collivadino 57, Temperley, Buenos Aires. A metros del centro de Temperley, con fácil acceso desde Lomas de Zamora, Adrogué, Banfield y toda la zona sur del GBA. Contamos con estacionamiento disponible.",
  },
  {
    q: "¿Hacen entregas a domicilio?",
    a: "Sí. Contamos con fletes propios que cubren toda la zona sur del GBA: Lomas de Zamora, Banfield, Adrogué, Lanús, Quilmes, Almirante Brown, Bernal, Wilde, Avellaneda, Berazategui, Florencio Varela, Monte Grande, Ezeiza y más. Para La Plata y San Justo, consultá condiciones según volumen.",
  },
  {
    q: "¿Cuáles son los horarios de atención?",
    a: "Lunes a viernes de 7:30 a 18:00 hs. Sábados de 7:30 a 13:00 hs. Domingos cerrado. Fuera de horario podés dejarnos un mensaje por WhatsApp y te respondemos al inicio del siguiente día hábil.",
  },
  {
    q: "¿Trabajan con particulares o solo con constructores?",
    a: "Trabajamos con todos. Atendemos a particulares que refaccionan su casa o hacen una mejora, arquitectos y diseñadores de interiores, constructores y desarrolladoras, y empresas con consumo recurrente. Los precios y condiciones de pago se adaptan según el tipo de compra y el volumen.",
  },
  {
    q: "¿Tienen catálogo de precios online?",
    a: "Los materiales de construcción tienen precios que cambian frecuentemente según el mercado. Por eso no publicamos listas fijas — queremos darte el precio real del momento. La forma más rápida de obtener precios es enviarnos un WhatsApp con la lista de materiales o completar el formulario de consulta.",
  },
  {
    q: "¿Qué marcas tienen disponibles?",
    a: "Trabajamos con más de 30 marcas líderes: Roca, Ferrum, Rheem, Daccord, Saint-Gobain, Loma Negra, CEFAS, Weber, Sinteplast, Akapol, Cambre, BTicino, FV, Orbis, Cattáneo, Cerámica San Lorenzo, Durlock, Isover y muchas más. Si buscás una marca específica que no ves en el sitio, consultanos.",
  },
  {
    q: "¿Cómo pido un presupuesto?",
    a: "Hay tres formas: 1) Completá el formulario en esta web y te respondemos en el día. 2) Escribinos por WhatsApp al +54 9 11 2161-3339. 3) Llamanos al 4264-4848 en horario de atención. Para pedidos grandes o de obra, podés acercarte al local con los planos y te asesoramos en persona.",
  },
  {
    q: "¿Puedo retirar los materiales en el local?",
    a: "Sí. Podés retirar directamente en el depósito de Temperley sin costo de flete. Para pedidos grandes o materiales específicos, te recomendamos llamar antes para verificar disponibilidad y coordinar el retiro.",
  },
  {
    q: "¿Tienen stock permanente o trabajan por pedido?",
    a: "Contamos con más de 15.000 artículos en stock permanente en nuestro depósito de 7.500 m². Los materiales más comunes (cemento, hierro, cerámicas de línea, sanitarios estándar) siempre están disponibles. Para líneas especiales, diseños de importación o productos de alta demanda, puede haber tiempos de espera.",
  },
  {
    q: "¿Cuánto tiempo demora la entrega?",
    a: "Para pedidos con stock disponible, coordinamos la entrega generalmente dentro de las 48 horas. El tiempo exacto depende de la zona, el volumen del pedido y la disponibilidad de los fletes. Te confirmamos la fecha y horario antes de despachar.",
  },
  {
    q: "¿Aceptan tarjeta de crédito?",
    a: "Sí, aceptamos todas las tarjetas de crédito y débito. Para obras grandes también podemos hablar de condiciones especiales. Consultanos.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={[{ name: "Inicio", url: "/" }, { name: "Preguntas frecuentes", url: "/faq" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main>
        <section className="pt-28 pb-14" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-8" style={{ background: "#FFD700" }} />
              <span className="font-body text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#FFD700" }}>FAQ</span>
            </div>
            <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: "clamp(2.2rem,6vw,4rem)", letterSpacing: "0.03em" }}>
              PREGUNTAS<br />FRECUENTES.
            </h1>
            <p className="font-body text-white/55 text-lg max-w-xl" style={{ fontWeight: 300 }}>
              Todo lo que necesitás saber antes de comprar materiales en San Eduardo Design.
            </p>
          </div>
        </section>

        <section className="py-14" style={{ background: "#F4F8FC" }}>
          <div className="se-container max-w-3xl">
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="p-6"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}
                >
                  <h2 className="font-body font-semibold mb-3" style={{ fontSize: "15px", color: "#0D4A72" }}>
                    {faq.q}
                  </h2>
                  <p className="font-body text-sm text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 text-center" style={{ background: "#0D4A72", borderRadius: "4px" }}>
              <p className="font-display text-white text-2xl mb-2" style={{ letterSpacing: "0.05em" }}>¿NO ENCONTRASTE TU PREGUNTA?</p>
              <p className="font-body text-white/55 text-sm mb-5" style={{ fontWeight: 300 }}>Escribinos directamente y te respondemos.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://api.whatsapp.com/send?phone=5491121613339"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-7 py-3.5 text-white"
                  style={{ background: "#25D366", borderRadius: "4px" }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <Link
                  href="/#contacto"
                  className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-7 py-3.5 text-white hover:bg-white/10 transition-all"
                  style={{ border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: "4px" }}
                >
                  Formulario de contacto
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
