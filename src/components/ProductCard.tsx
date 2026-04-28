"use client";

import { useState } from "react";
import { MessageCircle, ClipboardList, Check } from "lucide-react";
import { usePresupuesto, PresupuestoItem } from "@/context/PresupuestoContext";
import { getWhatsAppUrlByRubro } from "@/lib/whatsapp";
import Link from "next/link";

export type ProductCardData = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  precioPromo: number | null;
  stock: number | null;
  imagen: string | null;
  badge: string;
  rubro: string;
  rubroSlug: string;
  slug: string;
};

function getBadgeColor(badge: string): string {
  switch (badge) {
    case "Disponible": return "#10B981";
    case "Más usado": return "#0D4A72";
    case "Más conveniente": return "#1A6B9A";
    case "Nuevo": return "#4F46E5";
    case "Oferta": return "#C41E2A";
    case "Sin stock": return "#6B7280";
    case "Consultar precio": return "#5A6A7E";
    default: return "#0D4A72";
  }
}

function formatPrecio(p: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(p);
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = usePresupuesto();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const item: Omit<PresupuestoItem, "cantidad"> = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      precioPromo: product.precioPromo,
      rubro: product.rubro,
      rubroSlug: product.rubroSlug,
      imagen: product.imagen,
    };
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const waUrl = getWhatsAppUrlByRubro(`${product.nombre} (${product.rubro})`);
  const productUrl = `/productos/${product.slug}`;

  return (
    <div
      className="flex flex-col overflow-hidden group transition-all hover:-translate-y-1 duration-300"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(13,74,114,0.1)",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(13,74,114,0.06)",
      }}
    >
      {/* Image */}
      <Link
        href={productUrl}
        aria-label={`Ver producto ${product.nombre}`}
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/3", background: "#E8EFF6" }}
      >
        {product.imagen ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.imagen}
            alt={`${product.nombre} — ${product.rubro} en Temperley GBA Sur`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl" style={{ color: "#0D4A72", opacity: 0.15, letterSpacing: "0.1em" }}>SE</span>
          </div>
        )}

        {/* Badge */}
        <div
          className="absolute top-3 left-3 font-body text-xs font-bold px-2.5 py-1 uppercase tracking-wider"
          style={{
            background: getBadgeColor(product.badge),
            color: "#FFFFFF",
            borderRadius: "3px",
          }}
        >
          {product.badge || "En construcción"}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <Link
          href={productUrl}
          className="font-body font-semibold mb-1 leading-snug hover:text-[#C41E2A] transition-colors"
          style={{ fontSize: "15px", color: "#0D2A3D" }}
        >
          {product.nombre}
        </Link>
        {product.descripcion && (
          <p
            className="font-body text-xs leading-relaxed mb-3 flex-1"
            style={{ color: "#5A6A7E", fontWeight: 300 }}
          >
            {product.descripcion}
          </p>
        )}

        {/* Precio */}
        <div className="mb-4 mt-auto">
          {product.precioPromo ? (
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl" style={{ color: "#C41E2A", letterSpacing: "0.02em" }}>
                {formatPrecio(product.precioPromo)}
              </span>
              {product.precio && (
                <span className="font-body text-sm line-through" style={{ color: "#9DAEBF" }}>
                  {formatPrecio(product.precio)}
                </span>
              )}
            </div>
          ) : product.precio ? (
            <span className="font-display text-xl" style={{ color: "#0D4A72", letterSpacing: "0.02em" }}>
              {formatPrecio(product.precio)}
            </span>
          ) : (
            <span className="font-body text-sm font-medium" style={{ color: "#9DAEBF" }}>
              Consultá el precio
            </span>
          )}
          {product.stock !== null && product.stock !== undefined && (
            <p className="font-body text-xs mt-1" style={{ color: product.stock > 0 ? "#10B981" : "#9DAEBF" }}>
              {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Link
            href={productUrl}
            className="flex items-center justify-center gap-2 w-full py-2.5 font-body font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "#E8EFF6", color: "#0D4A72", borderRadius: "4px" }}
          >
            Ver detalle
          </Link>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 w-full py-2.5 font-body font-semibold text-sm transition-all"
            style={{
              background: added ? "#10B981" : "#0D4A72",
              color: "#FFFFFF",
              borderRadius: "4px",
            }}
          >
            {added ? (
              <><Check size={14} /> Agregado al presupuesto</>
            ) : (
              <><ClipboardList size={14} /> Agregar al presupuesto</>
            )}
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 font-body font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "#25D366", color: "#FFFFFF", borderRadius: "4px" }}
          >
            <MessageCircle size={14} /> Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
