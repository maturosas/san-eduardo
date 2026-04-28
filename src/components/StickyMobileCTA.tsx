"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePresupuesto } from "@/context/PresupuestoContext";

export default function StickyMobileCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const { items, setIsOpen, clearNotification } = usePresupuesto();
  const count = items.reduce((a, i) => a + i.cantidad, 0);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openBudget = () => {
    clearNotification();
    if (count > 0) {
      setIsOpen(true);
      return;
    }
    const contacto = document.getElementById("contacto");
    if (contacto) contacto.scrollIntoView({ behavior: "smooth" });
    else window.location.href = "/#contacto";
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
          style={{ boxShadow: "0 -4px 20px rgba(13,74,114,0.15)" }}
        >
          <div className="grid grid-cols-2" style={{ background: "#0D4A72" }}>
            <button
              type="button"
              onClick={openBudget}
              className="flex items-center justify-center gap-2 py-4 font-body font-bold text-sm text-white border-r border-white/15"
            >
              <ClipboardList size={15} />
              {count > 0 ? `Mi presupuesto (${count})` : "Quiero mi presupuesto"}
            </button>
            <a
              href="https://api.whatsapp.com/send?phone=5491121613339&text=Hola%2C%20quiero%20consultar%20materiales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 font-body font-bold text-sm text-white"
              style={{ background: "#25D366" }}
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
