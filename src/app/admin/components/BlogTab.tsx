"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types";
import { Plus, Pencil, Trash2, X, Eye, Globe, FileText } from "lucide-react";

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  return res.json();
}

const inputCls = "w-full font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/25 px-3 py-2.5 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm";

const CATEGORIAS = ["General", "Materiales", "Construcción", "Oportunidades inmobiliarias", "GBA Sur", "Consejos de obra", "Novedades"];

const EMPTY: Partial<BlogPost> = { title: "", slug: "", excerpt: "", content: "", image_url: "", category: "General", published: false };

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  }

  const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true); setPreview(false); };
  const openEdit = (p: BlogPost) => { setEditing({ ...p }); setIsNew(false); setPreview(false); };

  const save = async () => {
    if (!editing?.title) return;
    setSaving(true);
    const payload = { ...editing, slug: editing.slug || toSlug(editing.title) };
    await adminPost("upsert_blog", { id: isNew ? undefined : editing.id, data: payload });
    setEditing(null);
    await load();
    setSaving(false);
  };

  const deletPost = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    await adminPost("delete_blog", { id });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const togglePublished = async (post: BlogPost) => {
    const newVal = !post.published;
    await adminPost("upsert_blog", { id: post.id, data: { ...post, published: newVal } });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: newVal } : p));
  };

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) return <div className="text-center py-12 font-body text-white/30">Cargando artículos...</div>;

  // Editor view
  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl text-white" style={{ letterSpacing: "0.05em" }}>{isNew ? "NUEVO ARTÍCULO" : "EDITAR ARTÍCULO"}</h3>
        <div className="flex gap-2">
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-1.5 font-body text-xs text-white/50 hover:text-white px-3 py-2 border border-white/10 transition-colors" style={{ borderRadius: "4px" }}>
            <Eye size={13} /> {preview ? "Editar" : "Preview"}
          </button>
          <button onClick={() => setEditing(null)} className="font-body text-xs text-white/40 hover:text-white px-3 py-2"><X size={14} /></button>
        </div>
      </div>

      {preview ? (
        <div className="p-6" style={{ background: "#F4F8FC", borderRadius: "4px", color: "#0D4A72", minHeight: "400px" }}>
          <div className="font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#C41E2A" }}>{editing.category}</div>
          <h1 className="font-display text-3xl mb-3" style={{ color: "#0D4A72", letterSpacing: "0.03em" }}>{editing.title || "Sin título"}</h1>
          <p className="font-body text-base text-[#5A6A7E] mb-6">{editing.excerpt}</p>
          <div className="font-body text-sm text-[#0D2A3D] leading-relaxed whitespace-pre-wrap">{editing.content}</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Título *</label>
              <input value={editing.title || ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value, slug: toSlug(e.target.value) }))} placeholder="Título del artículo" className={inputCls} />
            </div>
            <div>
              <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Categoría</label>
              <select value={editing.category || "General"} onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))} className={inputCls}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Slug (URL) — se genera automático</label>
            <input value={editing.slug || ""} onChange={e => setEditing(p => ({ ...p!, slug: e.target.value }))} className={inputCls} placeholder="url-del-articulo" />
          </div>
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Resumen (excerpt — aparece en el listado)</label>
            <textarea value={editing.excerpt || ""} onChange={e => setEditing(p => ({ ...p!, excerpt: e.target.value }))} className={inputCls} rows={2} style={{ resize: "none" }} placeholder="Una o dos oraciones que resumen el artículo..." />
          </div>
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Contenido completo</label>
            <textarea value={editing.content || ""} onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))} className={inputCls} rows={14} style={{ resize: "vertical", fontFamily: "monospace", fontSize: "13px" }} placeholder="Escribí el artículo acá. Usá saltos de línea para párrafos." />
          </div>
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">URL de imagen de portada</label>
            <input value={editing.image_url || ""} onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))} placeholder="https://..." className={inputCls} />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className="w-10 h-6 rounded-full transition-colors relative"
                style={{ background: editing.published ? "#10B981" : "rgba(255,255,255,0.15)" }}
                onClick={() => setEditing(p => ({ ...p!, published: !p!.published }))}
              >
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: editing.published ? "22px" : "4px" }} />
              </div>
              <span className="font-body text-sm text-white/70">{editing.published ? "Publicado" : "Borrador"}</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-white/08">
        <button onClick={() => setEditing(null)} className="font-body text-sm text-white/40 px-4 py-2">Cancelar</button>
        <button onClick={save} disabled={saving || !editing.title}
          className="font-body font-semibold text-sm text-white px-7 py-2.5 disabled:opacity-40"
          style={{ background: editing.published ? "#10B981" : "#0D4A72", borderRadius: "4px" }}>
          {saving ? "Guardando..." : editing.published ? "Publicar" : "Guardar borrador"}
        </button>
      </div>
    </div>
  );

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-4 text-xs font-body text-white/40">
          <span>{posts.filter(p => p.published).length} publicados</span>
          <span>·</span>
          <span>{posts.filter(p => !p.published).length} borradores</span>
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 font-body text-xs font-semibold text-white px-4 py-2" style={{ background: "#0D4A72", borderRadius: "4px" }}>
          <Plus size={13} /> Nuevo artículo
        </button>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <FileText size={32} className="text-white/20 mx-auto mb-3" />
          <p className="font-body text-white/30 text-sm">No hay artículos aún.</p>
          <button onClick={openNew} className="mt-4 font-body text-sm font-semibold text-[#0D4A72] hover:text-white transition-colors">
            Crear el primer artículo →
          </button>
        </div>
      )}

      <div className="space-y-2">
        {posts.map(p => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-body text-sm font-semibold text-white truncate">{p.title}</span>
                {p.published
                  ? <span className="flex-shrink-0 font-body text-xs px-1.5 py-0.5 text-[#10B981]" style={{ background: "rgba(16,185,129,0.12)", borderRadius: "3px" }}>Publicado</span>
                  : <span className="flex-shrink-0 font-body text-xs px-1.5 py-0.5 text-white/40" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px" }}>Borrador</span>
                }
              </div>
              <span className="font-body text-xs text-white/35">{p.category} · {fmtDate(p.created_at)}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => togglePublished(p)} className="p-1.5 text-white/30 hover:text-white transition-colors" title={p.published ? "Despublicar" : "Publicar"}>
                {p.published ? <Globe size={14} className="text-[#10B981]" /> : <Globe size={14} />}
              </button>
              <button onClick={() => openEdit(p)} className="p-1.5 text-white/30 hover:text-[#0D4A72] transition-colors"><Pencil size={14} /></button>
              <button onClick={() => deletPost(p.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
