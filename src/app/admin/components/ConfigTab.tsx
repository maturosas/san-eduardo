"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiteConfig } from "@/types";
import { Check, RefreshCw, BarChart3, Settings2, Eye, EyeOff, Share2 } from "lucide-react";

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  return res.json();
}

const ANALYTICS_KEYS = ["analytics_ga4_id", "analytics_meta_pixel_id", "analytics_clarity_id"];
const OG_KEYS = ["og_title", "og_description", "og_image_url"];

const ANALYTICS_HELP: Record<string, { label: string; placeholder: string; help: string }> = {
  analytics_ga4_id: {
    label: "Google Analytics 4 · Measurement ID",
    placeholder: "G-XXXXXXXXXX",
    help: "Encontralo en GA4 → Admin → Flujo de datos → tu sitio",
  },
  analytics_meta_pixel_id: {
    label: "Meta Pixel · ID",
    placeholder: "123456789012345",
    help: "Encontralo en Meta Business Suite → Pixels → tu pixel",
  },
  analytics_clarity_id: {
    label: "Microsoft Clarity · Project ID",
    placeholder: "abcdefghij",
    help: "Encontralo en clarity.microsoft.com → tu proyecto → Setup",
  },
};

export default function ConfigTab() {
  const [config, setConfig] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<"general" | "og" | "analytics">("general");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("site_config").select("*").order("key");
    setConfig((data as SiteConfig[]) || []);
    setLoading(false);
  }

  const updateLocal = (key: string, value: string) =>
    setConfig(prev => prev.map(c => c.key === key ? { ...c, value } : c));

  const saveKey = async (item: SiteConfig) => {
    setSaving(item.key);
    await adminPost("upsert_config", { data: { key: item.key, label: item.label, value: item.value } });
    setSaving(null);
    setSaved(item.key);
    setTimeout(() => setSaved(null), 2500);
  };

  const generalConfig = config.filter(c => !ANALYTICS_KEYS.includes(c.key) && !OG_KEYS.includes(c.key));
  const analyticsConfig = config.filter(c => ANALYTICS_KEYS.includes(c.key));

  if (loading) return <div className="text-center py-12 font-body text-white/30">Cargando configuración...</div>;

  const renderField = (item: SiteConfig, isAnalytics = false) => {
    const isVisible = showKeys[item.key] ?? !isAnalytics;
    const isSaving = saving === item.key;
    const isSaved = saved === item.key;
    const meta = ANALYTICS_HELP[item.key];
    const isLong = !isAnalytics && item.value && item.value.length > 80;

    return (
      <div key={item.key} className="p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
        <div className="flex items-start justify-between mb-2">
          <label className="font-body text-xs text-white/40 uppercase tracking-widest">
            {meta?.label || item.label || item.key}
          </label>
          {isAnalytics && (
            <button onClick={() => setShowKeys(p => ({ ...p, [item.key]: !isVisible }))} className="text-white/30 hover:text-white transition-colors">
              {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          )}
        </div>
        {meta?.help && (
          <p className="font-body text-xs text-white/25 mb-2">{meta.help}</p>
        )}
        <div className="flex gap-2">
          {isLong ? (
            <textarea
              value={item.value || ""}
              onChange={e => updateLocal(item.key, e.target.value)}
              rows={3}
              className="flex-1 font-body text-sm bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm"
              style={{ resize: "vertical" }}
            />
          ) : (
            <input
              type={isAnalytics && !isVisible ? "password" : "text"}
              value={item.value || ""}
              onChange={e => updateLocal(item.key, e.target.value)}
              placeholder={meta?.placeholder || ""}
              className="flex-1 font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm"
            />
          )}
          <button
            onClick={() => saveKey(item)}
            disabled={isSaving}
            className="flex items-center gap-1.5 font-body text-xs font-semibold text-white px-4 py-2 flex-shrink-0 disabled:opacity-50 transition-all"
            style={{ background: isSaved ? "#10B981" : "#0D4A72", borderRadius: "4px", minWidth: "90px" }}
          >
            {isSaving ? <RefreshCw size={11} className="animate-spin" /> : isSaved ? <><Check size={11} /> Guardado</> : "Guardar"}
          </button>
        </div>
        {isAnalytics && item.value && (
          <p className="font-body text-xs mt-1.5" style={{ color: "#10B981" }}>
            ✓ Activo — se carga automáticamente en el sitio
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Section tabs */}
      <div className="flex gap-2 mb-7">
        {[
          { id: "general" as const, label: "Textos del sitio", icon: Settings2 },
          { id: "og" as const, label: "Compartir en redes", icon: Share2 },
          { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="flex items-center gap-2 font-body text-sm font-medium px-5 py-2.5 transition-all"
            style={{
              background: activeSection === s.id ? "#0D4A72" : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeSection === s.id ? "#0D4A72" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "4px",
              color: activeSection === s.id ? "#FFFFFF" : "rgba(255,255,255,0.45)",
            }}
          >
            <s.icon size={14} />
            {s.label}
          </button>
        ))}
      </div>

      {/* General config */}
      {activeSection === "general" && (
        <div className="space-y-3">
          <p className="font-body text-sm text-white/35 mb-5">
            Editá los textos del sitio. Los cambios se reflejan automáticamente.
          </p>
          {generalConfig.map(item => renderField(item, false))}
        </div>
      )}

      {/* OG / Social snippet config */}
      {activeSection === "og" && (
        <div className="space-y-4">
          <div className="p-4 mb-2" style={{ background: "rgba(13,74,114,0.12)", border: "1px solid rgba(13,74,114,0.25)", borderRadius: "4px" }}>
            <h3 className="font-body font-semibold text-white text-sm mb-1">Snippet al compartir el link</h3>
            <p className="font-body text-xs text-white/45">
              Esto controla qué título, descripción e imagen aparecen cuando alguien comparte el link por WhatsApp, LinkedIn o Twitter.
            </p>
          </div>
          {OG_KEYS.map(key => {
            const item = config.find(c => c.key === key);
            if (!item) return null;
            return renderField(item, false);
          })}
          {/* Preview */}
          {(() => {
            const title = config.find(c => c.key === "og_title")?.value || "";
            const desc = config.find(c => c.key === "og_description")?.value || "";
            const img = config.find(c => c.key === "og_image_url")?.value || "";
            if (!title && !desc) return null;
            return (
              <div>
                <p className="font-body text-xs text-white/30 uppercase tracking-widest mb-3">Preview del snippet</p>
                <div style={{ background: "#F4F8FC", borderRadius: "8px", overflow: "hidden", maxWidth: "400px" }}>
                  {img && <div style={{ background: "#E8EFF6", height: "160px", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>}
                  <div className="p-3">
                    <p className="font-body text-xs text-[#9DAEBF] mb-1">saneduardodesign.com.ar</p>
                    <p className="font-body text-sm font-semibold text-[#0D2A3D] leading-snug">{title}</p>
                    <p className="font-body text-xs text-[#5A6A7E] mt-1 line-clamp-2">{desc}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Analytics config */}
      {activeSection === "analytics" && (
        <div className="space-y-4">
          <div className="p-4 mb-5" style={{ background: "rgba(13,74,114,0.12)", border: "1px solid rgba(13,74,114,0.25)", borderRadius: "4px" }}>
            <h3 className="font-body font-semibold text-white text-sm mb-1">Pegá tus claves de tracking</h3>
            <p className="font-body text-xs text-white/45">
              Sin tocar código. Las claves se cargan automáticamente en el sitio público. Dejá en blanco los servicios que no usés.
            </p>
          </div>

          {analyticsConfig.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-body text-white/30 text-sm mb-4">No hay claves de analytics configuradas aún.</p>
              <p className="font-body text-xs text-white/20">
                Ejecutá el SQL de seed en Supabase para agregar los campos.
              </p>
              <pre className="mt-4 p-4 text-left text-xs text-white/40 overflow-x-auto" style={{ background: "rgba(255,255,255,0.04)", borderRadius: "4px" }}>
{`INSERT INTO site_config (key, label, value) VALUES
('analytics_ga4_id','Google Analytics 4 · Measurement ID',''),
('analytics_meta_pixel_id','Meta Pixel · ID',''),
('analytics_clarity_id','Microsoft Clarity · Project ID','')
ON CONFLICT (key) DO NOTHING;`}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              {ANALYTICS_KEYS.map(key => {
                const item = analyticsConfig.find(c => c.key === key);
                if (!item) return null;
                return renderField(item, true);
              })}
            </div>
          )}

          <div className="mt-6 p-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
            <p className="font-body text-xs font-semibold text-white/50 uppercase tracking-widest">Cómo verificar</p>
            <p className="font-body text-xs text-white/30">
              GA4: abrí el sitio → devtools → Network → buscá &quot;gtag&quot; o &quot;google-analytics&quot;
            </p>
            <p className="font-body text-xs text-white/30">
              Meta Pixel: instalá &quot;Meta Pixel Helper&quot; en Chrome y verificá en el sitio
            </p>
            <p className="font-body text-xs text-white/30">
              Clarity: entrá a clarity.microsoft.com → tu proyecto → debería verse tráfico en 24–48hs
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
