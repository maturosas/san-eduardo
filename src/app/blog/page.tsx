import { serverClient } from "@/lib/supabase";
import { BlogPost } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | San Eduardo Design — Construcción y materiales GBA Sur",
  description: "Artículos sobre materiales de construcción, tendencias, consejos de obra y oportunidades en el GBA Sur.",
};

export const revalidate = 60;

const CATEGORY_COLORS: Record<string, string> = {
  "Materiales": "#0D4A72",
  "Construcción": "#C41E2A",
  "Oportunidades inmobiliarias": "#10B981",
  "GBA Sur": "#7C3AED",
  "Consejos de obra": "#D97706",
  "General": "#5A6A7E",
};

export default async function BlogPage() {
  const db = serverClient();
  const { data } = await db
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const posts = (data as BlogPost[]) || [];
  const featured = posts[0];
  const rest = posts.slice(1);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  const readTime = (content: string) => Math.max(2, Math.ceil(content.split(" ").length / 200));

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-28 pb-14" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-8" style={{ background: "#FFD700" }} />
              <span className="font-body text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#FFD700" }}>Blog</span>
            </div>
            <h1 className="font-display text-white leading-none mb-3" style={{ fontSize: "clamp(2.2rem,6vw,4rem)", letterSpacing: "0.03em" }}>
              MATERIALES, OBRA<br />Y OPORTUNIDADES.
            </h1>
            <p className="font-body text-white/55 text-base max-w-xl" style={{ fontWeight: 300 }}>
              Guías prácticas sobre construcción, materiales y tendencias para el GBA Sur. Escrito por quienes atienden la obra todos los días.
            </p>
          </div>
        </section>

        <section className="py-14" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-4xl mb-3" style={{ color: "#0D4A72", letterSpacing: "0.05em" }}>PRÓXIMAMENTE</p>
                <p className="font-body text-[#5A6A7E]">Estamos preparando los primeros artículos.</p>
              </div>
            ) : (
              <>
                {/* Featured article */}
                {featured && (
                  <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                    <div
                      className="grid md:grid-cols-5 overflow-hidden transition-all hover:shadow-lg"
                      style={{ borderRadius: "6px", border: "1px solid rgba(13,74,114,0.1)", boxShadow: "0 2px 12px rgba(13,74,114,0.08)" }}
                    >
                      {/* Image */}
                      <div className="md:col-span-2 overflow-hidden" style={{ minHeight: "240px", background: "#0D4A72", position: "relative" }}>
                        {featured.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ position: "absolute", inset: 0 }} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className="font-display text-white/10"
                              style={{ fontSize: "6rem", letterSpacing: "0.1em" }}
                            >SE</span>
                          </div>
                        )}
                        {/* Category overlay */}
                        <div className="absolute top-4 left-4">
                          <span
                            className="font-body text-xs font-bold uppercase tracking-widest px-2.5 py-1"
                            style={{ background: CATEGORY_COLORS[featured.category] || "#0D4A72", color: "#FFF", borderRadius: "3px" }}
                          >
                            {featured.category} · Destacado
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-3 p-7 flex flex-col justify-between" style={{ background: "#FFFFFF" }}>
                        <div>
                          <h2
                            className="font-display mb-3 group-hover:text-[#C41E2A] transition-colors leading-tight"
                            style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", color: "#0D4A72", letterSpacing: "0.02em" }}
                          >
                            {featured.title}
                          </h2>
                          <p className="font-body text-[#5A6A7E] text-sm leading-relaxed line-clamp-3" style={{ fontWeight: 300 }}>
                            {featured.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-5 border-t" style={{ borderColor: "rgba(13,74,114,0.08)" }}>
                          <div className="flex items-center gap-3 text-[#9DAEBF]">
                            <span className="flex items-center gap-1.5 font-body text-xs">
                              <Calendar size={12} />{fmtDate(featured.published_at || featured.created_at)}
                            </span>
                            <span className="flex items-center gap-1.5 font-body text-xs">
                              <Clock size={12} />{readTime(featured.content || "")} min
                            </span>
                          </div>
                          <span className="flex items-center gap-1.5 font-body text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: "#C41E2A" }}>
                            Leer artículo <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid */}
                {rest.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1" style={{ background: "rgba(13,74,114,0.1)" }} />
                      <span className="font-body text-xs text-[#9DAEBF] uppercase tracking-widest">Todos los artículos</span>
                      <div className="h-px flex-1" style={{ background: "rgba(13,74,114,0.1)" }} />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {rest.map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 duration-300"
                          style={{ background: "#FFFFFF", borderRadius: "6px", border: "1px solid rgba(13,74,114,0.1)", boxShadow: "0 2px 8px rgba(13,74,114,0.06)" }}>
                          {/* Image */}
                          <div className="overflow-hidden" style={{ aspectRatio: "16/9", background: "#E8EFF6", position: "relative" }}>
                            {post.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ position: "absolute", inset: 0 }} />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-display text-[#0D4A72]/10" style={{ fontSize: "3rem" }}>SE</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span
                                className="font-body text-xs font-bold uppercase tracking-widest px-2 py-0.5"
                                style={{ background: CATEGORY_COLORS[post.category] || "#0D4A72", color: "#FFF", borderRadius: "3px" }}
                              >
                                {post.category}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <h3
                              className="font-display mb-2 group-hover:text-[#C41E2A] transition-colors leading-snug flex-1"
                              style={{ fontSize: "1.1rem", color: "#0D4A72", letterSpacing: "0.02em" }}
                            >
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="font-body text-xs text-[#5A6A7E] line-clamp-2 mb-4" style={{ fontWeight: 300 }}>
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(13,74,114,0.08)" }}>
                              <span className="font-body text-xs text-[#9DAEBF]">{fmtDate(post.published_at || post.created_at)}</span>
                              <span className="font-body text-xs font-semibold" style={{ color: "#C41E2A" }}>{readTime(post.content || "")} min →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
