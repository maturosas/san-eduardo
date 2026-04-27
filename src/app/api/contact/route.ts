import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, zona, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("consultas").insert({
      nombre,
      telefono: telefono || null,
      email,
      zona: zona || null,
      mensaje,
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
