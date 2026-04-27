"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  MessageSquare, CheckCircle, Clock, AlertCircle,
  RefreshCw, LogOut, Phone, Mail, MapPin, Calendar,
  ChevronDown, ChevronUp, Search
} from "lucide-react";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

type Consulta = {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string;
  zona: string | null;
  mensaje: string;
  estado: "nueva" | "en_contacto" | "resuelta";
  created_at: string;
};

const ESTADOS = {
  nueva: { label: "Nueva", color: "#E07B10", bg: "rgba(224,123,16,0.1)" },
  en_contacto: { label: "En contacto", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  resuelta: { label: "Resuelta", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
};

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(false);

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const ok = sessionStorage.getItem("se_admin");
    if (ok === "1") setAuth(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem("se_admin", "1");
      setAuth(true);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("se_admin");
    setAuth(false);
  };

  const loadConsultas = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();
    const { data } = await supabase
      .from("consultas")
      .select("*")
      .order("created_at", { ascending: false });
    setConsultas((data as Consulta[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth) loadConsultas();
  }, [auth, loadConsultas]);

  const updateEstado = async (id: string, estado: Consulta["estado"]) => {
    const supabase = getSupabase();
    await supabase.from("consultas").update({ estado }).eq("id", id);
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado } : c))
    );
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filtered = consultas.filter((c) => {
    const matchEstado = filtroEstado === "todas" || c.estado === filtroEstado;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.zona?.toLowerCase().includes(q) ?? false);
    return matchEstado && matchSearch;
  });

  const counts = {
    nueva: consultas.filter((c) => c.estado === "nueva").length,
    en_contacto: consultas.filter((c) => c.estado === "en_contacto").length,
    resuelta: consultas.filter((c) => c.estado === "resuelta").length,
  };

  /* Login screen */
  if (!auth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#111110" }}
      >
        <div
          className="w-full max-w-sm p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "2px",
          }}
        >
          <div className="mb-8 text-center">
            <div
              className="font-display text-white tracking-widest mb-1"
              style={{ fontSize: "22px", letterSpacing: "0.15em" }}
            >
              SAN EDUARDO
            </div>
            <div
              className="font-body text-[#E07B10] font-semibold uppercase tracking-[0.3em]"
              style={{ fontSize: "9px" }}
            >
              PANEL INTERNO
            </div>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Contraseña
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className={`w-full font-body text-sm bg-white/5 border text-white placeholder-white/20 px-4 py-3 focus:outline-none focus:border-[#E07B10] transition-colors ${
                  passError ? "border-red-500" : "border-white/10"
                }`}
                style={{ borderRadius: "2px" }}
                autoFocus
              />
              {passError && (
                <p className="font-body text-xs text-red-400 mt-1">Contraseña incorrecta</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 font-body font-semibold text-sm text-white"
              style={{ background: "#E07B10", borderRadius: "2px" }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* Admin panel */
  return (
    <div className="min-h-screen" style={{ background: "#111110" }}>
      {/* Top bar */}
      <header
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0A0A09" }}
      >
        <div className="se-container flex items-center justify-between h-16">
          <div>
            <span
              className="font-display text-white tracking-widest"
              style={{ fontSize: "18px", letterSpacing: "0.15em" }}
            >
              SAN EDUARDO
            </span>
            <span
              className="font-body text-[#E07B10] font-semibold uppercase tracking-[0.3em] ml-3"
              style={{ fontSize: "9px" }}
            >
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadConsultas}
              className="flex items-center gap-2 font-body text-xs text-white/40 hover:text-white transition-colors"
              disabled={loading}
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 font-body text-xs text-white/40 hover:text-red-400 transition-colors"
            >
              <LogOut size={12} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="se-container py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(["nueva", "en_contacto", "resuelta"] as const).map((estado) => (
            <button
              key={estado}
              onClick={() =>
                setFiltroEstado(filtroEstado === estado ? "todas" : estado)
              }
              className="p-4 text-left transition-all"
              style={{
                background:
                  filtroEstado === estado
                    ? ESTADOS[estado].bg
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  filtroEstado === estado
                    ? ESTADOS[estado].color + "40"
                    : "rgba(255,255,255,0.08)"
                }`,
                borderRadius: "2px",
              }}
            >
              <div
                className="font-display text-3xl mb-1"
                style={{
                  color: ESTADOS[estado].color,
                  letterSpacing: "0.05em",
                }}
              >
                {counts[estado]}
              </div>
              <div className="font-body text-xs text-white/50">
                {ESTADOS[estado].label}
              </div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o zona..."
              className="w-full font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#E07B10] transition-colors"
              style={{ borderRadius: "2px" }}
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading && (
            <div className="text-center py-12 font-body text-white/30">
              Cargando consultas...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 font-body text-white/30">
              No hay consultas{filtroEstado !== "todas" ? ` en estado "${ESTADOS[filtroEstado as keyof typeof ESTADOS]?.label}"` : ""}.
            </div>
          )}
          {filtered.map((c) => (
            <div
              key={c.id}
              className="transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2px",
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === c.id ? null : c.id)
                }
              >
                <div
                  className="px-2 py-0.5 font-body text-xs font-semibold flex-shrink-0"
                  style={{
                    color: ESTADOS[c.estado].color,
                    background: ESTADOS[c.estado].bg,
                    borderRadius: "2px",
                  }}
                >
                  {ESTADOS[c.estado].label}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-body text-sm font-semibold text-white truncate">
                    {c.nombre}
                  </span>
                  {c.zona && (
                    <span className="font-body text-xs text-white/40 ml-3">
                      {c.zona}
                    </span>
                  )}
                </div>
                <div className="font-body text-xs text-white/30 flex-shrink-0 hidden sm:block">
                  {fmtDate(c.created_at)}
                </div>
                {expandedId === c.id ? (
                  <ChevronUp size={14} className="text-white/30 flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-white/30 flex-shrink-0" />
                )}
              </div>

              {/* Expanded */}
              {expandedId === c.id && (
                <div
                  className="px-5 pb-5 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="pt-4 grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-body text-sm text-white/60">
                        <Mail size={13} style={{ color: "#E07B10" }} />
                        <a
                          href={`mailto:${c.email}`}
                          className="hover:text-[#E07B10] transition-colors"
                        >
                          {c.email}
                        </a>
                      </div>
                      {c.telefono && (
                        <div className="flex items-center gap-2 font-body text-sm text-white/60">
                          <Phone size={13} style={{ color: "#E07B10" }} />
                          <a
                            href={`tel:${c.telefono}`}
                            className="hover:text-[#E07B10] transition-colors"
                          >
                            {c.telefono}
                          </a>
                        </div>
                      )}
                      {c.zona && (
                        <div className="flex items-center gap-2 font-body text-sm text-white/60">
                          <MapPin size={13} style={{ color: "#E07B10" }} />
                          {c.zona}
                        </div>
                      )}
                      <div className="flex items-center gap-2 font-body text-sm text-white/40">
                        <Calendar size={13} />
                        {fmtDate(c.created_at)}
                      </div>
                    </div>
                    <div>
                      <div className="font-body text-xs text-white/30 uppercase tracking-widest mb-2">
                        Mensaje
                      </div>
                      <p className="font-body text-sm text-white/65 leading-relaxed">
                        {c.mensaje}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="font-body text-xs text-white/30 self-center mr-2">
                      Cambiar estado:
                    </span>
                    {(["nueva", "en_contacto", "resuelta"] as const).map(
                      (estado) => (
                        <button
                          key={estado}
                          onClick={() => updateEstado(c.id, estado)}
                          disabled={c.estado === estado}
                          className="px-3 py-1.5 font-body text-xs font-semibold transition-all disabled:opacity-40"
                          style={{
                            color: ESTADOS[estado].color,
                            background:
                              c.estado === estado
                                ? ESTADOS[estado].bg
                                : "transparent",
                            border: `1px solid ${ESTADOS[estado].color}40`,
                            borderRadius: "2px",
                          }}
                        >
                          {ESTADOS[estado].label}
                        </button>
                      )
                    )}
                    {c.telefono && (
                      <a
                        href={`https://api.whatsapp.com/send?phone=54${c.telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto px-3 py-1.5 font-body text-xs font-semibold text-white transition-all"
                        style={{ background: "#25D366", borderRadius: "2px" }}
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
