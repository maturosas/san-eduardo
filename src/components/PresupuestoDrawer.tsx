"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Send, ClipboardList } from "lucide-react";
import { usePresupuesto } from "@/context/PresupuestoContext";

function formatPrecio(p: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(p);
}

export default function PresupuestoDrawer() {
  const { items, removeItem, updateCantidad, clear, isOpen, setIsOpen, notification, clearNotification, total } = usePresupuesto();
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const count = items.reduce((a, i) => a + i.cantidad, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          zona: "",
          presupuesto_items: JSON.stringify(
            items.map(i => ({
              nombre: i.nombre,
              rubro: i.rubro,
              cantidad: i.cantidad,
              precio: i.precioPromo ?? i.precio,
            }))
          ),
          mensaje: form.mensaje || `Presupuesto solicitado:\n${items.map(i => `• ${i.nombre} (${i.rubro}) × ${i.cantidad}`).join("\n")}`,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      clear();
      setForm({ nombre: "", telefono: "", email: "", mensaje: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls = "w-full font-body text-sm border text-[#0D2A3D] placeholder-[#9DAEBF] px-3 py-2.5 focus:outline-none focus:border-[#0D4A72] transition-colors";

  return (
    <>
      <style>{`
        .se-presupuesto-panel {
          position: fixed;
          right: 16px;
          top: 80px;
          bottom: 16px;
          z-index: 60;
          width: min(420px, calc(100vw - 32px));
          border-radius: 8px;
        }
        @media (max-width: 640px) {
          .se-presupuesto-panel {
            left: 12px;
            right: 12px;
            top: auto;
            bottom: 84px;
            width: auto;
            max-height: 72dvh;
          }
        }
      `}</style>

      {/* Add notification */}
      <AnimatePresence>
        {notification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed left-4 right-4 sm:left-auto sm:right-6 z-50 p-4"
            style={{
              zIndex: 70,
              bottom: "96px",
              maxWidth: "360px",
              marginLeft: "auto",
              background: "#FFFFFF",
              border: "1px solid rgba(13,74,114,0.14)",
              borderRadius: "8px",
              boxShadow: "0 12px 32px rgba(13,74,114,0.18)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "#0D4A72", borderRadius: "50%" }}>
                <ClipboardList size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold leading-tight" style={{ color: "#0D2A3D" }}>
                  Agregado al presupuesto
                </p>
                <p className="font-body text-xs truncate mt-0.5" style={{ color: "#5A6A7E" }}>
                  {notification}
                </p>
                <button
                  onClick={() => { clearNotification(); setIsOpen(true); }}
                  className="font-body text-xs font-bold mt-2"
                  style={{ color: "#C41E2A" }}
                >
                  Ver presupuesto
                </button>
              </div>
              <button onClick={clearNotification} className="text-[#9DAEBF] hover:text-[#0D4A72] transition-colors">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { clearNotification(); setIsOpen(true); }}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 font-body font-bold text-sm text-white px-4 py-3 shadow-xl"
            style={{
              background: "#0D4A72",
              borderRadius: "50px",
              boxShadow: "0 8px 24px rgba(13,74,114,0.4)",
            }}
          >
            <ClipboardList size={16} />
            Presupuesto
            <span
              className="flex items-center justify-center w-5 h-5 font-body text-xs font-black"
              style={{ background: "#C41E2A", borderRadius: "50%", marginLeft: "-4px" }}
            >
              {count}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="se-presupuesto-panel flex flex-col overflow-hidden"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 16px 44px rgba(0,0,0,0.18)",
              border: "1px solid rgba(13,74,114,0.14)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(13,74,114,0.1)", background: "#0D4A72" }}>
              <div>
                <h2 className="font-display text-xl text-white" style={{ letterSpacing: "0.05em" }}>
                  MI PRESUPUESTO
                </h2>
                <p className="font-body text-xs text-white/55">
                  {count} {count === 1 ? "producto" : "productos"} seleccionados
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
              {status === "ok" ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="font-display text-5xl mb-3" style={{ color: "#0D4A72", letterSpacing: "0.05em" }}>¡LISTO!</div>
                  <p className="font-body text-[#5A6A7E] mb-6">Recibimos tu presupuesto. Te contactamos a la brevedad con los precios.</p>
                  <button onClick={() => { setStatus("idle"); setIsOpen(false); }}
                    className="font-body text-sm font-semibold text-white px-6 py-2.5" style={{ background: "#0D4A72", borderRadius: "4px" }}>
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <div className="p-4 space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 p-3" style={{ border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}>
                        {/* Thumb */}
                        <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: "4px", background: "#E8EFF6" }}>
                          {item.imagen
                            ? <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center font-display text-lg" style={{ color: "#0D4A72", opacity: 0.2 }}>SE</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold leading-tight truncate" style={{ color: "#0D2A3D" }}>{item.nombre}</p>
                          <p className="font-body text-xs" style={{ color: "#9DAEBF" }}>{item.rubro}</p>
                          {(item.precioPromo || item.precio) && (
                            <p className="font-body text-sm font-semibold mt-0.5" style={{ color: "#C41E2A" }}>
                              {formatPrecio((item.precioPromo ?? item.precio)! * item.cantidad)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button onClick={() => removeItem(item.id)} className="text-[#9DAEBF] hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                              className="w-6 h-6 flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-gray-100"
                              style={{ border: "1px solid rgba(13,74,114,0.15)", borderRadius: "3px" }}>
                              <Minus size={10} />
                            </button>
                            <span className="font-body text-sm font-semibold w-6 text-center" style={{ color: "#0D2A3D" }}>
                              {item.cantidad}
                            </span>
                            <button onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                              className="w-6 h-6 flex items-center justify-center transition-colors hover:bg-gray-100"
                              style={{ border: "1px solid rgba(13,74,114,0.15)", borderRadius: "3px" }}>
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  {total > 0 && (
                    <div className="mx-4 px-4 py-3 flex items-center justify-between" style={{ background: "#F4F8FC", borderRadius: "4px", border: "1px solid rgba(13,74,114,0.1)" }}>
                      <span className="font-body text-sm text-[#5A6A7E]">Total estimado</span>
                      <span className="font-display text-2xl" style={{ color: "#0D4A72", letterSpacing: "0.03em" }}>{formatPrecio(total)}</span>
                    </div>
                  )}

                  {/* Contact form */}
                  <form onSubmit={handleSubmit} className="p-4 pt-3 space-y-3">
                    <p className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "#0D4A72" }}>
                      Tus datos para cotizar
                    </p>
                    <input required placeholder="Nombre *" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                      className={inputCls} style={{ background: "#F4F8FC", borderColor: "rgba(13,74,114,0.2)", borderRadius: "4px" }} />
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                        className={inputCls} style={{ background: "#F4F8FC", borderColor: "rgba(13,74,114,0.2)", borderRadius: "4px" }} />
                      <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className={inputCls} style={{ background: "#F4F8FC", borderColor: "rgba(13,74,114,0.2)", borderRadius: "4px" }} />
                    </div>
                    <textarea placeholder="Comentarios (opcional)" value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                      rows={2} className={inputCls} style={{ background: "#F4F8FC", borderColor: "rgba(13,74,114,0.2)", borderRadius: "4px", resize: "none" }} />

                    {status === "error" && (
                      <p className="font-body text-xs text-red-500">Error al enviar. Intentá por WhatsApp.</p>
                    )}

                    <button type="submit" disabled={status === "loading" || !form.nombre || !form.email}
                      className="flex items-center justify-center gap-2 w-full py-3.5 font-body font-bold text-sm text-white disabled:opacity-50 transition-all"
                      style={{ background: "#C41E2A", borderRadius: "4px" }}>
                      {status === "loading" ? "Enviando..." : <><Send size={14} /> Enviar presupuesto</>}
                    </button>
                    <button type="button" onClick={clear}
                      className="w-full font-body text-xs text-[#9DAEBF] hover:text-red-400 transition-colors py-1">
                      Vaciar presupuesto
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
