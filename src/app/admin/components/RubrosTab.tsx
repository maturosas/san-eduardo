"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Rubro, RubroItem } from "@/types";
import { Plus, Pencil, Trash2, X, Check, ChevronRight, Eye, EyeOff, Upload, Download, Copy } from "lucide-react";
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

const PRODUCT_CSV_COLUMNS = [
  "id",
  "rubro_id",
  "rubro_slug",
  "rubro_name",
  "name",
  "slug",
  "description",
  "long_description",
  "seo_title",
  "meta_description",
  "price",
  "promo_price",
  "stock",
  "image_url",
  "badge",
  "active",
  "orden",
];

function csvEscape(value: unknown) {
  const str = value === null || value === undefined ? "" : String(value);
  return /[",\n\r;]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function buildCsv(rows: Record<string, unknown>[]) {
  return [
    PRODUCT_CSV_COLUMNS.join(","),
    ...rows.map(row => PRODUCT_CSV_COLUMNS.map(col => csvEscape(row[col])).join(",")),
  ].join("\n");
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if ((char === "," || char === ";") && !quoted) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}

function csvNumber(value: unknown) {
  const str = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  if (!str) return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

function csvBoolean(value: unknown) {
  const str = String(value ?? "").trim().toLowerCase();
  if (!str) return true;
  return ["1", "true", "si", "sí", "yes", "activo", "active"].includes(str);
}

export default function RubrosTab() {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [items, setItems] = useState<Record<string, RubroItem[]>>({});
  const [selectedRubro, setSelectedRubro] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingRubro | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [importingRubro, setImportingRubro] = useState<string | null>(null);
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

  async function loadItems(rubroId: string, force = false) {
    if (items[rubroId] && !force) return;
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
        stock: editingItem.stock ?? null,
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
    try {
      await adminPost("delete_rubro_item", { id });
      await loadItems(rubroId, true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo borrar el producto");
    }
  };

  const duplicateItem = (item: RubroItem) => {
    setEditingItem({
      ...item,
      _new: true,
      id: undefined,
      name: `${item.name} copia`,
      slug: `${item.slug || toSlug(item.name)}-copia`,
      orden: (item.orden ?? 99) + 1,
    });
  };

  const exportItems = async (r: Rubro) => {
    const { data, error } = await supabase.from("rubro_items").select("*").eq("rubro_id", r.id).order("orden");
    if (error) {
      alert(error.message);
      return;
    }
    const rows = ((data as RubroItem[]) || []).map(item => ({
      id: item.id,
      rubro_id: r.id,
      rubro_slug: r.slug,
      rubro_name: r.name,
      name: item.name,
      slug: item.slug || "",
      description: item.description || "",
      long_description: item.long_description || "",
      seo_title: item.seo_title || "",
      meta_description: item.meta_description || "",
      price: item.price ?? "",
      promo_price: item.promo_price ?? "",
      stock: item.stock ?? "",
      image_url: item.image_url || "",
      badge: item.badge || "Disponible",
      active: item.active ? "true" : "false",
      orden: item.orden ?? 99,
    }));

    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `productos-${r.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importItems = async (file: File, r: Rubro) => {
    setImportingRubro(r.id);
    try {
      const text = await file.text();
      const rows = parseCsv(text).map(row => ({
        id: String(row.id || "").trim() || undefined,
        rubro_id: r.id,
        name: String(row.name || "").trim(),
        slug: toSlug(String(row.slug || row.name || "")),
        description: String(row.description || ""),
        long_description: String(row.long_description || ""),
        seo_title: String(row.seo_title || ""),
        meta_description: String(row.meta_description || ""),
        price: csvNumber(row.price),
        promo_price: csvNumber(row.promo_price),
        stock: csvNumber(row.stock),
        image_url: String(row.image_url || "").trim() || null,
        badge: String(row.badge || "Disponible").trim(),
        active: csvBoolean(row.active),
        orden: csvNumber(row.orden) ?? 99,
      })).filter(row => row.name);

      if (rows.length === 0) {
        alert("El CSV no tiene productos válidos. Revisá que tenga una columna name.");
        return;
      }

      const result = await adminPost("bulk_upsert_rubro_items", { rubro_id: r.id, data: { rows } });
      await loadItems(r.id, true);
      alert(`Importación lista: ${result.inserted || 0} nuevos, ${result.updated || 0} actualizados.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo importar el CSV");
    } finally {
      setImportingRubro(null);
    }
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
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button onClick={() => exportItems(r)}
                    className="flex items-center gap-1 font-body text-xs font-semibold text-white/45 hover:text-white transition-colors">
                    <Download size={12} /> Exportar CSV
                  </button>
                  <label className="flex items-center gap-1 font-body text-xs font-semibold text-white/45 hover:text-white transition-colors cursor-pointer">
                    <Upload size={12} /> {importingRubro === r.id ? "Importando..." : "Importar CSV"}
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      disabled={importingRubro === r.id}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) importItems(file, r);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button onClick={() => setEditingItem({ _new: true, rubro_id: r.id, active: true })}
                    className="flex items-center gap-1 font-body text-xs font-semibold text-[#0D4A72] hover:text-white transition-colors">
                    <Plus size={12} /> Agregar ítem
                  </button>
                </div>
              </div>
              <p className="font-body text-xs text-white/25 mb-3">
                Podés exportar esta categoría, editar precios, promo, stock, imágenes y SEO en CSV, y volver a importarla. Si dejás el id, actualiza; si no hay id, usa el slug para actualizar o crea uno nuevo.
              </p>

              {/* Items list */}
              <div className="space-y-2">
                {(items[r.id] || []).length === 0 && !editingItem && (
                  <p className="font-body text-xs text-white/25 py-2">Sin productos cargados aún. Agregá el primero.</p>
                )}
                {(items[r.id] || []).map(item => (
                  <ProductRow
                    key={item.id}
                    item={item}
                    active={editingItem?.id === item.id}
                    onEdit={() => setEditingItem({ ...item })}
                    onDuplicate={() => duplicateItem(item)}
                    onDelete={() => deleteItem(item.id, r.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {editingItem && selectedRubro && (
        <ProductEditorPanel
          item={editingItem}
          rubroName={rubros.find(r => r.id === selectedRubro)?.name || "Producto"}
          saving={saving}
          onChange={setEditingItem}
          onSave={saveItem}
          onCancel={() => setEditingItem(null)}
          inputCls={inputCls}
        />
      )}

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

function ProductRow({
  item,
  active,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  item: RubroItem;
  active: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-3 transition-colors"
      style={{
        background: active ? "rgba(13,74,114,0.22)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(13,74,114,0.55)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "6px",
      }}
    >
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover flex-shrink-0" style={{ borderRadius: "5px" }} />
      ) : (
        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "5px" }}>
          <span className="text-white/20 text-xs">SE</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-body text-sm font-semibold text-white/85 truncate">{item.name}</p>
          <span className="font-body text-xs px-1.5 py-0.5 flex-shrink-0" style={{ background: "rgba(13,74,114,0.32)", color: "#9DAEBF", borderRadius: "3px" }}>
            {item.badge || "En construcción"}
          </span>
          {!item.active && (
            <span className="font-body text-xs px-1.5 py-0.5 text-white/35" style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "3px" }}>
              Oculto
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
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
          {item.stock !== null && item.stock !== undefined && (
            <span className="font-body text-xs text-white/35">Stock: {item.stock}</span>
          )}
          {item.slug && <span className="font-body text-xs text-white/25">/productos/{item.slug}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={onEdit} className="p-2 text-white/35 hover:text-white transition-colors" title="Editar producto">
          <Pencil size={14} />
        </button>
        <button onClick={onDuplicate} className="p-2 text-white/35 hover:text-white transition-colors" title="Duplicar producto">
          <Copy size={14} />
        </button>
        <button onClick={onDelete} className="p-2 text-white/35 hover:text-red-400 transition-colors" title="Borrar producto">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function ProductEditorPanel({
  item,
  rubroName,
  saving,
  onChange,
  onSave,
  onCancel,
  inputCls,
}: {
  item: EditingItem;
  rubroName: string;
  saving: boolean;
  onChange: React.Dispatch<React.SetStateAction<EditingItem | null>>;
  onSave: () => void;
  onCancel: () => void;
  inputCls: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.45)" }} onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <aside className="h-full w-full max-w-2xl overflow-y-auto" style={{ background: "#0A1628", borderLeft: "1px solid rgba(255,255,255,0.12)", boxShadow: "-24px 0 60px rgba(0,0,0,0.35)" }}>
        <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between" style={{ background: "#060E1A", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <p className="font-body text-xs text-white/35 uppercase tracking-widest">{rubroName}</p>
            <h3 className="font-display text-2xl text-white" style={{ letterSpacing: "0.05em" }}>
              {item._new ? "NUEVO PRODUCTO" : "EDITAR PRODUCTO"}
            </h3>
          </div>
          <button onClick={onCancel} className="text-white/40 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <ItemForm
            item={item}
            saving={saving}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
            inputCls={inputCls}
          />
        </div>
      </aside>
    </div>
  );
}

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
    <div className="space-y-5">
      <section className="p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }}>
        <div>
          <p className="font-body text-xs text-white/35 uppercase tracking-widest">Datos básicos</p>
          <p className="font-body text-xs text-white/20 mt-0.5">Nombre, estado visible y URL pública del producto.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Nombre del producto *</label>
          <input
            placeholder="Ej: Cemento Loma Negra"
            value={item.name || ""}
            onChange={e => {
              const v = e.target.value;
              onChange(p => p ? { ...p, name: v, slug: p.slug || toSlug(v) } : p);
            }}
            className={inputCls}
          />
        </div>
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Estado comercial</label>
          <select
            value={item.badge || "En construcción"}
            onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, badge: v } : p); }}
            className={inputCls}
          >
            {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="font-body text-xs text-white/35 mb-1 block">URL del producto</label>
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
      </div>
      </section>

      <section className="p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }}>
        <div>
          <p className="font-body text-xs text-white/35 uppercase tracking-widest">Descripción</p>
          <p className="font-body text-xs text-white/20 mt-0.5">La corta aparece en cards. La larga aparece en la página del producto.</p>
        </div>
        <textarea
          placeholder="Descripción corta para cards y resumen SEO"
          value={item.description || ""}
          onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, description: v } : p); }}
          className={inputCls}
          rows={3}
          style={{ resize: "vertical" }}
        />

        <textarea
          placeholder="Descripción larga para la página del producto"
          value={item.long_description || ""}
          onChange={e => { const v = e.target.value; onChange(p => p ? { ...p, long_description: v } : p); }}
          className={inputCls}
          rows={5}
          style={{ resize: "vertical" }}
        />
      </section>

      <section className="p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }}>
        <div>
          <p className="font-body text-xs text-white/35 uppercase tracking-widest">Precio y stock</p>
          <p className="font-body text-xs text-white/20 mt-0.5">Dejá vacío si preferís mostrar “consultar precio”.</p>
        </div>
      <div className="grid sm:grid-cols-3 gap-3">
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
        <div>
          <label className="font-body text-xs text-white/35 mb-1 block">Stock</label>
          <input
            type="number"
            placeholder="Ej: 25"
            value={item.stock ?? ""}
            onChange={e => { const v = e.target.value ? Number(e.target.value) : null; onChange(p => p ? { ...p, stock: v } : p); }}
            className={inputCls}
          />
        </div>
      </div>
      </section>

      <section className="p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }}>
        <div>
          <p className="font-body text-xs text-white/35 uppercase tracking-widest">Imagen</p>
          <p className="font-body text-xs text-white/20 mt-0.5">Recomendado: cuadrada 1:1, mínimo 800x800. Se recorta sin deformarse.</p>
        </div>
        <ImageUploader
          value={item.image_url || ""}
          onChange={url => onChange(p => p ? { ...p, image_url: url } : p)}
          label="Imagen del producto"
          squarePreview
        />
      </section>

      <details className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px" }}>
        <summary className="font-body text-xs text-white/45 uppercase tracking-widest cursor-pointer">SEO avanzado</summary>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
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
              rows={3}
              style={{ resize: "vertical" }}
            />
            <p className="font-body text-xs text-white/25 mt-1">{(item.meta_description || "").length}/160</p>
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="sticky bottom-0 flex gap-2 justify-end p-4 -mx-5 -mb-5" style={{ background: "#060E1A", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onCancel} className="font-body text-sm text-white/45 px-4 py-2 hover:text-white">
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={saving || !item.name}
          className="flex items-center gap-2 font-body text-sm font-semibold text-white px-5 py-2.5 disabled:opacity-40"
          style={{ background: "#0D4A72", borderRadius: "4px" }}
        >
          <Check size={14} /> {saving ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </div>
  );
}
