import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cambios y Devoluciones | San Eduardo Design",
  description: "Conocé las condiciones de cambio y devolución de materiales de construcción en San Eduardo Design, Temperley.",
};

export default function DevolucionesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20" style={{ background: "#F4F8FC" }}>
        <div className="se-container max-w-3xl">
          <Link href="/" className="font-body text-sm text-[#9DAEBF] hover:text-[#0D4A72] transition-colors mb-8 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="font-display mb-2" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#0D4A72", letterSpacing: "0.03em" }}>
            POLÍTICA DE CAMBIOS<br />Y DEVOLUCIONES
          </h1>
          <p className="font-body text-sm text-[#9DAEBF] mb-10">Última actualización: Abril 2026</p>

          <div className="space-y-8 font-body text-[#5A6A7E] leading-relaxed" style={{ fontWeight: 300 }}>
            {[
              {
                title: "1. Plazo para solicitar cambios",
                content: "Los cambios y devoluciones deben solicitarse dentro de los 30 días corridos desde la fecha de compra o retiro del material. Pasado ese plazo, no se aceptan devoluciones salvo defecto de fabricación comprobable.",
              },
              {
                title: "2. Condiciones del material",
                content: "Para aceptar una devolución o cambio, el material debe estar en su estado original: sin usar, sin cortar, sin instalar, en su embalaje original o en condiciones que permitan verificar su estado. No se aceptan devoluciones de materiales que hayan sido cortados, pegados, instalados o modificados de cualquier forma.",
              },
              {
                title: "3. Materiales excluidos",
                content: "No aplican devoluciones en: materiales mezclados o utilizados (cemento, cal, adhesivos, pinturas abiertas), piezas cortadas a medida, materiales perforados o instalados, productos con defecto causado por instalación incorrecta, y materiales perecederos una vez abiertos.",
              },
              {
                title: "4. Proceso de devolución",
                content: "Para iniciar una devolución: (1) Contactanos por teléfono o WhatsApp indicando el número de compra, los artículos a devolver y el motivo. (2) Coordinaremos la verificación del estado del material, ya sea en el local o mediante fotos. (3) Una vez aprobada la devolución, podés traer el material al local o coordinar un retiro con costo a cargo del cliente, salvo defecto de fábrica.",
              },
              {
                title: "5. Defectos de fabricación",
                content: "Si un material presenta defecto de fabricación comprobable, lo cambiamos sin costo o gestionamos la garantía del fabricante. En este caso, nos hacemos cargo del retiro del material defectuoso. El plazo para reportar defectos de fabricación es de hasta 6 meses desde la compra.",
              },
              {
                title: "6. Forma de reintegro",
                content: "Las devoluciones aprobadas se reintegran como crédito para futuras compras o mediante el mismo medio de pago original, según corresponda y a criterio de San Eduardo Design.",
              },
              {
                title: "7. Cantidades sobrantes de obra",
                content: "Aceptamos la devolución de materiales sobrantes de obra dentro del plazo de 30 días, en perfectas condiciones y con el comprobante de compra, siempre que la cantidad mínima a devolver justifique la operación (generalmente a partir de 5 m² en cerámicas o el equivalente en otros materiales).",
              },
              {
                title: "8. Consultas",
                content: "Para cualquier consulta sobre cambios y devoluciones, contactanos en info@saneduardodesign.com.ar o al 4264-4848 en horario comercial.",
              },
            ].map(section => (
              <div key={section.title}>
                <h2 className="font-body font-semibold text-[#0D4A72] mb-2" style={{ fontSize: "15px" }}>{section.title}</h2>
                <p className="text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
