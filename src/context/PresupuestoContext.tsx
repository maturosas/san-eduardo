"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type PresupuestoItem = {
  id: string;
  nombre: string;
  precio: number | null;
  precioPromo: number | null;
  rubro: string;
  rubroSlug: string;
  cantidad: number;
  imagen: string | null;
};

type PresupuestoCtx = {
  items: PresupuestoItem[];
  addItem: (item: Omit<PresupuestoItem, "cantidad">) => void;
  removeItem: (id: string) => void;
  updateCantidad: (id: string, cantidad: number) => void;
  clear: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  total: number;
};

const Ctx = createContext<PresupuestoCtx | null>(null);

const LS_KEY = "se_presupuesto";

export function PresupuestoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PresupuestoItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<PresupuestoItem, "cantidad">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateCantidad = useCallback((id: string, cantidad: number) => {
    if (cantidad < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setIsOpen(false);
    localStorage.removeItem(LS_KEY);
  }, []);

  const total = items.reduce((acc, i) => {
    const precio = i.precioPromo ?? i.precio ?? 0;
    return acc + precio * i.cantidad;
  }, 0);

  return (
    <Ctx.Provider value={{ items, addItem, removeItem, updateCantidad, clear, isOpen, setIsOpen, total }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePresupuesto() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePresupuesto must be inside PresupuestoProvider");
  return ctx;
}
