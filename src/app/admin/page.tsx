"use client";
import { useState, useEffect } from "react";
import { LogOut, RefreshCw, MessageSquare, Layers, FileText, Settings, Star, PanelsTopLeft } from "lucide-react";
import ConsultasTab from "./components/ConsultasTab";
import RubrosTab from "./components/RubrosTab";
import BlogTab from "./components/BlogTab";
import ConfigTab from "./components/ConfigTab";
import TestimoniosTab from "./components/TestimoniosTab";
import ContentTab from "./components/ContentTab";

const TABS = [
  { id: "consultas", label: "Consultas", icon: MessageSquare },
  { id: "rubros", label: "Rubros", icon: Layers },
  { id: "contenido", label: "Contenido", icon: PanelsTopLeft },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "testimonios", label: "Testimonios", icon: Star },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState(false);
  const [tab, setTab] = useState("consultas");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("se_admin") === "1") setAuth(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024";
    if (pass === expected) {
      sessionStorage.setItem("se_admin", "1");
      setAuth(true);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  const logout = () => { sessionStorage.removeItem("se_admin"); setAuth(false); };

  /* Login */
  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A1628" }}>
      <div className="w-full max-w-sm p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px" }}>
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-color.jpg" alt="San Eduardo" className="h-12 w-auto mx-auto mb-4" style={{ borderRadius: "4px" }} />
          <div className="font-body text-xs text-white/30 uppercase tracking-widest">Panel interno</div>
        </div>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">Contraseña</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••"
              className={`w-full font-body text-sm px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#0D4A72] transition-colors ${passError ? "border-red-500" : "border-white/10"}`}
              style={{ background: "rgba(255,255,255,0.05)", border: passError ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.1)", borderRadius: "4px" }}
              autoFocus
            />
            {passError && <p className="font-body text-xs text-red-400 mt-1">Contraseña incorrecta</p>}
          </div>
          <button type="submit" className="w-full py-3 font-body font-semibold text-sm text-white" style={{ background: "#0D4A72", borderRadius: "4px" }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );

  /* Admin panel */
  return (
    <div className="min-h-screen" style={{ background: "#0A1628" }}>
      {/* Top bar */}
      <header style={{ background: "#060E1A", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="se-container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-color.jpg" alt="San Eduardo" className="h-8 w-auto" style={{ borderRadius: "3px" }} />
            <span className="font-body text-xs text-white/30 uppercase tracking-widest hidden sm:block">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setRefreshKey(k => k + 1)} className="flex items-center gap-1.5 font-body text-xs text-white/35 hover:text-white transition-colors">
              <RefreshCw size={12} /> Actualizar
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 font-body text-xs text-white/35 hover:text-red-400 transition-colors">
              <LogOut size={12} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div style={{ background: "#060E1A", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="se-container flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 font-body text-sm font-medium px-5 py-4 whitespace-nowrap transition-all border-b-2"
              style={{
                color: tab === t.id ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                borderColor: tab === t.id ? "#0D4A72" : "transparent",
                background: "transparent",
              }}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="se-container py-8">
        <div key={`${tab}-${refreshKey}`}>
          {tab === "consultas" && <ConsultasTab />}
          {tab === "rubros" && <RubrosTab />}
          {tab === "contenido" && <ContentTab />}
          {tab === "blog" && <BlogTab />}
          {tab === "testimonios" && <TestimoniosTab />}
          {tab === "config" && <ConfigTab />}
        </div>
      </div>
    </div>
  );
}
