import { serverClient } from "@/lib/supabase";
import { TESTIMONIOS as FALLBACK } from "@/data/testimonios";
import TestimoniosGrid from "./TestimoniosGrid";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";

export default async function Testimonios({ content = CONTENT_DEFAULTS }: { content?: SiteContent }) {
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

  return <TestimoniosGrid items={items} content={content} />;
}
