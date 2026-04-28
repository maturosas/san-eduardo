import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase";
import { Rubro } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProductCard, { ProductCardData } from "@/components/ProductCard";
import { ArrowLeft, MessageCircle, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getWhatsAppUrlByRubro } from "@/lib/whatsapp";
import type { Metadata } from "next";

const BASE = "https://saneduardodesign.com.ar";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = serverClient();
  const { data } = await db.from("rubros").select("name,description").eq("slug", slug).single();
  if (!data) return {};
  return {
    title: `${data.name} | San Eduardo Design · Temperley`,
    description: `${data.description} Consultá precios y pedí presupuesto online. Entrega en todo el GBA Sur.`,
    alternates: { canonical: `${BASE}/rubros/${slug}` },
    openGraph: {
      title: `${data.name} | San Eduardo Design`,
      description: `${data.description} Consultá precios y pedí presupuesto online. Entrega en todo el GBA Sur.`,
      url: `${BASE}/rubros/${slug}`,
      siteName: "San Eduardo Design",
      locale: "es_AR",
      type: "website",
    },
  };
}

export const revalidate = 60;

export default async function RubroPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const db = serverClient();
  const currentPage = Math.max(1, Number(sp?.page || 1) || 1);

  const { data: rubro } = await db.from("rubros").select("*").eq("slug", slug).eq("active", true).single();
  if (!rubro) notFound();

  const { data: pageSizeConfig } = await db
    .from("site_config")
    .select("value")
    .eq("key", "products_per_page")
    .maybeSingle();

  const pageSize = Math.min(48, Math.max(1, Number(pageSizeConfig?.value || 8) || 8));
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: items, count } = await db
    .from("rubro_items")
    .select("*", { count: "exact" })
    .eq("rubro_id", (rubro as Rubro).id)
    .eq("active", true)
    .order("orden")
    .range(from, to);

  const { data: otrosRubros } = await db
    .from("rubros")
    .select("name,slug,icon")
    .eq("active", true)
    .neq("slug", slug)
    .order("orden")
    .limit(4);

  const r = rubro as Rubro;
  const totalProducts = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const waLink = r.whatsapp_text
    ? `https://wa.me/5491121613339?text=${encodeURIComponent(r.whatsapp_text)}`
    : getWhatsAppUrlByRubro(r.name);

  // Map DB items → ProductCardData
  const products: ProductCardData[] = (items || []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    nombre: item.name as string,
    descripcion: (item.description as string) || "",
    precio: (item.price as number) ?? null,
    precioPromo: (item.promo_price as number) ?? null,
    imagen: (item.image_url as string) ?? null,
    badge: (item.badge as string) || "En construcción",
    rubro: r.name,
    rubroSlug: r.slug,
    slug: (item.slug as string) || toSlug(item.name as string),
  }));

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "/" },
        { name: "Rubros", url: "/#rubros" },
        { name: r.name, url: `/rubros/${r.slug}` },
      ]} />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-14" style={{ background: "#0D4A72" }}>
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

        <section className="py-14" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-3 gap-12">

              {/* ── MAIN ── */}
              <div className="lg:col-span-2 space-y-12">

                {/* Long description */}
                {r.long_description && (
                  <div>
                    <h2 className="font-display mb-4" style={{ fontSize: "1.6rem", color: "#0D4A72", letterSpacing: "0.03em" }}>
                      ¿QUÉ ENCONTRÁS EN {r.name.toUpperCase()}?
                    </h2>
                    <p className="font-body text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>
                      {r.long_description}
                    </p>
                  </div>
                )}

                {/* Products grid */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display" style={{ fontSize: "1.6rem", color: "#0D4A72", letterSpacing: "0.03em" }}>
                      PRODUCTOS Y OPCIONES
                    </h2>
                    {products.length > 0 && (
                      <span className="font-body text-xs text-[#9DAEBF]">
                        {totalProducts} {totalProducts === 1 ? "producto" : "productos"}
                      </span>
                    )}
                  </div>

                  {products.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    /* Empty state */
                    <div className="grid sm:grid-cols-2 gap-5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col overflow-hidden"
                          style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "6px", opacity: 0.6 }}
                        >
                          <div style={{ aspectRatio: "4/3", background: "#E8EFF6" }} className="flex items-center justify-center">
                            <span className="font-display text-3xl" style={{ color: "#0D4A72", opacity: 0.1 }}>SE</span>
                          </div>
                          <div className="p-4">
                            <div className="h-3 rounded mb-2" style={{ background: "#E8EFF6", width: "70%" }} />
                            <div className="h-2 rounded mb-4" style={{ background: "#E8EFF6", width: "90%" }} />
                            <div
                              className="w-full py-2 text-center font-body text-xs font-bold uppercase tracking-widest"
                              style={{ background: "#E8EFF6", color: "#9DAEBF", borderRadius: "4px" }}
                            >
                              En construcción
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="font-body text-xs text-[#9DAEBF] mt-4 text-center">
                    Catálogo en actualización permanente. Consultanos por productos específicos.
                  </p>

                  {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                      {currentPage > 1 && (
                        <Link
                          href={`/rubros/${r.slug}?page=${currentPage - 1}`}
                          className="font-body text-sm font-semibold px-4 py-2"
                          style={{ color: "#0D4A72", border: "1px solid rgba(13,74,114,0.16)", borderRadius: "4px" }}
                        >
                          Anterior
                        </Link>
                      )}
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const page = idx + 1;
                        const active = page === currentPage;
                        return (
                          <Link
                            key={page}
                            href={`/rubros/${r.slug}${page === 1 ? "" : `?page=${page}`}`}
                            className="font-body text-sm font-semibold w-10 h-10 flex items-center justify-center"
                            style={{
                              background: active ? "#0D4A72" : "#FFFFFF",
                              color: active ? "#FFFFFF" : "#0D4A72",
                              border: "1px solid rgba(13,74,114,0.16)",
                              borderRadius: "4px",
                            }}
                          >
                            {page}
                          </Link>
                        );
                      })}
                      {currentPage < totalPages && (
                        <Link
                          href={`/rubros/${r.slug}?page=${currentPage + 1}`}
                          className="font-body text-sm font-semibold px-4 py-2"
                          style={{ color: "#0D4A72", border: "1px solid rgba(13,74,114,0.16)", borderRadius: "4px" }}
                        >
                          Siguiente
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA banner */}
                <div className="p-6 text-center" style={{ background: "#0D4A72", borderRadius: "6px" }}>
                  <h3 className="font-display text-white text-2xl mb-2" style={{ letterSpacing: "0.03em" }}>
                    ¿NECESITÁS {r.name.toUpperCase()}?
                  </h3>
                  <p className="font-body text-white/60 text-sm mb-5" style={{ fontWeight: 300 }}>
                    Consultanos disponibilidad y precios. Respondemos en el día.
                  </p>
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

              {/* ── SIDEBAR ── */}
              <div>
                <div className="sticky top-24 space-y-5">
                  <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.12)", borderRadius: "6px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}>
                    <h3 className="font-display text-lg mb-2" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>PEDIR PRESUPUESTO</h3>
                    <p className="font-body text-sm text-[#5A6A7E] mb-4" style={{ fontWeight: 300 }}>
                      Agregá productos al presupuesto o consultanos directo.
                    </p>
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white mb-2"
                      style={{ background: "#25D366", borderRadius: "4px" }}>
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <Link href="/#contacto"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white"
                      style={{ background: "#C41E2A", borderRadius: "4px" }}>
                      Formulario de contacto
                    </Link>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                      <p className="font-body text-xs text-[#5A6A7E]">📞 4264-4848 · 4264-7638</p>
                      <p className="font-body text-xs text-[#5A6A7E]">📍 Collivadino 57, Temperley</p>
                      <p className="font-body text-xs text-[#5A6A7E]">⏰ Lun–Vie 7:30–18hs</p>
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
                            <span className="flex-1 font-body text-sm font-medium group-hover:text-[#C41E2A] transition-colors" style={{ color: "#0D4A72" }}>
                              {otro.name}
                            </span>
                            <ChevronRight size={13} className="text-[#0D4A72]/40" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
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
