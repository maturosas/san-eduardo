import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  hits.set(ip, current);
  return current.count > MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en un minuto." }, { status: 429 });
    }

    const body = await req.json();
    const { nombre, telefono, email, zona, mensaje, presupuesto_items, website, company } = body;

    if (website || company) {
      return NextResponse.json({ ok: true });
    }

    const cleanNombre = String(nombre || "").trim();
    const cleanTelefono = telefono ? String(telefono).trim() : "";
    const cleanEmail = email ? String(email).trim() : "";
    const cleanZona = zona ? String(zona).trim() : "";
    const cleanMensaje = mensaje ? String(mensaje).trim() : "";

    if (!cleanNombre) {
      return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    }
    if (!cleanEmail && !cleanTelefono) {
      return NextResponse.json({ error: "Falta teléfono o email" }, { status: 400 });
    }
    if (cleanNombre.length > 120 || cleanEmail.length > 180 || cleanTelefono.length > 60 || cleanMensaje.length > 3000) {
      return NextResponse.json({ error: "Hay campos demasiado largos" }, { status: 400 });
    }

    const db = serverClient();

    let mensajeFinal = cleanMensaje || "";
    if (!mensajeFinal && presupuesto_items) {
      try {
        const items = JSON.parse(presupuesto_items);
        mensajeFinal = `Presupuesto:\n${items.map((i: { nombre: string; rubro: string; cantidad: number }) => `• ${i.nombre} (${i.rubro}) ×${i.cantidad}`).join("\n")}`;
      } catch { mensajeFinal = "Solicitud de presupuesto"; }
    }
    if (!mensajeFinal) mensajeFinal = "Consulta general";

    // Don't save placeholder emails
    const emailFinal = (cleanEmail && !cleanEmail.includes("sin-email@")) ? cleanEmail : null;

    const { error } = await db.from("consultas").insert({
      nombre: cleanNombre,
      telefono: cleanTelefono || null,
      email: emailFinal,
      zona: cleanZona || null,
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
