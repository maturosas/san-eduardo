import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, action, data, id } = body;

  if (token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = serverClient();

  try {
    switch (action) {
      // ── RUBROS ──────────────────────────────────────────
      case "upsert_rubro": {
        const { error } = id
          ? await db.from("rubros").update(data).eq("id", id)
          : await db.from("rubros").insert(data);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }
      case "delete_rubro": {
        const { error } = await db.from("rubros").delete().eq("id", id);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      // ── RUBRO ITEMS ──────────────────────────────────────
      case "upsert_rubro_item": {
        const { error } = id
          ? await db.from("rubro_items").update(data).eq("id", id)
          : await db.from("rubro_items").insert(data);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }
      case "delete_rubro_item": {
        const { error } = await db.from("rubro_items").delete().eq("id", id);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      // ── BLOG ─────────────────────────────────────────────
      case "upsert_blog": {
        const payload = {
          ...data,
          updated_at: new Date().toISOString(),
          published_at: data.published ? (data.published_at || new Date().toISOString()) : null,
        };
        const { error } = id
          ? await db.from("blog_posts").update(payload).eq("id", id)
          : await db.from("blog_posts").insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }
      case "delete_blog": {
        const { error } = await db.from("blog_posts").delete().eq("id", id);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      // ── CONFIG ───────────────────────────────────────────
      case "upsert_config": {
        const { error } = await db.from("site_config")
          .upsert({ ...data, updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      // ── CONSULTAS ────────────────────────────────────────
      case "update_consulta": {
        const { error } = await db.from("consultas").update(data).eq("id", id);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
