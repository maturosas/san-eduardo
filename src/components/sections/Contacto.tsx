"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, ChevronRight, Check, Send } from "lucide-react";

const RUBROS_OPCIONES = [
  "Cerámicas y Pisos", "Sanitarios", "Materiales Gruesos",
  "Plomería y Gas", "Aberturas", "Pinturas", "Eléctrico",
  "Herramientas", "Presupuesto general", "Otro",
];

const ZONAS = [
  "Temperley","Lomas de Zamora","Banfield","Adrogué",
  "Lanús","Quilmes","Almirante Brown","Bernal",
  "Wilde","Avellaneda","Berazategui","Florencio Varela",
  "Monte Grande","La Plata","Ezeiza","Otra zona",
];

const URGENCIA = [
  { value: "esta_semana", label: "Esta semana" },
  { value: "este_mes", label: "Este mes" },
  { value: "cotizando", label: "Solo estoy cotizando" },
];

type FormData = {
  rubro: string;
  zona: string;
  urgencia: string;
  nombre: string;
  contacto: string;
  mensaje: string;
};

const EMPTY: FormData = { rubro: "", zona: "", urgencia: "", nombre: "", contacto: "", mensaje: "" };

export default function Contacto() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const canStep1 = !!form.rubro;
  const canStep2 = !!form.zona && !!form.urgencia;
  const canSubmit = !!form.nombre && !!form.contacto;

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.contacto.includes("@") ? form.contacto : undefined,
          telefono: !form.contacto.includes("@") ? form.contacto : undefined,
          zona: form.zona,
          mensaje: `Necesita: ${form.rubro}\nUrgencia: ${URGENCIA.find(u => u.value === form.urgencia)?.label || form.urgencia}\n\n${form.mensaje || "Sin comentarios adicionales."}`,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  const inputCls = "w-full font-body text-sm bg-white border text-[#0D2A3D] placeholder-[#9DAEBF] px-4 py-3 focus:outline-none transition-colors";
  const inputStyle = { borderColor: "rgba(13,74,114,0.2)", borderRadius: "4px" };

  return (
    <section id="contacto" className="py-16 md:py-24" style={{ background: "#F4F8FC" }}>
      <div className="se-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>Hablemos</span>
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
            PEDÍ TU PRESUPUESTO.
          </h2>
          <p className="font-body text-[#5A6A7E] text-base mt-3 max-w-md mx-auto" style={{ fontWeight: 300 }}>
            3 pasos. Sin vueltas. Respondemos en el día.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4 order-2 lg:order-1">
            {[
              { icon: Phone, label: "Teléfonos", values: ["4264-4848", "4264-7638"], href: "tel:+541142644848" },
              { icon: MessageCircle, label: "WhatsApp", values: ["+54 9 11 2161-3339"], href: "https://api.whatsapp.com/send?phone=5491121613339" },
              { icon: Mail, label: "Email", values: ["info@saneduardodesign.com.ar"], href: "mailto:info@saneduardodesign.com.ar" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}>
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(13,74,114,0.08)", borderRadius: "3px" }}>
                  <item.icon size={15} style={{ color: "#0D4A72" }} />
                </div>
                <div>
                  <div className="font-body text-xs text-[#9DAEBF] uppercase tracking-widest mb-1">{item.label}</div>
                  {item.values.map(v => (
                    <a key={v} href={item.href} className="block font-body text-sm font-medium hover:text-[#C41E2A] transition-colors" style={{ color: "#0D2A3D" }}>{v}</a>
                  ))}
                </div>
              </div>
            ))}
            <a
              href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20materiales"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 font-body font-semibold text-sm text-white"
              style={{ background: "#25D366", borderRadius: "4px" }}
            >
              <MessageCircle size={14} /> Escribir por WhatsApp
            </a>
          </div>

          {/* Progressive form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {status === "ok" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center p-12 h-full"
                style={{ background: "#FFFFFF", border: "2px solid #0D4A72", borderRadius: "6px", minHeight: "360px" }}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-4" style={{ background: "rgba(13,74,114,0.08)", borderRadius: "50%" }}>
                  <Check size={28} style={{ color: "#0D4A72" }} />
                </div>
                <div className="font-display text-4xl mb-3" style={{ color: "#0D4A72", letterSpacing: "0.05em" }}>¡LISTO!</div>
                <p className="font-body text-[#5A6A7E]">Recibimos tu consulta. Te contactamos en el día.</p>
                <button onClick={() => { setStatus("idle"); setStep(1); setForm(EMPTY); }}
                  className="mt-6 font-body text-sm font-semibold" style={{ color: "#C41E2A" }}>
                  Enviar otra consulta
                </button>
              </motion.div>
            ) : (
              <div className="p-6 sm:p-8" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "6px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}>
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-7">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all"
                        style={{
                          background: step >= n ? "#0D4A72" : "#E8EFF6",
                          color: step >= n ? "#FFFFFF" : "#9DAEBF",
                        }}
                      >
                        {step > n ? <Check size={12} /> : n}
                      </div>
                      <span className="font-body text-xs hidden sm:block" style={{ color: step === n ? "#0D4A72" : "#9DAEBF" }}>
                        {n === 1 ? "¿Qué necesitás?" : n === 2 ? "¿Dónde y cuándo?" : "Tus datos"}
                      </span>
                      {n < 3 && <div className="flex-1 h-px w-6 sm:w-12" style={{ background: step > n ? "#0D4A72" : "#E8EFF6" }} />}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <p className="font-body font-semibold text-[#0D4A72] mb-4">¿Qué necesitás cotizar?</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                        {RUBROS_OPCIONES.map(r => (
                          <button
                            key={r}
                            onClick={() => setForm(f => ({ ...f, rubro: r }))}
                            className="px-3 py-2.5 font-body text-sm text-left transition-all"
                            style={{
                              background: form.rubro === r ? "#0D4A72" : "#F4F8FC",
                              color: form.rubro === r ? "#FFFFFF" : "#0D2A3D",
                              border: `1.5px solid ${form.rubro === r ? "#0D4A72" : "rgba(13,74,114,0.15)"}`,
                              borderRadius: "4px",
                              fontWeight: form.rubro === r ? 600 : 400,
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        disabled={!canStep1}
                        className="flex items-center gap-2 font-body font-bold text-sm text-white px-7 py-3 disabled:opacity-40 transition-all"
                        style={{ background: "#C41E2A", borderRadius: "4px" }}
                      >
                        Continuar <ChevronRight size={15} />
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <p className="font-body font-semibold text-[#0D4A72] mb-4">¿Dónde entregamos?</p>
                      <select
                        value={form.zona}
                        onChange={e => setForm(f => ({ ...f, zona: e.target.value }))}
                        className={`${inputCls} mb-5`}
                        style={inputStyle}
                      >
                        <option value="">Seleccioná tu zona</option>
                        {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                      </select>

                      <p className="font-body font-semibold text-[#0D4A72] mb-3">¿Con qué urgencia?</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {URGENCIA.map(u => (
                          <button
                            key={u.value}
                            onClick={() => setForm(f => ({ ...f, urgencia: u.value }))}
                            className="px-4 py-2.5 font-body text-sm transition-all"
                            style={{
                              background: form.urgencia === u.value ? "#0D4A72" : "#F4F8FC",
                              color: form.urgencia === u.value ? "#FFFFFF" : "#0D2A3D",
                              border: `1.5px solid ${form.urgencia === u.value ? "#0D4A72" : "rgba(13,74,114,0.15)"}`,
                              borderRadius: "4px",
                              fontWeight: form.urgencia === u.value ? 600 : 400,
                            }}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="font-body text-sm text-[#9DAEBF] hover:text-[#0D4A72] transition-colors px-4 py-3">
                          ← Volver
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          disabled={!canStep2}
                          className="flex items-center gap-2 font-body font-bold text-sm text-white px-7 py-3 disabled:opacity-40 transition-all"
                          style={{ background: "#C41E2A", borderRadius: "4px" }}
                        >
                          Continuar <ChevronRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <p className="font-body font-semibold text-[#0D4A72] mb-4">¿Cómo te contactamos?</p>
                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-1.5 block">Nombre *</label>
                          <input
                            type="text" placeholder="Tu nombre"
                            value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                            className={inputCls} style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-1.5 block">Teléfono o Email *</label>
                          <input
                            type="text" placeholder="11 1234-5678 o tu@email.com"
                            value={form.contacto} onChange={e => setForm(f => ({ ...f, contacto: e.target.value }))}
                            className={inputCls} style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-1.5 block">Comentarios (opcional)</label>
                          <textarea
                            rows={3} placeholder="Medidas, cantidades, cualquier detalle que ayude a cotizar mejor..."
                            value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                            className={inputCls} style={{ ...inputStyle, resize: "none" }}
                          />
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="flex flex-wrap gap-2 mb-5 p-3" style={{ background: "#F4F8FC", borderRadius: "4px", border: "1px solid rgba(13,74,114,0.1)" }}>
                        <span className="font-body text-xs text-[#0D4A72] font-semibold">{form.rubro}</span>
                        <span className="text-[#9DAEBF]">·</span>
                        <span className="font-body text-xs text-[#5A6A7E]">{form.zona}</span>
                        <span className="text-[#9DAEBF]">·</span>
                        <span className="font-body text-xs text-[#5A6A7E]">{URGENCIA.find(u => u.value === form.urgencia)?.label}</span>
                        <button onClick={() => setStep(1)} className="ml-auto font-body text-xs text-[#9DAEBF] hover:text-[#C41E2A] transition-colors">Editar</button>
                      </div>

                      {status === "error" && <p className="font-body text-xs text-red-500 mb-3">Error al enviar. Intentá por WhatsApp.</p>}

                      <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="font-body text-sm text-[#9DAEBF] hover:text-[#0D4A72] transition-colors px-4 py-3">
                          ← Volver
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!canSubmit || status === "loading"}
                          className="flex items-center gap-2 flex-1 justify-center font-body font-bold text-sm text-white py-3 disabled:opacity-40 transition-all"
                          style={{ background: "#0D4A72", borderRadius: "4px" }}
                        >
                          {status === "loading" ? "Enviando..." : <><Send size={14} /> Enviar consulta</>}
                        </button>
                      </div>
                      <p className="font-body text-[#9DAEBF] text-xs text-center mt-3">Respondemos en el día en horario comercial.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
