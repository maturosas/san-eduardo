import { notFound } from "next/navigation";
import { ZONAS, getZona } from "@/data/zonas";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import Link from "next/link";
import { ArrowLeft, MapPin, Truck, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { getWhatsAppUrlByRubro } from "@/lib/whatsapp";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ZONAS.map(z => ({ slug: z.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const zona = getZona(slug);
  if (!zona) return {};
  return {
    title: `Corralón en ${zona.name} — Materiales de construcción | San Eduardo Design`,
    description: `San Eduardo Design entrega materiales de construcción en ${zona.name}, ${zona.partido}. Cerámicas, sanitarios, cemento, hierro y más. A ${zona.km} km de Temperley.`,
    keywords: zona.keywords,
    alternates: { canonical: `https://saneduardodesign.com.ar/zonas/${zona.slug}` },
  };
}

const RUBROS_DESTACADOS = ["Cerámicas y Pisos", "Sanitarios", "Materiales Gruesos", "Plomería y Gas", "Pinturas", "Eléctrico"];

export default async function ZonaPage({ params }: Props) {
  const { slug } = await params;
  const zona = getZona(slug);
  if (!zona) notFound();

  const otrasCercanas = ZONAS.filter(z => z.slug !== slug).slice(0, 4);

  const localBizSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "San Eduardo Design",
    description: `Corralón y materiales de construcción con entrega en ${zona.name}, ${zona.partido}. Desde 1964 en Temperley.`,
    url: `https://saneduardodesign.com.ar/zonas/${zona.slug}`,
    telephone: ["+54-11-4264-4848"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dr. Carlos Collivadino 57",
      addressLocality: "Temperley",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    areaServed: { "@type": "City", name: zona.name },
    geo: { "@type": "GeoCoordinates", latitude: zona.lat, longitude: zona.lng },
  };

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "/" },
        { name: "Zonas de entrega", url: "/#zonas" },
        { name: zona.name, url: `/zonas/${zona.slug}` },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-16" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <Link href="/#zonas" className="inline-flex items-center gap-2 font-body text-sm text-white/50 hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} /> Zonas de entrega
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,215,0,0.15)", borderRadius: "4px" }}>
                <MapPin size={22} style={{ color: "#FFD700" }} />
              </div>
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#FFD700" }}>
                  Zona de entrega · {zona.partido}
                </p>
                <h1 className="font-display text-white leading-none mb-3" style={{ fontSize: "clamp(2.4rem,6vw,4rem)", letterSpacing: "0.03em" }}>
                  MATERIALES EN {zona.name.toUpperCase()}.
                </h1>
                <p className="font-body text-white/65 text-lg max-w-xl" style={{ fontWeight: 300 }}>
                  {zona.desc}
                </p>
              </div>
            </div>

            {/* Distance badge */}
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px" }}>
              <Truck size={16} style={{ color: "#FFD700" }} />
              <span className="font-body text-sm text-white">
                {zona.km === 0
                  ? "Sede principal — retiro sin costo"
                  : `A ${zona.km} km de nuestra sede en Temperley`}
              </span>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                {/* Rubros disponibles */}
                <div>
                  <h2 className="font-display mb-6" style={{ fontSize: "1.8rem", color: "#0D4A72", letterSpacing: "0.03em" }}>
                    QUÉ ENTREGAMOS EN {zona.name.toUpperCase()}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {RUBROS_DESTACADOS.map(rubro => (
                      <a
                        key={rubro}
                        href={getWhatsAppUrlByRubro(`${rubro} para entrega en ${zona.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-5 py-4 group transition-all"
                        style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}
                      >
                        <span className="font-body font-medium text-sm" style={{ color: "#0D4A72" }}>{rubro}</span>
                        <span className="font-body text-xs font-semibold group-hover:translate-x-0.5 transition-transform" style={{ color: "#25D366" }}>
                          Cotizar →
                        </span>
                      </a>
                    ))}
                  </div>
                  <p className="font-body text-sm text-[#5A6A7E] mt-4" style={{ fontWeight: 300 }}>
                    También entregamos aberturas, herramientas y todo lo que necesites. Consultá sin compromiso.
                  </p>
                </div>

                {/* Cómo pedirlo */}
                <div>
                  <h2 className="font-display mb-5" style={{ fontSize: "1.8rem", color: "#0D4A72", letterSpacing: "0.03em" }}>
                    CÓMO PEDIR ENTREGA EN {zona.name.toUpperCase()}
                  </h2>
                  <div className="space-y-4">
                    {[
                      { paso: "1", titulo: "Envianos tu lista", desc: "Por WhatsApp o formulario: qué materiales, cantidades y dirección de entrega." },
                      { paso: "2", titulo: "Recibís la cotización", desc: "Te respondemos con precio total (materiales + flete) en el día, en horario comercial." },
                      { paso: "3", titulo: "Confirmás y coordinamos", desc: "Acordamos fecha y hora de entrega según tu disponibilidad de obra." },
                    ].map(item => (
                      <div key={item.paso} className="flex gap-4 p-4" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "4px" }}>
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 font-display text-lg text-white" style={{ background: "#0D4A72", borderRadius: "50%", letterSpacing: "0" }}>
                          {item.paso}
                        </div>
                        <div>
                          <p className="font-body font-semibold text-sm" style={{ color: "#0D4A72" }}>{item.titulo}</p>
                          <p className="font-body text-sm text-[#5A6A7E]" style={{ fontWeight: 300 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="sticky top-24 space-y-5">
                  <div className="p-5" style={{ background: "#0D4A72", borderRadius: "4px" }}>
                    <h3 className="font-display text-xl text-white mb-1" style={{ letterSpacing: "0.04em" }}>
                      PRESUPUESTO EN {zona.name.toUpperCase()}
                    </h3>
                    <p className="font-body text-white/55 text-xs mb-4">Respondemos en el día.</p>
                    <a
                      href={getWhatsAppUrlByRubro(`materiales para entrega en ${zona.name}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white mb-2"
                      style={{ background: "#25D366", borderRadius: "4px" }}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <Link href="/#contacto" className="flex items-center justify-center w-full py-3 font-body font-semibold text-sm text-white"
                      style={{ background: "#C41E2A", borderRadius: "4px" }}>
                      Formulario de contacto
                    </Link>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <a href="tel:+541142644848" className="flex items-center gap-2 font-body text-sm text-white/60 hover:text-white transition-colors">
                        <Phone size={13} /> 4264-4848
                      </a>
                    </div>
                  </div>

                  {/* Otras zonas */}
                  <div>
                    <h4 className="font-display text-sm mb-3" style={{ color: "#0D4A72", letterSpacing: "0.1em" }}>OTRAS ZONAS</h4>
                    <div className="space-y-2">
                      {otrasCercanas.map(z => (
                        <Link key={z.slug} href={`/zonas/${z.slug}`}
                          className="flex items-center gap-2 px-4 py-3 group transition-all"
                          style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "4px" }}>
                          <MapPin size={12} style={{ color: "#9DAEBF", flexShrink: 0 }} />
                          <span className="flex-1 font-body text-sm font-medium group-hover:text-[#C41E2A] transition-colors" style={{ color: "#0D4A72" }}>{z.name}</span>
                          <ChevronRight size={12} className="text-[#0D4A72]/30" />
                        </Link>
                      ))}
                      <Link href="/#zonas" className="block text-center font-body text-xs font-semibold mt-2" style={{ color: "#C41E2A" }}>
                        Ver todas las zonas →
                      </Link>
                    </div>
                  </div>
                </div>
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
