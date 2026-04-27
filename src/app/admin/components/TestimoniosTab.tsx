"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Check, Star, Eye, EyeOff } from "lucide-react";

type Testimonio = {
  id: string;
  nombre: string;
  barrio: string;
  tipo_obra: string;
  texto: string;
  estrellas: number;
  activo: boolean;
  orden: number;
};

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  return res.json();
}

const inputCls = "w-full font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/25 px-3 py-2.5 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm";

const EMPTY: Partial<Testimonio> = { nombre: "", barrio: "", tipo_obra: "", texto: "", estrellas: 5, activo: true };

export default function TestimoniosTab() {
  const [items, setItems] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonio> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("testimonios").select("*").order("orden");
    setItems((data as Testimonio[]) || []);
    setLoading(false);
  }

  const save = async () => {
    if (!editing?.nombre || !editing?.texto) return;
    setSaving(true);
    await adminPost("upsert_testimonio", { id: isNew ? undefined : editing.id, data: editing });
    setEditing(null);
    await load();
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await adminPost("delete_testimonio", { id });
    setItems(p => p.filter(i => i.id !== id));
  };

  const toggle = async (t: Testimonio) => {
    await adminPost("upsert_testimonio", { id: t.id, data: { activo: !t.activo } });
    setItems(p => p.map(i => i.id === t.id ? { ...i, activo: !i.activo } : i));
  };

  if (loading) return <div className="text-center py-12 font-body text-white/30">Cargando testimonios...</div>;

  if (editing) return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl text-white" style={{ letterSpacing: "0.05em" }}>
          {isNew ? "NUEVO TESTIMONIO" : "EDITAR TESTIMONIO"}
        </h3>
        <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Nombre *</label>
            <input value={editing.nombre || ""} onChange={e => setEditing(p => ({ ...p!, nombre: e.target.value }))} className={inputCls} placeholder="Ej: María López" />
          </div>
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Barrio</label>
            <input value={editing.barrio || ""} onChange={e => setEditing(p => ({ ...p!, barrio: e.target.value }))} className={inputCls} placeholder="Ej: Banfield" />
          </div>
        </div>
        <div>
          <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Tipo de obra</label>
          <input value={editing.tipo_obra || ""} onChange={e => setEditing(p => ({ ...p!, tipo_obra: e.target.value }))} className={inputCls} placeholder="Ej: Refacción de baño" />
        </div>
        <div>
          <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Testimonio *</label>
          <textarea value={editing.texto || ""} onChange={e => setEditing(p => ({ ...p!, texto: e.target.value }))} className={inputCls} rows={5} style={{ resize: "vertical" }} placeholder="Lo que dijo el cliente..." />
        </div>
        <div>
          <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">Estrellas</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setEditing(p => ({ ...p!, estrellas: n }))} className="p-1">
                <Star size={20} style={{ fill: (editing.estrellas || 5) >= n ? "#E07B10" : "transparent", color: (editing.estrellas || 5) >= n ? "#E07B10" : "rgba(255,255,255,0.2)" }} />
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-6 rounded-full transition-colors relative" style={{ background: editing.activo ? "#10B981" : "rgba(255,255,255,0.15)" }} onClick={() => setEditing(p => ({ ...p!, activo: !p!.activo }))}>
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: editing.activo ? "22px" : "4px" }} />
          </div>
          <span className="font-body text-sm text-white/70">{editing.activo ? "Visible en el sitio" : "Oculto"}</span>
        </label>
      </div>
      <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/08">
        <button onClick={() => setEditing(null)} className="font-body text-sm text-white/40 px-4 py-2">Cancelar</button>
        <button onClick={save} disabled={saving || !editing.nombre || !editing.texto}
          className="font-body font-semibold text-sm text-white px-7 py-2.5 disabled:opacity-40"
          style={{ background: "#0D4A72", borderRadius: "4px" }}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="font-body text-sm text-white/40">{items.length} testimonios · {items.filter(i => i.activo).length} visibles</p>
        <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
          className="flex items-center gap-1.5 font-body text-xs font-semibold text-white px-4 py-2"
          style={{ background: "#0D4A72", borderRadius: "4px" }}>
          <Plus size={13} /> Nuevo testimonio
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-center py-12 font-body text-white/30">
            No hay testimonios. Agregá el primero.
          </div>
        )}
        {items.map(t => (
          <div key={t.id} className="flex items-start gap-3 px-4 py-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-body text-sm font-semibold text-white">{t.nombre}</span>
                {t.barrio && <span className="font-body text-xs text-white/35">· {t.barrio}</span>}
                {t.tipo_obra && <span className="font-body text-xs text-white/35">· {t.tipo_obra}</span>}
                {!t.activo && <span className="font-body text-xs text-white/30 px-1.5 py-0.5" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px" }}>Oculto</span>}
              </div>
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: t.estrellas || 5 }).map((_, i) => (
                  <Star key={i} size={11} style={{ fill: "#E07B10", color: "#E07B10" }} />
                ))}
              </div>
              <p className="font-body text-xs text-white/45 line-clamp-2">{t.texto}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggle(t)} className="p-1.5 text-white/30 hover:text-white transition-colors" title={t.activo ? "Ocultar" : "Mostrar"}>
                {t.activo ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button onClick={() => { setEditing({ ...t }); setIsNew(false); }} className="p-1.5 text-white/30 hover:text-[#0D4A72] transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => del(t.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
