"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiteConfig } from "@/types";
import { Check, RefreshCw } from "lucide-react";

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  return res.json();
}

export default function ConfigTab() {
  const [config, setConfig] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("site_config").select("*").order("key");
    setConfig((data as SiteConfig[]) || []);
    setLoading(false);
  }

  const updateLocal = (key: string, value: string) => {
    setConfig(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  const saveKey = async (item: SiteConfig) => {
    setSaving(item.key);
    await adminPost("upsert_config", { data: { key: item.key, label: item.label, value: item.value } });
    setSaving(null);
    setSaved(item.key);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) return <div className="text-center py-12 font-body text-white/30">Cargando configuración...</div>;

  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-white/40 mb-5">
        Editá los textos y datos de contacto del sitio. Los cambios se reflejan en el sitio al guardar.
      </p>

      {config.map(item => (
        <div key={item.key} className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
          <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
            {item.label || item.key}
          </label>
          <div className="flex gap-2">
            {item.value && item.value.length > 80 ? (
              <textarea
                value={item.value}
                onChange={e => updateLocal(item.key, e.target.value)}
                rows={3}
                className="flex-1 font-body text-sm bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm"
                style={{ resize: "vertical" }}
              />
            ) : (
              <input
                value={item.value || ""}
                onChange={e => updateLocal(item.key, e.target.value)}
                className="flex-1 font-body text-sm bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm"
              />
            )}
            <button
              onClick={() => saveKey(item)}
              disabled={saving === item.key}
              className="flex items-center gap-1.5 font-body text-xs font-semibold text-white px-4 py-2 flex-shrink-0 transition-all disabled:opacity-50"
              style={{
                background: saved === item.key ? "#10B981" : "#0D4A72",
                borderRadius: "4px",
                minWidth: "90px",
              }}
            >
              {saving === item.key ? <RefreshCw size={12} className="animate-spin" /> : saved === item.key ? <><Check size={12} /> Guardado</> : "Guardar"}
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4" style={{ background: "rgba(13,74,114,0.1)", border: "1px solid rgba(13,74,114,0.2)", borderRadius: "4px" }}>
        <p className="font-body text-xs text-white/40">
          <strong className="text-white/60">Nota:</strong> Para cambiar imágenes del hero o logo, editá los campos de URL de imagen en la sección Rubros o contactá a tu desarrollador. Próximamente: subida directa de imágenes.
        </p>
      </div>
    </div>
  );
}
