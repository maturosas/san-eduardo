"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";
import { splitLines } from "@/lib/siteContent";

const STATS = [
  { num: "60+", label: "Años" },
  { num: "15.000", label: "Artículos" },
  { num: "7.500 m²", label: "Depósito" },
  { num: "30+", label: "Marcas" },
];

export default function Hero({ content = CONTENT_DEFAULTS }: { content?: SiteContent }) {
  const slides = [
    {
      img: content.hero_image_1,
      headline: splitLines(content.hero_headline_1),
      sub: content.hero_subtitle_1,
    },
    {
      img: content.hero_image_2,
      headline: splitLines(content.hero_headline_2),
      sub: content.hero_subtitle_2,
    },
  ];
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section
      ref={ref}
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "clamp(680px, 92vh, 860px)" }}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          style={{ y: bgY }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slides[current].img})`,
              backgroundSize: "cover",
              backgroundPosition: current === 0 ? "center 40%" : "center center",
              height: "110%",
              top: "-5%",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(105deg, rgba(13,74,114,0.92) 0%, rgba(13,74,114,0.72) 55%, rgba(13,74,114,0.35) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-20 se-container w-full" style={{ paddingTop: "96px", paddingBottom: "150px" }}>
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-0.5 w-8" style={{ background: "#FFD700" }} />
            <span className="font-body text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#FFD700" }}>
              {content.hero_eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-white leading-none mb-4"
              style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)", letterSpacing: "0.03em" }}
            >
              {slides[current].headline.map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span style={{ color: "#FFD700" }}>{line}</span> : line}
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
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-body text-white/65 leading-relaxed mb-7"
              style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", fontWeight: 300, maxWidth: "480px" }}
            >
              {slides[current].sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 font-body font-bold text-sm px-6 py-3.5 text-white group transition-all hover:opacity-90"
              style={{ background: "#C41E2A", borderRadius: "4px", boxShadow: "0 4px 16px rgba(196,30,42,0.4)" }}
            >
              {content.hero_primary_cta}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#rubros"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm px-6 py-3.5 text-white hover:bg-white/15 transition-all"
              style={{ border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: "4px" }}
            >
              {content.hero_secondary_cta}
            </a>
            <a
              href="tel:+541142644848"
              className="hidden sm:inline-flex items-center gap-2 font-body font-semibold text-sm px-4 py-3.5 text-white/75 hover:text-white transition-colors"
            >
              <Phone size={13} /> 4264-4848
            </a>
          </motion.div>

          {/* Info strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-6"
          >
            <div className="flex items-center gap-2 text-white/50">
              <MapPin size={12} style={{ color: "#FFD700", flexShrink: 0 }} />
              <span className="font-body text-xs">Collivadino 57, Temperley</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <Clock size={12} style={{ color: "#FFD700", flexShrink: 0 }} />
              <span className="font-body text-xs">Lun–Vie 7:30–18hs · Sáb 7:30–13hs</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 sm:grid-cols-4"
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="text-center py-4 sm:py-5 px-3"
            style={{
              background: i % 2 === 0 ? "rgba(13,74,114,0.88)" : "rgba(10,60,90,0.88)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="font-display text-xl sm:text-2xl text-white" style={{ letterSpacing: "0.03em" }}>{s.num}</div>
            <div className="font-body text-xs text-white/50 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: "6px",
              height: i === current ? "28px" : "6px",
              borderRadius: "3px",
              background: i === current ? "#C41E2A" : "rgba(255,255,255,0.35)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
