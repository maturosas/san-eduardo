"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Clock, ChevronDown } from "lucide-react";

const SLIDES = [
  {
    img: "/images/showroom.jpg",
    headline: ["TODO LO QUE", "TU OBRA", "NECESITA."],
    sub: "Más de 15.000 artículos en stock. Marcas líderes. Asesoramiento real.",
  },
  {
    img: "/images/construccion.jpg",
    headline: ["60 AÑOS", "CONSTRUYENDO", "LA ZONA SUR."],
    sub: "Tres generaciones al servicio de la construcción en el GBA Sur.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: bgY }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SLIDES[current].img}
            alt=""
            className="w-full h-full object-cover"
            style={{ height: "115%" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to right, rgba(13,74,114,0.88) 0%, rgba(13,74,114,0.65) 50%, rgba(13,74,114,0.3) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-10"
        style={{
          background: "linear-gradient(to top, rgba(13,74,114,0.6), transparent)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 se-container w-full pt-28 pb-20"
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "3px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="font-body text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: "#FFB3B8" }}
            >
              DESDE 1964
            </span>
            <span className="w-px h-3 bg-white/30" />
            <span className="font-body text-xs text-white/70 tracking-wider">
              Temperley · GBA Sur
            </span>
          </motion.div>

          {/* Headline — animated per slide */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${current}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-white leading-none mb-6"
              style={{ fontSize: "clamp(3.2rem, 8vw, 6.5rem)", letterSpacing: "0.02em" }}
            >
              {SLIDES[current].headline.map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span style={{ color: "#FFD700" }}>{line}</span>
                  ) : line}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`p-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-white/70 text-lg leading-relaxed mb-10 max-w-lg"
              style={{ fontWeight: 300 }}
            >
              {SLIDES[current].sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-8 py-4 text-white group transition-all"
              style={{ background: "#C41E2A", borderRadius: "3px" }}
            >
              Pedir presupuesto
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20sobre%20materiales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-8 py-4 text-white hover:bg-white/10 transition-all"
              style={{ border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: "3px" }}
            >
              WhatsApp →
            </a>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          {[
            { num: "60+", label: "Años en el rubro" },
            { num: "15.000", label: "Artículos en stock" },
            { num: "7.500 m²", label: "Depósito propio" },
            { num: "30+", label: "Marcas líderes" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center py-5 px-4"
              style={{ background: "rgba(13,74,114,0.5)", backdropFilter: "blur(8px)" }}
            >
              <div
                className="font-display text-3xl text-white mb-1"
                style={{ letterSpacing: "0.03em" }}
              >
                {s.num}
              </div>
              <div className="font-body text-xs text-white/55 tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-5"
        >
          <div className="flex items-center gap-2 text-white/50">
            <MapPin size={13} style={{ color: "#FFD700" }} />
            <span className="font-body text-sm">Dr. Carlos Collivadino 57, Temperley</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Clock size={13} style={{ color: "#FFD700" }} />
            <span className="font-body text-sm">Lun–Vie 7:30–18hs · Sáb 7:30–13hs</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? "#C41E2A" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-body text-xs text-white/40 tracking-widest uppercase rotate-90 origin-center mb-2">
          Scroll
        </span>
        <ChevronDown size={16} className="text-white/40" />
      </motion.div>
    </section>
  );
}
