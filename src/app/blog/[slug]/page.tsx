import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase";
import { BlogPost } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { parseContent } from "@/lib/parseContent";
import type { Metadata } from "next";

const BASE = "https://saneduardodesign.com.ar";

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
    alternates: { canonical: `${BASE}/blog/${slug}` },
    openGraph: {
      title: `${post.title} | San Eduardo Design`,
      description: post.excerpt || "",
      url: `${BASE}/blog/${slug}`,
      siteName: "San Eduardo Design",
      locale: "es_AR",
      type: "article",
      images: post.image_url ? [{ url: post.image_url, alt: post.title || "San Eduardo Design" }] : undefined,
    },
    twitter: {
      card: post.image_url ? "summary_large_image" : "summary",
      title: `${post.title} | San Eduardo Design`,
      description: post.excerpt || "",
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const db = serverClient();

  const { data } = await db.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();
  if (!data) notFound();

  const post = data as BlogPost;

  const { data: related } = await db
    .from("blog_posts")
    .select("title,slug,category,published_at,created_at,excerpt")
    .eq("published", true)
    .eq("category", post.category)
    .neq("slug", slug)
    .limit(2);

  const { data: morePosts } = await db
    .from("blog_posts")
    .select("title,slug,category,published_at,created_at,excerpt")
    .eq("published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const readTime = Math.max(2, Math.ceil((post.content || "").split(" ").length / 200));
  const parsedContent = parseContent(post.content || "");

  const CATEGORY_COLORS: Record<string, string> = {
    "Materiales": "#0D4A72",
    "Construcción": "#C41E2A",
    "Oportunidades inmobiliarias": "#10B981",
    "GBA Sur": "#7C3AED",
    "Consejos de obra": "#D97706",
    "General": "#5A6A7E",
  };
  const catColor = CATEGORY_COLORS[post.category] || "#0D4A72";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.image_url ? [post.image_url] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: { "@type": "Organization", name: "San Eduardo Design" },
    publisher: { "@type": "Organization", name: "San Eduardo Design" },
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
  };

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: post.title, url: `/blog/${post.slug}` },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <main>
        {/* Article hero */}
        <section style={{ background: "#0D4A72" }}>
          <div className="se-container pt-28 pb-0">
            <Link href="/blog" className="inline-flex items-center gap-2 font-body text-sm text-white/50 hover:text-white transition-colors mb-8">
              <ArrowLeft size={13} /> Volver al blog
            </Link>

            {/* Category */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span
                className="font-body text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5"
                style={{ background: catColor, color: "#FFFFFF", borderRadius: "3px" }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display text-white leading-tight mb-6 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", letterSpacing: "0.02em" }}
            >
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/45 pb-10">
              <span className="flex items-center gap-1.5 font-body text-sm">
                <Calendar size={13} />
                {fmtDate(post.published_at || post.created_at)}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/25" />
              <span className="flex items-center gap-1.5 font-body text-sm">
                <Clock size={13} />
                {readTime} min de lectura
              </span>
              <span className="w-1 h-1 rounded-full bg-white/25" />
              <span className="font-body text-sm">San Eduardo Design</span>
            </div>
          </div>
        </section>

        {/* Cover image */}
        {post.image_url && (
          <div className="se-container px-0 sm:px-0">
            <div className="overflow-hidden" style={{ maxHeight: "420px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: "420px" }}
              />
            </div>
          </div>
        )}

        {/* Content layout */}
        <section className="py-14" style={{ background: "#F4F8FC" }}>
          <div className="se-container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Article */}
              <article className="lg:col-span-2">
                {/* Excerpt / lead */}
                {post.excerpt && (
                  <p
                    className="font-body mb-8 pb-8 border-b leading-relaxed"
                    style={{
                      fontSize: "1.15rem",
                      color: "#0D4A72",
                      fontWeight: 500,
                      borderColor: "rgba(13,74,114,0.12)",
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}

                {/* Parsed content */}
                <div className="article-body">
                  <style>{`
                    .article-body .article-h2 {
                      font-family: var(--font-display), 'Bebas Neue', sans-serif;
                      font-size: 1.5rem;
                      letter-spacing: 0.03em;
                      color: #0D4A72;
                      margin-top: 2.5rem;
                      margin-bottom: 1rem;
                      padding-left: 14px;
                      border-left: 3px solid #C41E2A;
                    }
                    .article-body .article-p {
                      font-family: var(--font-body), 'Barlow', sans-serif;
                      font-size: 1rem;
                      color: #2D4A5E;
                      line-height: 1.85;
                      font-weight: 300;
                      margin-bottom: 1.25rem;
                    }
                    .article-body .article-lead {
                      font-size: 1.05rem;
                      color: #1A3A50;
                      font-weight: 400;
                    }
                    .article-body .article-list {
                      margin: 1.25rem 0 1.5rem 0;
                      padding: 0;
                      list-style: none;
                    }
                    .article-body .article-list li,
                    .article-body .article-list-item {
                      font-family: var(--font-body), 'Barlow', sans-serif;
                      font-size: 0.95rem;
                      color: #2D4A5E;
                      line-height: 1.7;
                      font-weight: 300;
                      padding: 0.4rem 0 0.4rem 1.5rem;
                      position: relative;
                      border-bottom: 1px solid rgba(13,74,114,0.06);
                    }
                    .article-body .article-list li::before,
                    .article-body .article-list-item::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 50%;
                      transform: translateY(-50%);
                      width: 6px;
                      height: 6px;
                      background: #0D4A72;
                      border-radius: 50%;
                    }
                  `}</style>
                  {parsedContent}
                </div>

                {/* CTA inline */}
                <div
                  className="mt-12 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  style={{ background: "#0D4A72", borderRadius: "6px" }}
                >
                  <div className="flex-1">
                    <p className="font-display text-xl text-white mb-1" style={{ letterSpacing: "0.05em" }}>
                      ¿NECESITÁS LOS MATERIALES?
                    </p>
                    <p className="font-body text-white/55 text-sm" style={{ fontWeight: 300 }}>
                      Presupuestamos todo en el día. 60 años en Temperley.
                    </p>
                  </div>
                  <a
                    href="https://api.whatsapp.com/send?phone=5491121613339"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 font-body font-bold text-sm px-6 py-3 text-white"
                    style={{ background: "#25D366", borderRadius: "4px" }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>

                {/* Related from same category */}
                {(related as BlogPost[])?.length > 0 && (
                  <div className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(13,74,114,0.1)" }}>
                    <h3 className="font-display text-lg mb-5" style={{ color: "#0D4A72", letterSpacing: "0.06em" }}>
                      TAMBIÉN EN {post.category.toUpperCase()}
                    </h3>
                    <div className="space-y-4">
                      {(related as BlogPost[]).map(r => (
                        <Link key={r.slug} href={`/blog/${r.slug}`}
                          className="flex items-start gap-4 group p-4 transition-all"
                          style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "4px" }}>
                          <div className="flex-1">
                            <p className="font-body text-sm font-semibold group-hover:text-[#C41E2A] transition-colors leading-snug" style={{ color: "#0D4A72" }}>
                              {r.title}
                            </p>
                            {r.excerpt && <p className="font-body text-xs text-[#9DAEBF] mt-1 line-clamp-1">{r.excerpt}</p>}
                          </div>
                          <ArrowRight size={14} className="text-[#9DAEBF] group-hover:text-[#C41E2A] transition-colors flex-shrink-0 mt-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Sidebar */}
              <aside>
                <div className="sticky top-24 space-y-5">
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

                  {/* More posts */}
                  {(morePosts as BlogPost[])?.length > 0 && (
                    <div>
                      <h4 className="font-display text-sm mb-3 uppercase" style={{ color: "#0D4A72", letterSpacing: "0.1em" }}>Más artículos</h4>
                      <div className="space-y-2">
                        {(morePosts as BlogPost[]).map(r => (
                          <Link key={r.slug} href={`/blog/${r.slug}`}
                            className="block p-3 group transition-all"
                            style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.08)", borderRadius: "4px" }}>
                            <p className="font-body text-sm font-medium group-hover:text-[#C41E2A] transition-colors leading-snug" style={{ color: "#0D4A72" }}>
                              {r.title}
                            </p>
                            <p className="font-body text-xs text-[#9DAEBF] mt-1">{r.category}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back to blog */}
                  <Link href="/blog" className="flex items-center gap-2 font-body text-sm font-semibold" style={{ color: "#C41E2A" }}>
                    <ArrowLeft size={13} /> Ver todos los artículos
                  </Link>
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
