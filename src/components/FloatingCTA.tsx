"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3"
        >
          {/* Expanded options */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2 items-end"
              >
                <a
                  href="tel:+541142644848"
                  className="flex items-center gap-3 font-body font-semibold text-sm text-white px-5 py-3 shadow-xl transition-all hover:opacity-90"
                  style={{ background: "#0D4A72", borderRadius: "50px" }}
                >
                  <Phone size={15} />
                  Llamar: 4264-4848
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20pedir%20un%20presupuesto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-body font-semibold text-sm text-white px-5 py-3 shadow-xl transition-all hover:opacity-90"
                  style={{ background: "#25D366", borderRadius: "50px" }}
                >
                  <MessageCircle size={15} />
                  Pedir presupuesto
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <button
            onClick={() => setOpen(!open)}
            className="w-14 h-14 flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105"
            style={{
              background: open ? "#0D4A72" : "#25D366",
              borderRadius: "50%",
              boxShadow: open
                ? "0 8px 24px rgba(13,74,114,0.4)"
                : "0 8px 24px rgba(37,211,102,0.4)",
            }}
            aria-label="Contacto"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <MessageCircle size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
