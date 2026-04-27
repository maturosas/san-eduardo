import { MetadataRoute } from "next";
import { serverClient } from "@/lib/supabase";
import { ZONAS } from "@/data/zonas";

const BASE = "https://saneduardodesign.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = serverClient();

  const [{ data: posts }, { data: rubros }] = await Promise.all([
    db.from("blog_posts").select("slug,updated_at").eq("published", true),
    db.from("rubros").select("slug").eq("active", true),
  ]);

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/politica-de-devoluciones`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/politica-de-privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const zona_pages: MetadataRoute.Sitemap = ZONAS.map(z => ({
    url: `${BASE}/zonas/${z.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const rubro_pages: MetadataRoute.Sitemap = (rubros || []).map(r => ({
    url: `${BASE}/rubros/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blog_pages: MetadataRoute.Sitemap = (posts || []).map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...static_pages, ...zona_pages, ...rubro_pages, ...blog_pages];
}
