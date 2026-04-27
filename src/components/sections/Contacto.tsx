"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    zona: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error");
      setStatus("ok");
      setForm({ nombre: "", telefono: "", email: "", zona: "", mensaje: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full font-body text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 focus:outline-none focus:border-[#E07B10] transition-colors";

  return (
    <section id="contacto" className="py-24" style={{ background: "#111110" }}>
      <div className="se-container">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left: info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#E07B10]" />
              <span
                className="font-body text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: "#E07B10" }}
              >
                Hablemos
              </span>
            </div>
            <h2
              className="font-display text-white leading-none mb-8"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.02em",
              }}
            >
              PEDÍ TU
              <br />
              PRESUPUESTO.
            </h2>
            <p
              className="font-body text-white/50 text-lg leading-relaxed mb-12"
              style={{ fontWeight: 300 }}
            >
              Contanos qué estás construyendo o reformando y te respondemos
              con precios reales. Sin vueltas, sin esperas innecesarias.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  label: "Teléfonos",
                  values: ["4264-4848", "4264-7638", "4264-3889", "4264-0194"],
                  href: "tel:+541142644848",
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  values: ["+54 9 11 2161-3339", "+54 9 11 3278-3128"],
                  href: "https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales",
                },
                {
                  icon: Mail,
                  label: "Email",
                  values: ["info@saneduardodesign.com.ar"],
                  href: "mailto:info@saneduardodesign.com.ar",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(224,123,16,0.1)",
                      borderRadius: "2px",
                    }}
                  >
                    <item.icon size={16} style={{ color: "#E07B10" }} />
                  </div>
                  <div>
                    <div className="font-body text-xs text-white/40 uppercase tracking-widest mb-1">
                      {item.label}
                    </div>
                    {item.values.map((v) => (
                      <a
                        key={v}
                        href={item.href}
                        className="block font-body text-white/80 hover:text-[#E07B10] transition-colors text-sm"
                      >
                        {v}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-10 px-6 py-4 font-body font-semibold text-sm text-[#111110] transition-all"
              style={{ background: "#25D366", borderRadius: "2px" }}
            >
              <MessageCircle size={16} />
              Escribir por WhatsApp
            </a>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {status === "ok" ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-12"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(224,123,16,0.3)",
                  borderRadius: "2px",
                  minHeight: "400px",
                }}
              >
                <div
                  className="font-display text-6xl mb-4"
                  style={{ color: "#E07B10", letterSpacing: "0.05em" }}
                >
                  ¡LISTO!
                </div>
                <p className="font-body text-white/70 text-lg">
                  Recibimos tu consulta. Te contactamos a la brevedad.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 font-body text-sm text-[#E07B10] hover:text-[#F59332] transition-colors"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                      className={inputClass}
                      style={{ borderRadius: "2px" }}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="11 1234-5678"
                      className={inputClass}
                      style={{ borderRadius: "2px" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className={inputClass}
                    style={{ borderRadius: "2px" }}
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
                    Zona de entrega
                  </label>
                  <select
                    name="zona"
                    value={form.zona}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ borderRadius: "2px" }}
                  >
                    <option value="">Seleccioná tu zona</option>
                    {[
                      "Temperley", "Lomas de Zamora", "Banfield", "Adrogué",
                      "Lanús", "Quilmes", "Almirante Brown", "Bernal",
                      "Wilde", "Avellaneda", "Berazategui", "Florencio Varela",
                      "Monte Grande", "La Plata", "Otra zona",
                    ].map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-2 block">
                    ¿Qué necesitás?
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Contanos qué materiales necesitás, para qué obra, cantidades aproximadas..."
                    className={inputClass}
                    style={{ borderRadius: "2px", resize: "none" }}
                  />
                </div>

                {status === "error" && (
                  <p className="font-body text-red-400 text-sm">
                    Hubo un error. Intentá de nuevo o contactanos por WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 py-4 font-body font-semibold text-sm text-white transition-all disabled:opacity-50"
                  style={{ background: "#E07B10", borderRadius: "2px" }}
                >
                  {status === "loading" ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={14} />
                      Enviar consulta
                    </>
                  )}
                </button>

                <p className="font-body text-white/25 text-xs text-center">
                  Respondemos en el día en horario comercial.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
