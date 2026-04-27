import { serverClient } from "@/lib/supabase";
import { BlogPost } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | San Eduardo Design — Construcción y materiales GBA Sur",
  description: "Artículos sobre materiales de construcción, tendencias, consejos de obra y oportunidades inmobiliarias en el GBA Sur.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const db = serverClient();
  const { data } = await db.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
  const posts = (data as BlogPost[]) || [];

  const categorias = [...new Set(posts.map(p => p.category))];
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const readTime = (content: string) => Math.max(2, Math.ceil(content.split(" ").length / 200));

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-16" style={{ background: "#0D4A72" }}>
          <div className="se-container">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-0.5 w-8" style={{ background: "#FFD700" }} />
              <span className="font-body text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "#FFD700" }}>Blog</span>
            </div>
            <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: "clamp(2.4rem,6vw,4rem)", letterSpacing: "0.03em" }}>
              MATERIALES, OBRA
              <br />Y OPORTUNIDADES.
            </h1>
            <p className="font-body text-white/55 text-lg max-w-xl" style={{ fontWeight: 300 }}>
              Artículos sobre construcción, materiales, tendencias y oportunidades inmobiliarias en el GBA Sur.
            </p>
          </div>
        </section>

        <section className="py-16" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-4xl mb-3" style={{ color: "#0D4A72", letterSpacing: "0.05em" }}>PRÓXIMAMENTE</p>
                <p className="font-body text-[#5A6A7E]">Estamos preparando los primeros artículos. Volvé pronto.</p>
                <Link href="/" className="inline-block mt-6 font-body text-sm font-semibold text-[#C41E2A]">← Volver al inicio</Link>
              </div>
            ) : (
              <>
                {/* Featured */}
                {posts[0] && (
                  <Link href={`/blog/${posts[0].slug}`} className="group block mb-12">
                    <div className="grid md:grid-cols-2 gap-0 overflow-hidden" style={{ borderRadius: "6px", boxShadow: "0 8px 32px rgba(13,74,114,0.12)" }}>
                      <div className="aspect-video md:aspect-auto md:min-h-64 overflow-hidden" style={{ background: "#0D4A72" }}>
                        {posts[0].image_url
                          ? <img src={posts[0].image_url} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center"><span className="font-display text-5xl text-white/20" style={{ letterSpacing: "0.1em" }}>SE</span></div>
                        }
                      </div>
                      <div className="p-8" style={{ background: "#FFFFFF" }}>
                        <span className="font-body text-xs font-bold uppercase tracking-widest" style={{ color: "#C41E2A" }}>{posts[0].category} · Destacado</span>
                        <h2 className="font-display mt-3 mb-3 group-hover:text-[#C41E2A] transition-colors" style={{ fontSize: "1.8rem", color: "#0D4A72", letterSpacing: "0.03em", lineHeight: 1.2 }}>
                          {posts[0].title}
                        </h2>
                        <p className="font-body text-[#5A6A7E] text-sm leading-relaxed mb-5" style={{ fontWeight: 300 }}>{posts[0].excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-xs text-[#5A6A7E]">{fmtDate(posts[0].published_at || posts[0].created_at)}</span>
                          <span className="font-body text-xs font-semibold" style={{ color: "#C41E2A" }}>{readTime(posts[0].content || "")} min →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid */}
                {posts.length > 1 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.slice(1).map(post => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="group block overflow-hidden" style={{ background: "#FFFFFF", borderRadius: "6px", border: "1px solid rgba(13,74,114,0.1)", boxShadow: "0 2px 8px rgba(13,74,114,0.06)" }}>
                        <div className="aspect-video overflow-hidden" style={{ background: "#0D4A72" }}>
                          {post.image_url
                            ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            : <div className="w-full h-full flex items-center justify-center"><span className="font-display text-3xl text-white/20">SE</span></div>
                          }
                        </div>
                        <div className="p-5">
                          <span className="font-body text-xs font-bold uppercase tracking-widest" style={{ color: "#C41E2A" }}>{post.category}</span>
                          <h3 className="font-display mt-2 mb-2 group-hover:text-[#C41E2A] transition-colors line-clamp-2" style={{ fontSize: "1.2rem", color: "#0D4A72", letterSpacing: "0.03em", lineHeight: 1.3 }}>
                            {post.title}
                          </h3>
                          <p className="font-body text-sm text-[#5A6A7E] line-clamp-2 mb-4" style={{ fontWeight: 300 }}>{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-body text-xs text-[#9DAEBF]">{fmtDate(post.published_at || post.created_at)}</span>
                            <span className="font-body text-xs font-semibold" style={{ color: "#C41E2A" }}>{readTime(post.content || "")} min →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
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
