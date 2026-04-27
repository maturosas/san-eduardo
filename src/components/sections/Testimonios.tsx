import { serverClient } from "@/lib/supabase";
import { TESTIMONIOS as FALLBACK } from "@/data/testimonios";
import TestimoniosGrid from "./TestimoniosGrid";

export default async function Testimonios() {
  let items = FALLBACK;

  try {
    const db = serverClient();
    const { data } = await db
      .from("testimonios")
      .select("*")
      .eq("activo", true)
      .order("orden")
      .limit(6);
    if (data && data.length > 0) {
      items = data.map((t: Record<string, unknown>) => ({
        nombre: t.nombre as string,
        barrio: (t.barrio as string) || "",
        tipoObra: (t.tipo_obra as string) || "",
        texto: t.texto as string,
        estrellas: (t.estrellas as number) || 5,
        fecha: "",
      }));
    }
  } catch { /* use fallback */ }

  return <TestimoniosGrid items={items} />;
}
