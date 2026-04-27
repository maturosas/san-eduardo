"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Users, Award } from "lucide-react";

const PILARES = [
  {
    icon: ShieldCheck,
    title: "Calidad sin negociar",
    desc: "Solo trabajamos con marcas que conocemos y respaldamos. Si algo no cumple, lo resolvemos.",
  },
  {
    icon: Truck,
    title: "Entrega en todo el GBA Sur",
    desc: "Banfield, Adrogué, Lanús, Quilmes, Almirante Brown, Lomas de Zamora y más. Coordinamos el flete.",
  },
  {
    icon: Users,
    title: "Asesoramiento real",
    desc: "Nuestro equipo conoce los materiales. No somos un depósito. Ayudamos a elegir bien desde el principio.",
  },
  {
    icon: Award,
    title: "60 años de trayectoria",
    desc: "Tres generaciones construyendo con la zona sur. La confianza se ganó obra por obra, cliente por cliente.",
  },
];

export default function Nosotros() {
  return (
    <section id="nosotros" className="py-24" style={{ background: "#F5F0E8" }}>
      <div className="se-container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#E07B10]" />
              <span
                className="font-body text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: "#E07B10" }}
              >
                Quiénes somos
              </span>
            </div>
            <h2
              className="font-display leading-none mb-8"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                color: "#111110",
                letterSpacing: "0.02em",
              }}
            >
              MÁS DE 60 AÑOS
              <br />
              EN LA ZONA SUR.
            </h2>

            <div className="space-y-5 font-body text-[#6B7280] leading-relaxed" style={{ fontWeight: 300 }}>
              <p className="text-lg text-[#111110]" style={{ fontWeight: 500 }}>
                San Eduardo Design nació en Temperley en 1964 y nunca se fue.
              </p>
              <p>
                Lo que empezó como un pequeño corralón familiar se convirtió en
                el punto de referencia de la zona sur para constructores,
                arquitectos, remodeladoras y particulares que quieren hacer
                las cosas bien.
              </p>
              <p>
                Hoy contamos con más de 7.500 m² de depósito, 15.000 artículos
                en stock permanente y un equipo que conoce cada producto que
                vendemos. Eso no se improvisa.
              </p>
            </div>

            <div className="mt-10 flex gap-12">
              <div>
                <div
                  className="font-display text-5xl"
                  style={{ color: "#E07B10", letterSpacing: "0.02em" }}
                >
                  1964
                </div>
                <div className="font-body text-sm text-[#6B7280] mt-1">
                  Año de fundación
                </div>
              </div>
              <div>
                <div
                  className="font-display text-5xl"
                  style={{ color: "#E07B10", letterSpacing: "0.02em" }}
                >
                  3RA
                </div>
                <div className="font-body text-sm text-[#6B7280] mt-1">
                  Generación familiar
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILARES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(17,17,16,0.1)",
                  borderRadius: "2px",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(224,123,16,0.1)",
                    borderRadius: "2px",
                  }}
                >
                  <p.icon size={18} style={{ color: "#E07B10" }} />
                </div>
                <h3
                  className="font-body font-semibold text-[#111110] mb-2"
                  style={{ fontSize: "15px" }}
                >
                  {p.title}
                </h3>
                <p
                  className="font-body text-sm text-[#6B7280] leading-relaxed"
                  style={{ fontWeight: 300 }}
                >
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
