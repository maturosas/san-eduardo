"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Send, Check } from "lucide-react";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";

export default function Contacto({ content = CONTENT_DEFAULTS }: { content?: SiteContent }) {
  const [form, setForm] = useState({ nombre: "", contacto: "", mensaje: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const isEmail = form.contacto.includes("@");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: isEmail ? form.contacto : "sin-email@consulta.local",
          telefono: !isEmail ? form.contacto : null,
          zona: "",
          mensaje: form.mensaje || "Consulta general — sin mensaje adicional.",
          website: form.website,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setForm({ nombre: "", contacto: "", mensaje: "", website: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls = "w-full font-body text-sm border text-[#0D2A3D] placeholder-[#9DAEBF] px-4 py-3.5 focus:outline-none transition-colors";
  const inputStyle = { borderColor: "rgba(13,74,114,0.2)", borderRadius: "4px", background: "#FFFFFF" };

  return (
    <section id="contacto" className="py-16 md:py-24" style={{ background: "#F4F8FC" }}>
      <div className="se-container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>{content.contacto_eyebrow}</span>
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
            {content.contacto_title}
          </h2>
          <p className="font-body text-[#5A6A7E] text-base mt-3 max-w-md mx-auto" style={{ fontWeight: 300 }}>
            {content.contacto_description}
          </p>
        </div>

        {/* Google Maps */}
        <div className="mb-8 overflow-hidden" style={{ borderRadius: "6px", border: "1px solid rgba(13,74,114,0.1)" }}>
          <iframe
            src="https://maps.google.com/maps?q=Dr.+Carlos+Collivadino+57,+Temperley,+Buenos+Aires,+Argentina&output=embed&hl=es&z=15"
            width="100%"
            height="240"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="San Eduardo Design — Dr. Carlos Collivadino 57, Temperley"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: Phone, label: "Teléfonos", values: ["4264-4848", "4264-7638", "4264-3889"], href: "tel:+541142644848" },
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

          {/* Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {status === "ok" ? (
              <div className="flex flex-col items-center justify-center text-center p-12 h-full" style={{ background: "#FFFFFF", border: "2px solid #0D4A72", borderRadius: "6px", minHeight: "320px" }}>
                <div className="w-14 h-14 flex items-center justify-center mb-4" style={{ background: "rgba(13,74,114,0.08)", borderRadius: "50%" }}>
                  <Check size={26} style={{ color: "#0D4A72" }} />
                </div>
                <div className="font-display text-4xl mb-2" style={{ color: "#0D4A72", letterSpacing: "0.05em" }}>¡LISTO!</div>
                <p className="font-body text-[#5A6A7E]">Recibimos tu consulta. Te contactamos en el día.</p>
                <button onClick={() => setStatus("idle")} className="mt-5 font-body text-sm font-semibold" style={{ color: "#C41E2A" }}>
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 space-y-4"
                style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "6px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}
              >
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-1.5 block">Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-1.5 block">Teléfono o Email *</label>
                    <input
                      type="text"
                      required
                      placeholder="11 1234-5678 o tu@email.com"
                      value={form.contacto}
                      onChange={e => setForm(f => ({ ...f, contacto: e.target.value }))}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-1.5 block">¿Qué necesitás? (opcional)</label>
                  <textarea
                    rows={4}
                    placeholder="Contanos qué materiales buscás, para qué obra, cualquier detalle que ayude a cotizar mejor..."
                    value={form.mensaje}
                    onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                    className={inputCls}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                {status === "error" && (
                  <p className="font-body text-xs text-red-500">Error al enviar. Intentá por WhatsApp.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !form.nombre || !form.contacto}
                  className="flex items-center justify-center gap-2 w-full py-4 font-body font-bold text-sm text-white disabled:opacity-50 transition-all hover:opacity-90"
                  style={{ background: "#0D4A72", borderRadius: "4px" }}
                >
                  {status === "loading" ? "Enviando..." : <><Send size={14} /> Enviar consulta</>}
                </button>
                <p className="font-body text-[#9DAEBF] text-xs text-center">Respondemos en el día en horario comercial · Lun–Vie 7:30–18hs</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
