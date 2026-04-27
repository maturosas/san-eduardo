import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase";
import { BlogPost } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = serverClient();
  const { data } = await db.from("blog_posts").select("title,excerpt,image_url").eq("slug", slug).single();
  if (!data) return {};
  const post = data as Partial<BlogPost>;
  return {
    title: `${post.title} | San Eduardo Design`,
    description: post.excerpt || "",
    openGraph: post.image_url ? { images: [{ url: post.image_url }] } : undefined,
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const db = serverClient();

  const { data } = await db.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();
  if (!data) notFound();

  const post = data as BlogPost;
  const { data: related } = await db.from("blog_posts").select("title,slug,category,published_at,created_at").eq("published", true).eq("category", post.category).neq("slug", slug).limit(3);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const readTime = Math.max(2, Math.ceil((post.content || "").split(" ").length / 200));

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ]} />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-0" style={{ background: "#0D4A72" }}>
          <div className="se-container pb-12">
            <Link href="/blog" className="inline-flex items-center gap-2 font-body text-sm text-white/50 hover:text-white transition-colors mb-8">
              <ArrowLeft size={14} /> Blog
            </Link>
            <div className="max-w-3xl">
              <span className="font-body text-xs font-bold uppercase tracking-widest" style={{ color: "#FFD700" }}>{post.category}</span>
              <h1 className="font-display text-white mt-3 mb-5" style={{ fontSize: "clamp(1.8rem,5vw,3rem)", letterSpacing: "0.03em", lineHeight: 1.15 }}>
                {post.title}
              </h1>
              <div className="flex items-center gap-5 text-white/45">
                <span className="flex items-center gap-1.5 font-body text-xs"><Calendar size={12} />{fmtDate(post.published_at || post.created_at)}</span>
                <span className="flex items-center gap-1.5 font-body text-xs"><Clock size={12} />{readTime} min de lectura</span>
              </div>
            </div>
          </div>
          {post.image_url && (
            <div className="se-container pb-0">
              <div className="max-w-3xl overflow-hidden" style={{ borderRadius: "6px 6px 0 0", maxHeight: "400px" }}>
                <img src={post.image_url} alt={post.title} className="w-full object-cover" style={{ maxHeight: "400px" }} />
              </div>
            </div>
          )}
        </section>

        {/* Content */}
        <section className="py-16" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Article */}
              <article className="lg:col-span-2">
                {post.excerpt && (
                  <p className="font-body text-lg leading-relaxed mb-8 pb-8 border-b" style={{ color: "#0D4A72", fontWeight: 500, borderColor: "rgba(13,74,114,0.1)" }}>
                    {post.excerpt}
                  </p>
                )}
                <div
                  className="font-body text-base leading-relaxed whitespace-pre-wrap"
                  style={{ color: "#2D4A5E", fontWeight: 300, lineHeight: 1.8 }}
                >
                  {post.content}
                </div>

                {/* Share / CTA */}
                <div className="mt-12 p-6 text-center" style={{ background: "#0D4A72", borderRadius: "4px" }}>
                  <p className="font-display text-xl text-white mb-2" style={{ letterSpacing: "0.05em" }}>¿NECESITÁS MATERIALES?</p>
                  <p className="font-body text-white/55 text-sm mb-4" style={{ fontWeight: 300 }}>Presupuestamos todo en el día. 60 años en Temperley.</p>
                  <a href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20le%C3%AD%20su%20blog%20y%20quiero%20consultar%20materiales."
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body font-semibold text-sm px-7 py-3 text-white"
                    style={{ background: "#25D366", borderRadius: "4px" }}>
                    <MessageCircle size={14} /> Pedir presupuesto
                  </a>
                </div>
              </article>

              {/* Sidebar */}
              <aside>
                <div className="sticky top-24 space-y-6">
                  {/* CTA */}
                  <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.12)", borderRadius: "4px" }}>
                    <h3 className="font-display text-lg mb-1" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>PRESUPUESTO</h3>
                    <p className="font-body text-xs text-[#5A6A7E] mb-3">Respondemos en el día.</p>
                    <a href="https://api.whatsapp.com/send?phone=5491121613339" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white mb-2"
                      style={{ background: "#25D366", borderRadius: "4px" }}>
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                    <Link href="/#contacto" className="flex items-center justify-center w-full py-3 font-body font-semibold text-sm text-white"
                      style={{ background: "#C41E2A", borderRadius: "4px" }}>
                      Formulario
                    </Link>
                  </div>

                  {/* Related */}
                  {(related as BlogPost[])?.length > 0 && (
                    <div>
                      <h4 className="font-display text-sm mb-3" style={{ color: "#0D4A72", letterSpacing: "0.1em" }}>ARTÍCULOS RELACIONADOS</h4>
                      <div className="space-y-2">
                        {(related as BlogPost[]).map(r => (
                          <Link key={r.slug} href={`/blog/${r.slug}`}
                            className="block p-3 group transition-all"
                            style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "4px" }}>
                            <p className="font-body text-sm font-medium group-hover:text-[#C41E2A] transition-colors" style={{ color: "#0D4A72" }}>{r.title}</p>
                            <p className="font-body text-xs text-[#9DAEBF] mt-1">{r.category}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rubros link */}
                  <div className="p-4" style={{ background: "#F4F8FC", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}>
                    <p className="font-body text-xs text-[#5A6A7E] mb-2">Explorá nuestros rubros</p>
                    <Link href="/#rubros" className="font-body text-sm font-semibold" style={{ color: "#0D4A72" }}>
                      Ver todos los rubros →
                    </Link>
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
