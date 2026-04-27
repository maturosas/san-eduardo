import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle, ClipboardList, MessageCircle, Phone } from "lucide-react";
import { serverClient } from "@/lib/supabase";
import { Rubro, RubroItem } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const BASE = "https://saneduardodesign.com.ar";

type Props = { params: Promise<{ slug: string }> };

function formatPrecio(p: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(p);
}

async function getProduct(slug: string) {
  const db = serverClient();
  const { data: product } = await db
    .from("rubro_items")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!product) return null;

  const { data: rubro } = await db
    .from("rubros")
    .select("*")
    .eq("id", (product as RubroItem).rubro_id)
    .eq("active", true)
    .single();

  if (!rubro) return null;
  return { product: product as RubroItem, rubro: rubro as Rubro };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return {};

  const { product, rubro } = data;
  const title = product.seo_title || `${product.name} | ${rubro.name} en Temperley`;
  const description =
    product.meta_description ||
    product.description ||
    `Consultá ${product.name} en San Eduardo Design. Materiales de construcción en Temperley con entrega en GBA Sur.`;
  const url = `${BASE}/productos/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "San Eduardo Design",
      locale: "es_AR",
      type: "website",
      images: product.image_url ? [{ url: product.image_url, alt: product.name }] : undefined,
    },
    twitter: {
      card: product.image_url ? "summary_large_image" : "summary",
      title,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const { product, rubro } = data;
  const price = product.promo_price ?? product.price;
  const waText = `Hola, quiero consultar por ${product.name} (${rubro.name}). ¿Me pueden pasar precio, stock y entrega?`;
  const waLink = getWhatsAppUrl(waText);
  const productUrl = `${BASE}/productos/${product.slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description || product.description || product.long_description || product.name,
    image: product.image_url ? [product.image_url] : undefined,
    brand: { "@type": "Brand", name: "San Eduardo Design" },
    category: rubro.name,
    url: productUrl,
    offers: price
      ? {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "ARS",
          price,
          availability: product.badge === "Sin stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          seller: { "@type": "HomeAndConstructionBusiness", name: "San Eduardo Design" },
        }
      : undefined,
  };

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "/" },
        { name: "Rubros", url: "/#rubros" },
        { name: rubro.name, url: `/rubros/${rubro.slug}` },
        { name: product.name, url: `/productos/${product.slug}` },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <main>
        <section className="pt-28 pb-12" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <Link href={`/rubros/${rubro.slug}`} className="inline-flex items-center gap-2 font-body text-sm text-white/50 hover:text-white transition-colors mb-7">
              <ArrowLeft size={14} /> Volver a {rubro.name}
            </Link>
            <div className="grid lg:grid-cols-2 gap-10 items-end">
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#FFD700" }}>
                  {rubro.name}
                </p>
                <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: "clamp(2.4rem, 6vw, 4.8rem)", letterSpacing: "0.03em" }}>
                  {product.name.toUpperCase()}
                </h1>
                {product.description && (
                  <p className="font-body text-white/65 text-lg max-w-xl leading-relaxed" style={{ fontWeight: 300 }}>
                    {product.description}
                  </p>
                )}
              </div>

              <div className="p-5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px" }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-xs text-white/45 uppercase tracking-widest mb-1">Precio</p>
                    {price ? (
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-3xl text-white" style={{ letterSpacing: "0.03em" }}>{formatPrecio(price)}</span>
                        {product.promo_price && product.price && (
                          <span className="font-body text-sm text-white/35 line-through">{formatPrecio(product.price)}</span>
                        )}
                      </div>
                    ) : (
                      <span className="font-display text-3xl text-white/80" style={{ letterSpacing: "0.03em" }}>Consultar</span>
                    )}
                  </div>
                  <span className="font-body text-xs font-bold uppercase tracking-widest px-3 py-1.5 text-white" style={{ background: "#C41E2A", borderRadius: "3px" }}>
                    {product.badge || "Disponible"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="overflow-hidden mb-8" style={{ background: "#E8EFF6", borderRadius: "6px", border: "1px solid rgba(13,74,114,0.1)" }}>
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={`${product.name} en San Eduardo Design`} className="w-full object-cover" style={{ maxHeight: "520px" }} />
                  ) : (
                    <div className="flex items-center justify-center" style={{ minHeight: "360px" }}>
                      <span className="font-display text-7xl" style={{ color: "#0D4A72", opacity: 0.12, letterSpacing: "0.1em" }}>SE</span>
                    </div>
                  )}
                </div>

                <article className="p-6 sm:p-8" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "6px" }}>
                  <h2 className="font-display text-2xl mb-4" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>
                    DETALLE DEL PRODUCTO
                  </h2>
                  {product.long_description ? (
                    <div className="space-y-4">
                      {product.long_description.split("\n").filter(Boolean).map((p, i) => (
                        <p key={i} className="font-body text-[#2D4A5E] leading-relaxed" style={{ fontWeight: 300 }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>
                      Consultá disponibilidad, precio actualizado y opciones de entrega para {product.name}. Te asesoramos según el tipo de obra, cantidad necesaria y zona de entrega.
                    </p>
                  )}
                </article>
              </div>

              <aside>
                <div className="sticky top-24 space-y-5">
                  <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.12)", borderRadius: "6px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}>
                    <h3 className="font-display text-lg mb-2" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>PEDIR COTIZACIÓN</h3>
                    <p className="font-body text-sm text-[#5A6A7E] mb-4" style={{ fontWeight: 300 }}>
                      Te confirmamos stock, precio y entrega en horario comercial.
                    </p>
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white mb-2"
                      style={{ background: "#25D366", borderRadius: "4px" }}>
                      <MessageCircle size={14} /> Consultar por WhatsApp
                    </a>
                    <Link href="/#contacto"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white mb-2"
                      style={{ background: "#C41E2A", borderRadius: "4px" }}>
                      <ClipboardList size={14} /> Pedir presupuesto
                    </Link>
                    <a href="tel:+541142644848"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm"
                      style={{ color: "#0D4A72", border: "1px solid rgba(13,74,114,0.16)", borderRadius: "4px" }}>
                      <Phone size={14} /> 4264-4848
                    </a>
                  </div>

                  <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "6px" }}>
                    <h4 className="font-display text-sm mb-3" style={{ color: "#0D4A72", letterSpacing: "0.08em" }}>INFO ÚTIL</h4>
                    <div className="space-y-3">
                      {["Entrega en GBA Sur", "Asesoramiento de obra", "Retiro por local en Temperley"].map(text => (
                        <div key={text} className="flex items-center gap-2 font-body text-sm text-[#5A6A7E]">
                          <CheckCircle size={14} style={{ color: "#10B981" }} /> {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCTA />
    </>
  );
}
