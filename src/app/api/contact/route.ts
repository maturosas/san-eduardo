import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, zona, mensaje, presupuesto_items } = body;

    if (!nombre || !email) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const db = serverClient();

    // Build the message: if no explicit message but there are presupuesto items, auto-generate
    let mensajeFinal = mensaje || "";
    if (!mensajeFinal && presupuesto_items) {
      try {
        const items = JSON.parse(presupuesto_items);
        mensajeFinal = `Presupuesto solicitado:\n${items.map((i: { nombre: string; rubro: string; cantidad: number }) => `• ${i.nombre} (${i.rubro}) × ${i.cantidad}`).join("\n")}`;
      } catch { mensajeFinal = "Solicitud de presupuesto"; }
    }

    if (!mensajeFinal) {
      return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 });
    }

    const { error } = await db.from("consultas").insert({
      nombre,
      telefono: telefono || null,
      email,
      zona: zona || null,
      mensaje: mensajeFinal,
      presupuesto_items: presupuesto_items || null,
      estado: "nueva",
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
