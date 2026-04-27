"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Truck, Users, Award } from "lucide-react";

const PILARES = [
  { icon: ShieldCheck, title: "Calidad sin negociar", desc: "Solo trabajamos con marcas que conocemos y respaldamos." },
  { icon: Truck, title: "Entrega en todo el GBA Sur", desc: "Banfield, Adrogué, Lanús, Quilmes, Almirante Brown y más." },
  { icon: Users, title: "Asesoramiento real", desc: "Nuestro equipo conoce cada producto. Ayudamos a elegir bien." },
  { icon: Award, title: "60 años de trayectoria", desc: "Tres generaciones construyendo confianza obra por obra." },
];

export default function Nosotros() {
  return (
    <section id="nosotros" className="py-16 md:py-24" style={{ background: "#F4F8FC" }}>
      <div className="se-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative mb-8 overflow-hidden" style={{ borderRadius: "4px" }}>
              <Image
                src="/images/construccion.jpg"
                alt="Obra de construcción con materiales de San Eduardo Design — Temperley GBA Sur"
                width={600}
                height={380}
                className="w-full object-cover"
                style={{ height: "clamp(200px, 30vw, 320px)" }}
              />
              <div
                className="absolute bottom-4 left-4 px-4 py-3"
                style={{ background: "rgba(13,74,114,0.92)", backdropFilter: "blur(8px)", borderRadius: "3px" }}
              >
                <div className="font-display text-2xl sm:text-3xl text-white" style={{ letterSpacing: "0.05em" }}>1964</div>
                <div className="font-body text-xs text-white/60 mt-0.5">Fundada en Temperley</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
              <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>Quiénes somos</span>
            </div>
            <h2 className="font-display leading-none mb-5" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>
              MÁS DE 60 AÑOS<br />EN LA ZONA SUR.
            </h2>
            <div className="space-y-3 font-body text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>
              <p className="text-base text-[#0D4A72]" style={{ fontWeight: 500 }}>
                San Eduardo Design nació en Temperley en 1964 y nunca se fue.
              </p>
              <p className="text-sm sm:text-base">
                Lo que empezó como un pequeño corralón familiar se convirtió en el referente de la zona sur para constructores, arquitectos y particulares.
              </p>
              <p className="text-sm sm:text-base">
                Hoy contamos con más de 7.500 m² de depósito, 15.000 artículos en stock y un equipo que conoce cada producto que vendemos.
              </p>
            </div>
          </motion.div>

          {/* Right: pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILARES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-5"
                style={{ background: "#FFFFFF", border: "1px solid rgba(13,74,114,0.1)", borderRadius: "4px", boxShadow: "0 2px 8px rgba(13,74,114,0.06)" }}
              >
                <div className="w-9 h-9 flex items-center justify-center mb-3" style={{ background: "rgba(13,74,114,0.08)", borderRadius: "3px" }}>
                  <p.icon size={16} style={{ color: "#0D4A72" }} />
                </div>
                <h3 className="font-body font-semibold mb-1.5" style={{ fontSize: "14px", color: "#0D4A72" }}>{p.title}</h3>
                <p className="font-body text-sm text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
