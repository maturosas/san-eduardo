import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { serverClient } from "@/lib/supabase";
import { Rubro, RubroItem } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProductDetailActions from "@/components/ProductDetailActions";
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
        <section className="pt-28 pb-10" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <Link href={`/rubros/${rubro.slug}`} className="inline-flex items-center gap-2 font-body text-sm text-white/55 hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} /> Volver a {rubro.name}
            </Link>
            <p className="font-body text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#FFD700" }}>
              {rubro.name}
            </p>
            <h1 className="font-display text-white leading-none max-w-4xl mb-3" style={{ fontSize: "clamp(2.2rem, 5vw, 4.6rem)", letterSpacing: "0.03em" }}>
              {product.name.toUpperCase()}
            </h1>
            {product.description && (
              <p className="font-body text-white/65 text-lg max-w-2xl leading-relaxed" style={{ fontWeight: 300 }}>
                {product.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="font-body text-xs font-bold uppercase tracking-widest px-3 py-1.5 text-white" style={{ background: "#C41E2A", borderRadius: "3px" }}>
                {product.badge || "Disponible"}
              </span>
              <span className="font-body text-xs font-semibold uppercase tracking-widest px-3 py-1.5 text-white/70" style={{ border: "1px solid rgba(255,255,255,0.18)", borderRadius: "3px" }}>
                Entrega en GBA Sur
              </span>
            </div>
          </div>
        </section>

        <section className="py-14" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-start">
              <div className="lg:col-span-7">
                <div className="overflow-hidden" style={{ background: "#E8EFF6", borderRadius: "6px", border: "1px solid rgba(13,74,114,0.1)", aspectRatio: "1/1" }}>
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={`${product.name} en San Eduardo Design`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="font-display text-7xl" style={{ color: "#0D4A72", opacity: 0.12, letterSpacing: "0.1em" }}>SE</span>
                    </div>
                  )}
                </div>
                <p className="font-body text-xs text-[#9DAEBF] mt-3">
                  Recomendación para nuevas imágenes: formato cuadrado 1:1 para que se vea bien en catálogo, producto y redes.
                </p>
              </div>

              <aside className="lg:col-span-5">
                <div className="sticky top-24 space-y-5">
                  <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.12)", borderRadius: "6px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-body text-xs text-[#9DAEBF] uppercase tracking-widest mb-1">Precio</p>
                        {price ? (
                          <div className="flex items-baseline gap-3">
                            <span className="font-display text-4xl" style={{ color: "#0D4A72", letterSpacing: "0.03em" }}>{formatPrecio(price)}</span>
                            {product.promo_price && product.price && (
                              <span className="font-body text-sm text-[#9DAEBF] line-through">{formatPrecio(product.price)}</span>
                            )}
                          </div>
                        ) : (
                          <span className="font-display text-4xl" style={{ color: "#0D4A72", letterSpacing: "0.03em" }}>Consultar</span>
                        )}
                      </div>
                    </div>
                    <h2 className="font-display text-xl mb-2" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>PEDIR COTIZACIÓN</h2>
                    <p className="font-body text-sm text-[#5A6A7E] mb-4" style={{ fontWeight: 300 }}>
                      Agregalo a tu presupuesto o consultanos stock, precio actualizado y entrega.
                    </p>
                    <ProductDetailActions
                      whatsappUrl={waLink}
                      product={{
                        id: product.id,
                        nombre: product.name,
                        precio: product.price,
                        precioPromo: product.promo_price,
                        rubro: rubro.name,
                        rubroSlug: rubro.slug,
                        imagen: product.image_url,
                      }}
                    />
                  </div>

                  <article className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "6px" }}>
                    <h2 className="font-display text-xl mb-4" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>
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
