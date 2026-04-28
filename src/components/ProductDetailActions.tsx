"use client";

import { useState } from "react";
import { Check, ClipboardList, MessageCircle, Phone } from "lucide-react";
import { usePresupuesto, PresupuestoItem } from "@/context/PresupuestoContext";

type Props = {
  product: Omit<PresupuestoItem, "cantidad">;
  whatsappUrl: string;
};

export default function ProductDetailActions({ product, whatsappUrl }: Props) {
  const { addItem, setIsOpen, clearNotification } = usePresupuesto();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const handleOpenBudget = () => {
    clearNotification();
    setIsOpen(true);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center justify-center gap-2 w-full py-3.5 font-body font-bold text-sm text-white transition-all hover:opacity-90"
        style={{ background: added ? "#10B981" : "#0D4A72", borderRadius: "4px" }}
      >
        {added ? <><Check size={15} /> Agregado al presupuesto</> : <><ClipboardList size={15} /> Agregar al presupuesto</>}
      </button>
      <button
        type="button"
        onClick={handleOpenBudget}
        className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm transition-all hover:opacity-90"
        style={{ background: "#E8EFF6", color: "#0D4A72", borderRadius: "4px" }}
      >
        <ClipboardList size={14} /> Ver mi presupuesto
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm text-white transition-all hover:opacity-90"
        style={{ background: "#25D366", borderRadius: "4px" }}
      >
        <MessageCircle size={14} /> Consultar por WhatsApp
      </a>
      <a
        href="tel:+541142644848"
        className="flex items-center justify-center gap-2 w-full py-3 font-body font-semibold text-sm"
        style={{ color: "#0D4A72", border: "1px solid rgba(13,74,114,0.16)", borderRadius: "4px" }}
      >
        <Phone size={14} /> Llamar al local
      </a>
    </div>
  );
}
