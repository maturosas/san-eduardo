"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Rubro, RubroItem } from "@/types";
import { Plus, Pencil, Trash2, X, Check, ChevronRight, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error || "Error al guardar");
  }
  return json;
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
    try {
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar rubro");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (r: Rubro) => {
    await adminPost("upsert_rubro", { id: r.id, data: { active: !r.active } });
    setRubros(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x));
  };

  const saveItem = async () => {
    if (!editingItem || !selectedRubro) return;
    setSaving(true);
    try {
      await adminPost("upsert_rubro_item", {
        id: editingItem._new ? undefined : editingItem.id,
      data: {
        rubro_id: selectedRubro,
        name: editingItem.name,
        slug: editingItem.slug || toSlug(editingItem.name || ""),
        description: editingItem.description || "",
        long_description: editingItem.long_description || "",
        seo_title: editingItem.seo_title || "",
        meta_description: editingItem.meta_description || "",
        price: editingItem.price ?? null,
        promo_price: editingItem.promo_price ?? null,
        image_url: editingItem.image_url || null,
          badge: editingItem.badge || "En construcción",
          active: editingItem.active ?? true,
          orden: editingItem.orden ?? 99,
        },
      });
      setEditingItem(null);
      const { data } = await supabase.from("rubro_items").select("*").eq("rubro_id", selectedRubro).order("orden");
      setItems(prev => ({ ...prev, [selectedRubro]: (data as RubroItem[]) || [] }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar producto");
    } finally {
      setSaving(false);
    }
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
                <ItemForm
                  item={editingItem}
                  saving={saving}
                  onChange={setEditingItem}
                  onSave={saveItem}
                  onCancel={() => setEditingItem(null)}
                  inputCls={inputCls}
                />
              )}

              {/* Items list */}
              <div className="space-y-2">
                {(items[r.id] || []).length === 0 && !editingItem && (
                  <p className="font-body text-xs text-white/25 py-2">Sin productos cargados aún. Agregá el primero.</p>
                )}
                {(items[r.id] || []).map(item => (
                  <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                    {editingItem && editingItem.id === item.id ? (
                      <div className="p-3">
                        <ItemForm
                          item={editingItem}
                          saving={saving}
                          onChange={setEditingItem}
                          onSave={saveItem}
                          onCancel={() => setEditingItem(null)}
                          inputCls={inputCls}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        {/* Thumb */}
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover flex-shrink-0" style={{ borderRadius: "3px" }} />
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                            <span className="text-white/20 text-xs">SE</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-body text-sm text-white/80 truncate">{item.name}</p>
                            <span className="font-body text-xs px-1.5 py-0.5 flex-shrink-0" style={{ background: "rgba(13,74,114,0.3)", color: "#9DAEBF", borderRadius: "3px" }}>
                              {item.badge || "En construcción"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            {item.promo_price ? (
                              <span className="font-body text-xs font-semibold" style={{ color: "#C41E2A" }}>
                                ${item.promo_price.toLocaleString("es-AR")}
                                {item.price && <span className="line-through ml-1 text-white/30">${item.price.toLocaleString("es-AR")}</span>}
                              </span>
                            ) : item.price ? (
                              <span className="font-body text-xs font-semibold text-white/60">${item.price.toLocaleString("es-AR")}</span>
                            ) : (
                              <span className="font-body text-xs text-white/25">Sin precio</span>
                            )}
                            {item.description && <span className="font-body text-xs text-white/25 truncate">{item.description}</span>}
                          </div>
                        </div>
                        <button onClick={() => setEditingItem({ ...item })} className="p-1.5 text-white/30 hover:text-white transition-colors"><Pencil size={12} /></button>
                        <button onClick={() => deleteItem(item.id, r.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                      </div>
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
                <ImageUploader
                  label="Imagen de portada"
                  value={editing.image_url || ""}
                  onChange={url => setEditing(p => ({ ...p!, image_url: url }))}
                />
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

const BADGES = ["En construcción", "Disponible", "Más usado", "Más conveniente", "Nuevo", "Oferta", "Sin stock", "Consultar precio"];

function ItemForm({
  item, saving, onChange, onSave, onCancel, inputCls
}: {
  item: EditingItem;
  saving: boolean;
  onChange: React.Dispatch<React.SetStateAction<EditingItem | null>>;
  onSave: () => void;
  onCancel: () => void;
  inputCls: string;
}) {
  return (
    <div className="space-y-2 p-3" style={{ background: "rgba(13,74,114,0.15)", border: "1px solid rgba(13,74,114,0.3)", borderRadius: "4px" }}>
      {/* Row 1: nombre + badge */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            placeholder="Nombre del producto *"
            value={item.name || ""}
            onChange={e => {
              const v = e.target.value;
              onChange(p => p ? { ...p, name: v, slug: p.slug || toSlug(v) } : p);
            }}
            className={inputCls}
          />
          <label className="font-body text-xs text-white/35 mt-2 mb-1 block">URL del producto</label>
          <input
            placeholder="ej: porcelanato-simil-madera"
            value={item.slug || ""}
            onChange={e => { const v = toSlug(e.target.value); onChange(p => p ? { ...p, slug: v } : p); }}
            className={inputCls}
          />
          {item.slug && (
            <p className="font-body text-xs text-white/25 mt-1">/productos/{item.slug}</p>
          )}
        </div>
        <select
          value={item.badge || "En construcción"}
          onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, badge: v } : p); }}
          className={inputCls}
        >
          {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Row 2: descripción */}
      <textarea
        placeholder="Descripción corta para cards y resumen SEO"
        value={item.description || ""}
        onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, description: v } : p); }}
        className={inputCls}
        rows={2}
        style={{ resize: "none" }}
      />

      <textarea
        placeholder="Descripción larga para la página del producto"
        value={item.long_description || ""}
        onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, long_description: v } : p); }}
        className={inputCls}
        rows={4}
        style={{ resize: "vertical" }}
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Título SEO</label>
          <input
            placeholder="Ej: Porcellanato en Temperley | San Eduardo"
            value={item.seo_title || ""}
            onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, seo_title: v } : p); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Meta descripción</label>
          <textarea
            placeholder="Texto para Google, ideal 140-160 caracteres"
            value={item.meta_description || ""}
            onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, meta_description: v } : p); }}
            className={inputCls}
            rows={2}
            style={{ resize: "none" }}
          />
          <p className="font-body text-xs text-white/25 mt-1">{(item.meta_description || "").length}/160</p>
        </div>
      </div>

      {/* Row 3: precios */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Precio ($)</label>
          <input
            type="number"
            placeholder="Ej: 15000"
            value={item.price ?? ""}
            onChange={e => { const v = e.target.value ? Number(e.target.value) : null; onChange(p => p ? { ...p, price: v } : p); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Precio promo ($) — opcional</label>
          <input
            type="number"
            placeholder="Ej: 12000"
            value={item.promo_price ?? ""}
            onChange={e => { const v = e.target.value ? Number(e.target.value) : null; onChange(p => p ? { ...p, promo_price: v } : p); }}
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 4: imagen */}
      <ImageUploader
        value={item.image_url || ""}
        onChange={url => onChange(p => p ? { ...p, image_url: url } : p)}
        label="Imagen del producto"
      />

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="font-body text-xs text-white/40 px-3 py-1.5">
          <X size={12} />
        </button>
        <button
          onClick={onSave}
          disabled={saving || !item.name}
          className="flex items-center gap-1 font-body text-xs font-semibold text-white px-4 py-1.5 disabled:opacity-40"
          style={{ background: "#0D4A72", borderRadius: "3px" }}
        >
          <Check size={12} /> {saving ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </div>
  );
}
