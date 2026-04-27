"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Send, MapPin } from "lucide-react";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", zona: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setForm({ nombre: "", telefono: "", email: "", zona: "", mensaje: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full font-body text-sm bg-white border text-[#0D2A3D] placeholder-[#9DAEBF] px-4 py-3 focus:outline-none transition-colors";

  return (
    <section id="contacto" className="py-24" style={{ background: "#F4F8FC" }}>
      <div className="se-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>
              Hablemos
            </span>
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
            PEDÍ TU PRESUPUESTO.
          </h2>
          <p className="font-body text-[#5A6A7E] text-lg mt-4 max-w-lg mx-auto" style={{ fontWeight: 300 }}>
            Contanos qué estás construyendo y te respondemos con precios reales. Sin vueltas.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Teléfonos", values: ["4264-4848", "4264-7638", "4264-3889", "4264-0194"], href: "tel:+541142644848" },
              { icon: MessageCircle, label: "WhatsApp", values: ["+54 9 11 2161-3339", "+54 9 11 3278-3128"], href: "https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales" },
              { icon: Mail, label: "Email", values: ["info@saneduardodesign.com.ar"], href: "mailto:info@saneduardodesign.com.ar" },
              { icon: MapPin, label: "Dirección", values: ["Dr. Carlos Collivadino 57", "Temperley, Buenos Aires"], href: "#" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4" style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px" }}>
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(13,74,114,0.08)", borderRadius: "3px" }}>
                  <item.icon size={16} style={{ color: "#0D4A72" }} />
                </div>
                <div>
                  <div className="font-body text-xs text-[#9DAEBF] uppercase tracking-widest mb-1">{item.label}</div>
                  {item.values.map((v) => (
                    <a key={v} href={item.href} className="block font-body text-sm font-medium hover:text-[#C41E2A] transition-colors" style={{ color: "#0D2A3D" }}>
                      {v}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <a
              href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 font-body font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "#25D366", borderRadius: "3px" }}
            >
              <MessageCircle size={15} />
              Escribir por WhatsApp
            </a>
          </div>

          {/* Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {status === "ok" ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-12"
                style={{ background: "#FFFFFF", border: "2px solid #0D4A72", borderRadius: "4px", minHeight: "400px" }}
              >
                <div className="font-display text-6xl mb-4" style={{ color: "#0D4A72" }}>¡LISTO!</div>
                <p className="font-body text-[#5A6A7E] text-lg">Recibimos tu consulta. Te contactamos a la brevedad.</p>
                <button onClick={() => setStatus("idle")} className="mt-8 font-body text-sm font-semibold" style={{ color: "#C41E2A" }}>
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-5"
                style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px", boxShadow: "0 4px 16px rgba(13,74,114,0.08)" }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-2 block">Nombre *</label>
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Tu nombre"
                      className={inputClass} style={{ borderColor: "rgba(13,74,114,0.2)", borderRadius: "3px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#0D4A72")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(13,74,114,0.2)")}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-2 block">Teléfono</label>
                    <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="11 1234-5678"
                      className={inputClass} style={{ borderColor: "rgba(13,74,114,0.2)", borderRadius: "3px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#0D4A72")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(13,74,114,0.2)")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-2 block">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="tu@email.com"
                      className={inputClass} style={{ borderColor: "rgba(13,74,114,0.2)", borderRadius: "3px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#0D4A72")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(13,74,114,0.2)")}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-2 block">Zona</label>
                    <select name="zona" value={form.zona} onChange={handleChange}
                      className={inputClass} style={{ borderColor: "rgba(13,74,114,0.2)", borderRadius: "3px" }}
                    >
                      <option value="">Tu zona de entrega</option>
                      {["Temperley","Lomas de Zamora","Banfield","Adrogué","Lanús","Quilmes","Almirante Brown","Bernal","Wilde","Avellaneda","Berazategui","Florencio Varela","Monte Grande","La Plata","Otra zona"].map(z => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-[#0D4A72] uppercase tracking-widest mb-2 block">¿Qué necesitás? *</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required rows={5}
                    placeholder="Contanos qué materiales necesitás, para qué obra, cantidades aproximadas..."
                    className={inputClass} style={{ borderColor: "rgba(13,74,114,0.2)", borderRadius: "3px", resize: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = "#0D4A72")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(13,74,114,0.2)")}
                  />
                </div>

                {status === "error" && (
                  <p className="font-body text-red-600 text-sm">Hubo un error. Intentá de nuevo o escribinos por WhatsApp.</p>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 py-4 font-body font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#0D4A72", borderRadius: "3px" }}
                >
                  {status === "loading" ? "Enviando..." : <><Send size={14} /> Enviar consulta</>}
                </button>
                <p className="font-body text-[#9DAEBF] text-xs text-center">Respondemos en el día en horario comercial.</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
