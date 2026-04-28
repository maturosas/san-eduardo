"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Rubro } from "@/types";
import { ArrowRight } from "lucide-react";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";

const FALLBACK: Rubro[] = [
  { id:"1", name:"Cerámicas y Pisos", slug:"ceramicas-y-pisos", description:"Porcellanato, cerámicas nacionales e importadas.", long_description:"", icon:"⬛", whatsapp_text:"", image_url:null, active:true, orden:1, created_at:"" },
  { id:"2", name:"Sanitarios", slug:"sanitarios", description:"Inodoros, lavatorios y bañeras de Roca, Ferrum y Daccord.", long_description:"", icon:"🚿", whatsapp_text:"", image_url:null, active:true, orden:2, created_at:"" },
  { id:"3", name:"Materiales Gruesos", slug:"materiales-gruesos", description:"Cemento, ladrillos, hierro, arena, cal y hormigón.", long_description:"", icon:"🏗️", whatsapp_text:"", image_url:null, active:true, orden:3, created_at:"" },
  { id:"4", name:"Plomería y Gas", slug:"plomeria-y-gas", description:"Caños, griferías, termotanques Rheem e instalaciones.", long_description:"", icon:"🔧", whatsapp_text:"", image_url:null, active:true, orden:4, created_at:"" },
  { id:"5", name:"Aberturas", slug:"aberturas", description:"Puertas, ventanas y marcos de aluminio y madera.", long_description:"", icon:"🚪", whatsapp_text:"", image_url:null, active:true, orden:5, created_at:"" },
  { id:"6", name:"Pinturas", slug:"pinturas", description:"Látex, esmaltes, impermeabilizantes y texturas.", long_description:"", icon:"🎨", whatsapp_text:"", image_url:null, active:true, orden:6, created_at:"" },
  { id:"7", name:"Eléctrico", slug:"electrico", description:"Cables, tableros, tomacorrientes y accesorios.", long_description:"", icon:"⚡", whatsapp_text:"", image_url:null, active:true, orden:7, created_at:"" },
  { id:"8", name:"Herramientas", slug:"herramientas", description:"Manuales, eléctricas y accesorios para toda obra.", long_description:"", icon:"🔨", whatsapp_text:"", image_url:null, active:true, orden:8, created_at:"" },
];

export default function Rubros({ content = CONTENT_DEFAULTS }: { content?: SiteContent }) {
  const [rubros, setRubros] = useState<Rubro[]>(FALLBACK);

  useEffect(() => {
    supabase.from("rubros").select("*").eq("active", true).order("orden")
      .then(({ data }) => { if (data?.length) setRubros(data as Rubro[]); });
  }, []);

  return (
    <section id="rubros" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="se-container">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-10" style={{ background: "#C41E2A", borderRadius: "2px" }} />
            <span className="font-body text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C41E2A" }}>{content.rubros_eyebrow}</span>
          </div>
          <h2 className="font-display leading-none" style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", color: "#0D4A72", letterSpacing: "0.02em" }}>{content.rubros_title}</h2>
          <p className="font-body text-[#5A6A7E] text-lg mt-3 max-w-xl" style={{ fontWeight: 300 }}>
            {content.rubros_description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rubros.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/rubros/${r.slug}`}
                className="group flex flex-col p-6 h-full transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#F4F8FC",
                  border: "1px solid rgba(13,74,114,0.1)",
                  borderRadius: "4px",
                  boxShadow: "0 1px 3px rgba(13,74,114,0.06)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0D4A72"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(13,74,114,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#F4F8FC"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 3px rgba(13,74,114,0.06)"; }}
              >
                <div className="text-2xl mb-4">{r.icon}</div>
                <h3 className="font-display text-xl mb-2 group-hover:text-white transition-colors" style={{ color: "#0D4A72", letterSpacing: "0.04em" }}>
                  {r.name}
                </h3>
                <p className="font-body text-sm leading-relaxed flex-1 group-hover:text-white/65 transition-colors" style={{ color: "#5A6A7E", fontWeight: 400 }}>
                  {r.description}
                </p>
                <div className="flex items-center gap-1 mt-4 font-body text-xs font-semibold group-hover:text-[#FFD700] transition-colors" style={{ color: "#C41E2A" }}>
                  Ver productos <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
