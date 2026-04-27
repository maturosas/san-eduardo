import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase";
import { Rubro, RubroItem } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { ArrowLeft, MessageCircle, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = serverClient();
  const { data } = await db.from("rubros").select("name,description").eq("slug", slug).single();
  if (!data) return {};
  return {
    title: `${data.name} | San Eduardo Design · Temperley`,
    description: data.description,
  };
}

export const revalidate = 60;

export default async function RubroPage({ params }: Props) {
  const { slug } = await params;
  const db = serverClient();

  const { data: rubro } = await db.from("rubros").select("*").eq("slug", slug).eq("active", true).single();
  if (!rubro) notFound();

  const { data: items } = await db.from("rubro_items").select("*").eq("rubro_id", (rubro as Rubro).id).eq("active", true).order("orden");

  const { data: otrosRubros } = await db.from("rubros").select("name,slug,icon").eq("active", true).neq("slug", slug).order("orden").limit(4);

  const r = rubro as Rubro;
  const waText = encodeURIComponent(r.whatsapp_text || `Hola, quiero cotizar ${r.name}.`);
  const waLink = `https://api.whatsapp.com/send?phone=5491121613339&text=${waText}`;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-16" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <Link href="/#rubros" className="inline-flex items-center gap-2 font-body text-sm text-white/50 hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} /> Volver a rubros
            </Link>
            <div className="flex items-start gap-5">
              <span className="text-5xl">{r.icon}</span>
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: "#FFD700" }}>Rubro</p>
                <h1 className="font-display text-white leading-none mb-3" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", letterSpacing: "0.03em" }}>
                  {r.name.toUpperCase()}
                </h1>
                <p className="font-body text-white/65 text-lg max-w-xl" style={{ fontWeight: 300 }}>{r.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main */}
              <div className="lg:col-span-2">
                {/* Long description */}
                {r.long_description && (
                  <div className="mb-10">
                    <h2 className="font-display mb-4" style={{ fontSize: "1.6rem", color: "#0D4A72", letterSpacing: "0.03em" }}>
                      ¿QUÉ ENCONTRÁS EN {r.name.toUpperCase()}?
                    </h2>
                    <p className="font-body text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>{r.long_description}</p>
                  </div>
                )}

                {/* Items grid */}
                {(items as RubroItem[])?.length > 0 && (
                  <div>
                    <h2 className="font-display mb-6" style={{ fontSize: "1.6rem", color: "#0D4A72", letterSpacing: "0.03em" }}>
                      PRODUCTOS Y OPCIONES
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(items as RubroItem[]).map(item => (
                        <div key={item.id} className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}>
                          <h3 className="font-body font-semibold text-[#0D4A72] mb-1">{item.name}</h3>
                          {item.description && <p className="font-body text-sm text-[#5A6A7E]" style={{ fontWeight: 300 }}>{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA banner */}
                <div className="mt-10 p-6 text-center" style={{ background: "#0D4A72", borderRadius: "4px" }}>
                  <h3 className="font-display text-white text-2xl mb-2" style={{ letterSpacing: "0.03em" }}>¿NECESITÁS {r.name.toUpperCase()}?</h3>
                  <p className="font-body text-white/60 text-sm mb-5" style={{ fontWeight: 300 }}>Consultanos disponibilidad y precios. Respondemos en el día.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-7 py-3.5 text-white"
                      style={{ background: "#25D366", borderRadius: "4px" }}>
                      <MessageCircle size={15} /> Pedir presupuesto por WhatsApp
                    </a>
                    <a href="tel:+541142644848"
                      className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-6 py-3.5 text-white hover:bg-white/10 transition-all"
                      style={{ border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "4px" }}>
                      <Phone size={14} /> 4264-4848
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Quick CTA */}
                <div className="p-5 mb-6 sticky top-24" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.12)", borderRadius: "4px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}>
                  <h3 className="font-display text-lg mb-2" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>PEDIR PRESUPUESTO</h3>
                  <p className="font-body text-sm text-[#5A6A7E] mb-4" style={{ fontWeight: 300 }}>Respondemos en el día en horario comercial.</p>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white mb-2"
                    style={{ background: "#25D366", borderRadius: "4px" }}>
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a href="/#contacto" className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white"
                    style={{ background: "#C41E2A", borderRadius: "4px" }}>
                    Formulario de contacto
                  </a>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-body text-xs text-[#5A6A7E]">📞 4264-4848 · 4264-7638</p>
                    <p className="font-body text-xs text-[#5A6A7E] mt-1">📍 Collivadino 57, Temperley</p>
                    <p className="font-body text-xs text-[#5A6A7E] mt-1">⏰ Lun–Vie 7:30–18hs</p>
                  </div>
                </div>

                {/* Otros rubros */}
                {(otrosRubros as Rubro[])?.length > 0 && (
                  <div>
                    <h4 className="font-display text-sm mb-3" style={{ color: "#0D4A72", letterSpacing: "0.1em" }}>OTROS RUBROS</h4>
                    <div className="space-y-2">
                      {(otrosRubros as Rubro[]).map(otro => (
                        <Link key={otro.slug} href={`/rubros/${otro.slug}`}
                          className="flex items-center gap-3 px-4 py-3 group transition-all"
                          style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "4px" }}>
                          <span className="text-lg">{otro.icon}</span>
                          <span className="flex-1 font-body text-sm font-medium text-[#0D4A72] group-hover:text-[#C41E2A] transition-colors">{otro.name}</span>
                          <ChevronRight size={13} className="text-[#0D4A72]/40" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
