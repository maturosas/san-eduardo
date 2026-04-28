"use client";
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Consulta } from "@/types";
import { Mail, Phone, MapPin, Calendar, ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";

const ESTADOS = {
  nueva: { label: "Nueva", color: "#E07B10", bg: "rgba(224,123,16,0.12)" },
  en_contacto: { label: "En contacto", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  resuelta: { label: "Resuelta", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
};

async function adminPost(action: string, payload: object) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024", action, ...payload }),
  });
  return res.json();
}

export default function ConsultasTab() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todas");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("consultas").select("*").order("created_at", { ascending: false });
    setConsultas((data as Consulta[]) || []);
    setLoaded(true);
    setLoading(false);
  }, []);

  if (!loaded) {
    return (
      <div className="text-center py-16">
        <button onClick={load} className="font-body font-semibold text-sm text-white px-6 py-3" style={{ background: "#0D4A72", borderRadius: "4px" }}>
          Cargar consultas
        </button>
      </div>
    );
  }

  const updateEstado = async (id: string, estado: string) => {
    await adminPost("update_consulta", { id, data: { estado } });
    setConsultas(prev => prev.map(c => c.id === id ? { ...c, estado: estado as Consulta["estado"] } : c));
  };

  const filtered = consultas.filter(c => {
    const matchEstado = filtro === "todas" || c.estado === filtro;
    const q = search.toLowerCase();
    return matchEstado && (!q
      || c.nombre.toLowerCase().includes(q)
      || (c.email?.toLowerCase().includes(q) ?? false)
      || (c.telefono?.toLowerCase().includes(q) ?? false)
      || (c.zona?.toLowerCase().includes(q) ?? false));
  });

  const counts = { nueva: consultas.filter(c => c.estado === "nueva").length, en_contacto: consultas.filter(c => c.estado === "en_contacto").length, resuelta: consultas.filter(c => c.estado === "resuelta").length };

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["nueva", "en_contacto", "resuelta"] as const).map(e => (
          <button key={e} onClick={() => setFiltro(filtro === e ? "todas" : e)}
            className="p-4 text-left transition-all"
            style={{ background: filtro === e ? ESTADOS[e].bg : "rgba(255,255,255,0.04)", border: `1px solid ${filtro === e ? ESTADOS[e].color + "50" : "rgba(255,255,255,0.08)"}`, borderRadius: "4px" }}>
            <div className="font-display text-3xl mb-1" style={{ color: ESTADOS[e].color, letterSpacing: "0.05em" }}>{counts[e]}</div>
            <div className="font-body text-xs text-white/50">{ESTADOS[e].label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o zona..."
          className="w-full font-body text-sm pl-9 pr-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-[#0D4A72] transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px" }}
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading && <div className="text-center py-8 font-body text-white/30">Cargando...</div>}
        {!loading && filtered.length === 0 && <div className="text-center py-8 font-body text-white/30">Sin resultados.</div>}
        {filtered.map(c => (
          <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
              <span className="px-2 py-0.5 font-body text-xs font-semibold flex-shrink-0" style={{ color: ESTADOS[c.estado].color, background: ESTADOS[c.estado].bg, borderRadius: "3px" }}>
                {ESTADOS[c.estado].label}
              </span>
              <span className="flex-1 font-body text-sm font-semibold text-white truncate">{c.nombre}</span>
              {c.zona && <span className="font-body text-xs text-white/35 hidden sm:block">{c.zona}</span>}
              <span className="font-body text-xs text-white/25 hidden md:block flex-shrink-0">{fmtDate(c.created_at)}</span>
              {expandedId === c.id ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/30" />}
            </div>
            {expandedId === c.id && (
              <div className="px-4 pb-4 border-t border-white/06">
                <div className="pt-4 grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    {c.email && (
                      <div className="flex items-center gap-2 font-body text-sm text-white/60">
                        <Mail size={12} style={{ color: "#E07B10" }} />
                        <a href={`mailto:${c.email}`} className="hover:text-[#E07B10] transition-colors">{c.email}</a>
                      </div>
                    )}
                    {c.telefono && (
                      <div className="flex items-center gap-2 font-body text-sm text-white/60">
                        <Phone size={12} style={{ color: "#E07B10" }} />
                        <a href={`tel:${c.telefono}`} className="hover:text-[#E07B10] transition-colors">{c.telefono}</a>
                      </div>
                    )}
                    {c.zona && <div className="flex items-center gap-2 font-body text-sm text-white/60"><MapPin size={12} style={{ color: "#E07B10" }} />{c.zona}</div>}
                    <div className="flex items-center gap-2 font-body text-xs text-white/35"><Calendar size={11} />{fmtDate(c.created_at)}</div>
                  </div>
                  <div>
                    <div className="font-body text-xs text-white/30 uppercase tracking-widest mb-2">Mensaje</div>
                    <p className="font-body text-sm text-white/65 leading-relaxed">{c.mensaje}</p>
                    {c.presupuesto_items && (() => {
                      try {
                        const items = JSON.parse(c.presupuesto_items);
                        if (!items?.length) return null;
                        const total = items.reduce((a: number, i: {precio?: number; cantidad?: number}) => a + ((i.precio || 0) * (i.cantidad || 1)), 0);
                        return (
                          <div className="mt-3">
                            <div className="font-body text-xs text-white/30 uppercase tracking-widest mb-2">Productos solicitados</div>
                            <div className="space-y-1.5">
                              {items.map((item: {nombre: string; rubro: string; cantidad: number; precio?: number}, idx: number) => (
                                <div key={idx} className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(13,74,114,0.25)", borderRadius: "3px" }}>
                                  <div>
                                    <span className="font-body text-xs font-semibold text-white/80">{item.nombre}</span>
                                    <span className="font-body text-xs text-white/35 ml-2">{item.rubro}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-body text-xs text-white/50">×{item.cantidad}</span>
                                    {item.precio ? <span className="font-body text-xs font-semibold" style={{ color: "#E07B10" }}>${(item.precio * item.cantidad).toLocaleString("es-AR")}</span> : null}
                                  </div>
                                </div>
                              ))}
                              {total > 0 && (
                                <div className="flex justify-between px-3 pt-1">
                                  <span className="font-body text-xs text-white/35">Total estimado</span>
                                  <span className="font-body text-sm font-bold" style={{ color: "#E07B10" }}>${total.toLocaleString("es-AR")}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } catch { return null; }
                    })()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/06 items-center">
                  <span className="font-body text-xs text-white/30 mr-1">Estado:</span>
                  {(["nueva", "en_contacto", "resuelta"] as const).map(e => (
                    <button key={e} onClick={() => updateEstado(c.id, e)} disabled={c.estado === e}
                      className="px-3 py-1 font-body text-xs font-semibold transition-all disabled:opacity-40"
                      style={{ color: ESTADOS[e].color, background: c.estado === e ? ESTADOS[e].bg : "transparent", border: `1px solid ${ESTADOS[e].color}40`, borderRadius: "3px" }}>
                      {ESTADOS[e].label}
                    </button>
                  ))}
                  {c.telefono && (
                    <a href={`https://api.whatsapp.com/send?phone=54${c.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1.5 px-3 py-1 font-body text-xs font-semibold text-white"
                      style={{ background: "#25D366", borderRadius: "3px" }}>
                      <MessageCircle size={11} /> WA
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
