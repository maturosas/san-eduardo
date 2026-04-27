import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, zona, mensaje, presupuesto_items } = body;

    if (!nombre) {
      return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    }
    if (!email && !telefono) {
      return NextResponse.json({ error: "Falta teléfono o email" }, { status: 400 });
    }

    const db = serverClient();

    let mensajeFinal = mensaje || "";
    if (!mensajeFinal && presupuesto_items) {
      try {
        const items = JSON.parse(presupuesto_items);
        mensajeFinal = `Presupuesto:\n${items.map((i: { nombre: string; rubro: string; cantidad: number }) => `• ${i.nombre} (${i.rubro}) ×${i.cantidad}`).join("\n")}`;
      } catch { mensajeFinal = "Solicitud de presupuesto"; }
    }
    if (!mensajeFinal) mensajeFinal = "Consulta general";

    // Don't save placeholder emails
    const emailFinal = (email && !email.includes("sin-email@")) ? email : null;

    const { error } = await db.from("consultas").insert({
      nombre,
      telefono: telefono || null,
      email: emailFinal,
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
