"use client";

import { useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { CONTENT_FIELDS, ContentField } from "@/lib/contentDefaults";
import { supabase } from "@/lib/supabase";

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error || "Error al guardar");
  return json;
}

const GROUPS = ["Header", "Hero", "Rubros", "Nosotros", "Testimonios", "Zonas", "Contacto", "Footer"] as const;
const inputCls = "w-full font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/25 px-3 py-2.5 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm";

export default function ContentTab() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState<(typeof GROUPS)[number]>("Header");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from("site_config").select("key,value").in("key", CONTENT_FIELDS.map(f => f.key));
      const remote = Object.fromEntries((data || []).map((row: { key: string; value: string }) => [row.key, row.value || ""]));
      const defaults = Object.fromEntries(CONTENT_FIELDS.map(field => [field.key, field.value]));
      setValues({ ...defaults, ...remote });
      setLoading(false);
    }
    load();
  }, []);

  const saveField = async (field: ContentField) => {
    setSaving(field.key);
    try {
      await adminPost("upsert_config", {
        data: { key: field.key, label: field.label, value: values[field.key] ?? "" },
      });
      setSaved(field.key);
      setTimeout(() => setSaved(null), 2200);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(null);
    }
  };

  const fields = CONTENT_FIELDS.filter(field => field.group === activeGroup);

  if (loading) return <div className="text-center py-12 font-body text-white/30">Cargando contenido...</div>;

  return (
    <div>
      <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
        {GROUPS.map(group => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className="font-body text-sm font-medium px-4 py-2.5 whitespace-nowrap transition-all"
            style={{
              background: activeGroup === group ? "#0D4A72" : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeGroup === group ? "#0D4A72" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "4px",
              color: activeGroup === group ? "#FFFFFF" : "rgba(255,255,255,0.45)",
            }}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="p-4 mb-5" style={{ background: "rgba(13,74,114,0.12)", border: "1px solid rgba(13,74,114,0.25)", borderRadius: "4px" }}>
        <h3 className="font-body font-semibold text-white text-sm mb-1">Contenido editable del sitio</h3>
        <p className="font-body text-xs text-white/45">
          Los cambios se guardan en Supabase. Usá el símbolo | para separar líneas grandes de títulos, por ejemplo: TEXTO UNO|TEXTO DOS.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map(field => {
          const isSaving = saving === field.key;
          const isSaved = saved === field.key;
          return (
            <div key={field.key} className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
              {field.type === "image" ? (
                <ImageUploader
                  label={field.label}
                  value={values[field.key] || ""}
                  onChange={url => setValues(prev => ({ ...prev, [field.key]: url }))}
                />
              ) : (
                <>
                  <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1.5 block">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className={inputCls}
                      rows={4}
                      style={{ resize: "vertical" }}
                    />
                  ) : (
                    <input
                      value={values[field.key] || ""}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className={inputCls}
                    />
                  )}
                </>
              )}

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => saveField(field)}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 font-body text-xs font-semibold text-white px-4 py-2 disabled:opacity-50"
                  style={{ background: isSaved ? "#10B981" : "#0D4A72", borderRadius: "4px", minWidth: "94px" }}
                >
                  {isSaving ? <RefreshCw size={11} className="animate-spin" /> : isSaved ? <><Check size={11} /> Guardado</> : "Guardar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
