"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Rubro, RubroItem } from "@/types";
import { Plus, Pencil, Trash2, X, Check, ChevronRight, Eye, EyeOff } from "lucide-react";

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  return res.json();
}

const inputCls = "w-full font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/25 px-3 py-2.5 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm";

type EditingRubro = Partial<Rubro> & { _new?: boolean };
type EditingItem = Partial<RubroItem> & { _new?: boolean };

export default function RubrosTab() {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [items, setItems] = useState<Record<string, RubroItem[]>>({});
  const [selectedRubro, setSelectedRubro] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingRubro | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("rubros").select("*").order("orden");
    setRubros((data as Rubro[]) || []);
    setLoading(false);
  }

  async function loadItems(rubroId: string) {
    if (items[rubroId]) return;
    const { data } = await supabase.from("rubro_items").select("*").eq("rubro_id", rubroId).order("orden");
    setItems(prev => ({ ...prev, [rubroId]: (data as RubroItem[]) || [] }));
  }

  const selectRubro = async (id: string) => {
    setSelectedRubro(id === selectedRubro ? null : id);
    if (id !== selectedRubro) await loadItems(id);
  };

  const saveRubro = async () => {
    if (!editing) return;
    setSaving(true);
    await adminPost(editing._new ? "upsert_rubro" : "upsert_rubro", {
      id: editing._new ? undefined : editing.id,
      data: {
        name: editing.name,
        slug: editing.slug || toSlug(editing.name || ""),
        description: editing.description,
        long_description: editing.long_description,
        icon: editing.icon,
        whatsapp_text: editing.whatsapp_text,
        image_url: editing.image_url,
        active: editing.active ?? true,
        orden: editing.orden ?? 99,
      },
    });
    setEditing(null);
    await load();
    setSaving(false);
  };

  const toggleActive = async (r: Rubro) => {
    await adminPost("upsert_rubro", { id: r.id, data: { active: !r.active } });
    setRubros(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x));
  };

  const saveItem = async () => {
    if (!editingItem || !selectedRubro) return;
    setSaving(true);
    await adminPost("upsert_rubro_item", {
      id: editingItem._new ? undefined : editingItem.id,
      data: {
        rubro_id: selectedRubro,
        name: editingItem.name,
        description: editingItem.description || "",
        active: editingItem.active ?? true,
        orden: editingItem.orden ?? 99,
      },
    });
    setEditingItem(null);
    const { data } = await supabase.from("rubro_items").select("*").eq("rubro_id", selectedRubro).order("orden");
    setItems(prev => ({ ...prev, [selectedRubro]: (data as RubroItem[]) || [] }));
    setSaving(false);
  };

  const deleteItem = async (id: string, rubroId: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await adminPost("delete_rubro_item", { id });
    setItems(prev => ({ ...prev, [rubroId]: prev[rubroId].filter(i => i.id !== id) }));
  };

  if (loading) return <div className="text-center py-12 font-body text-white/30">Cargando rubros...</div>;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-sm text-white/50">
          {rubros.length} rubros · haz clic para editar ítems
        </p>
        <button onClick={() => setEditing({ _new: true, active: true, icon: "🏗️" })}
          className="flex items-center gap-1.5 font-body text-xs font-semibold text-white px-3 py-2"
          style={{ background: "#0D4A72", borderRadius: "4px" }}>
          <Plus size={13} /> Nuevo rubro
        </button>
      </div>

      {/* Rubro list */}
      {rubros.map(r => (
        <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
          {/* Row */}
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xl flex-shrink-0">{r.icon}</span>
            <button className="flex-1 text-left" onClick={() => selectRubro(r.id)}>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-semibold text-white">{r.name}</span>
                {!r.active && <span className="font-body text-xs px-1.5 py-0.5 text-white/40" style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px" }}>Oculto</span>}
              </div>
              <span className="font-body text-xs text-white/35 line-clamp-1">{r.description}</span>
            </button>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(r)} className="p-1.5 text-white/40 hover:text-white transition-colors" title={r.active ? "Ocultar" : "Mostrar"}>
                {r.active ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={() => setEditing({ ...r })} className="p-1.5 text-white/40 hover:text-[#0D4A72] transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => selectRubro(r.id)} className="p-1.5 text-white/40 hover:text-white transition-colors">
                <ChevronRight size={14} className={selectedRubro === r.id ? "rotate-90 transition-transform" : "transition-transform"} />
              </button>
            </div>
          </div>

          {/* Items panel */}
          {selectedRubro === r.id && (
            <div className="px-4 pb-4 border-t border-white/08">
              <div className="pt-3 flex items-center justify-between mb-3">
                <span className="font-body text-xs text-white/40 uppercase tracking-widest">Ítems / Productos</span>
                <button onClick={() => setEditingItem({ _new: true, rubro_id: r.id, active: true })}
                  className="flex items-center gap-1 font-body text-xs font-semibold text-[#0D4A72] hover:text-white transition-colors">
                  <Plus size={12} /> Agregar ítem
                </button>
              </div>

              {/* New/edit item form */}
              {editingItem && (editingItem._new || editingItem.rubro_id === r.id) && (
                <div className="mb-3 p-3 space-y-2" style={{ background: "rgba(13,74,114,0.15)", border: "1px solid rgba(13,74,114,0.3)", borderRadius: "4px" }}>
                  <input placeholder="Nombre del ítem *" value={editingItem.name || ""} onChange={e => setEditingItem(p => ({ ...p!, name: e.target.value }))} className={inputCls} />
                  <textarea placeholder="Descripción (opcional)" value={editingItem.description || ""} onChange={e => setEditingItem(p => ({ ...p!, description: e.target.value }))} className={inputCls} rows={2} style={{ resize: "none" }} />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingItem(null)} className="font-body text-xs text-white/40 px-3 py-1.5"><X size={12} /></button>
                    <button onClick={saveItem} disabled={saving || !editingItem.name} className="flex items-center gap-1 font-body text-xs font-semibold text-white px-3 py-1.5 disabled:opacity-40" style={{ background: "#0D4A72", borderRadius: "3px" }}>
                      <Check size={12} /> {saving ? "..." : "Guardar"}
                    </button>
                  </div>
                </div>
              )}

              {/* Items list */}
              <div className="space-y-1.5">
                {(items[r.id] || []).length === 0 && !editingItem && (
                  <p className="font-body text-xs text-white/25 py-2">Sin ítems cargados aún.</p>
                )}
                {(items[r.id] || []).map(item => (
                  <div key={item.id} className="flex items-start gap-2 px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                    {editingItem && editingItem.id === item.id ? (
                      <div className="flex-1 space-y-1.5">
                        <input value={editingItem.name || ""} onChange={e => setEditingItem(p => ({ ...p!, name: e.target.value }))} className={inputCls} />
                        <textarea value={editingItem.description || ""} onChange={e => setEditingItem(p => ({ ...p!, description: e.target.value }))} className={inputCls} rows={2} style={{ resize: "none" }} />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingItem(null)} className="font-body text-xs text-white/40 px-2 py-1"><X size={11} /></button>
                          <button onClick={saveItem} disabled={saving} className="font-body text-xs font-semibold text-white px-3 py-1 disabled:opacity-40" style={{ background: "#0D4A72", borderRadius: "3px" }}>
                            {saving ? "..." : "Guardar"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-white/80">{item.name}</p>
                          {item.description && <p className="font-body text-xs text-white/35 line-clamp-1">{item.description}</p>}
                        </div>
                        <button onClick={() => setEditingItem({ ...item })} className="p-1 text-white/30 hover:text-white/70 transition-colors flex-shrink-0"><Pencil size={12} /></button>
                        <button onClick={() => deleteItem(item.id, r.id)} className="p-1 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 size={12} /></button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Edit rubro modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }} onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="w-full max-w-lg p-6 space-y-4" style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-white" style={{ letterSpacing: "0.05em" }}>{editing._new ? "NUEVO RUBRO" : "EDITAR RUBRO"}</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Nombre *</label>
                <input value={editing.name || ""} onChange={e => setEditing(p => ({ ...p!, name: e.target.value, slug: toSlug(e.target.value) }))} className={inputCls} />
              </div>
              <div>
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Slug (URL)</label>
                <input value={editing.slug || ""} onChange={e => setEditing(p => ({ ...p!, slug: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Ícono (emoji)</label>
                <input value={editing.icon || ""} onChange={e => setEditing(p => ({ ...p!, icon: e.target.value }))} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Descripción corta</label>
                <input value={editing.description || ""} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Descripción larga (página del rubro)</label>
                <textarea value={editing.long_description || ""} onChange={e => setEditing(p => ({ ...p!, long_description: e.target.value }))} className={inputCls} rows={4} style={{ resize: "vertical" }} />
              </div>
              <div className="col-span-2">
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">Texto WhatsApp pre-llenado</label>
                <input value={editing.whatsapp_text || ""} onChange={e => setEditing(p => ({ ...p!, whatsapp_text: e.target.value }))} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1 block">URL de imagen (portada)</label>
                <input value={editing.image_url || ""} onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))} placeholder="https://..." className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setEditing(null)} className="font-body text-sm text-white/40 px-4 py-2">Cancelar</button>
              <button onClick={saveRubro} disabled={saving || !editing.name}
                className="font-body font-semibold text-sm text-white px-6 py-2 disabled:opacity-40"
                style={{ background: "#0D4A72", borderRadius: "4px" }}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
