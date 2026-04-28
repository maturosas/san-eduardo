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
      case "bulk_upsert_rubro_items": {
        const rows = Array.isArray(data?.rows) ? data.rows : [];
        if (rows.length === 0) {
          return NextResponse.json({ error: "No hay productos para importar" }, { status: 400 });
        }
        if (rows.length > 500) {
          return NextResponse.json({ error: "Máximo 500 productos por importación" }, { status: 400 });
        }

        let inserted = 0;
        let updated = 0;

        for (const row of rows) {
          const slug = String(row.slug || "").trim();
          const rubroId = String(row.rubro_id || data.rubro_id || "").trim();
          const payload = {
            rubro_id: rubroId,
            name: String(row.name || "").trim(),
            slug,
            description: String(row.description || ""),
            long_description: String(row.long_description || ""),
            seo_title: String(row.seo_title || ""),
            meta_description: String(row.meta_description || ""),
            price: row.price ?? null,
            promo_price: row.promo_price ?? null,
            stock: row.stock ?? null,
            image_url: row.image_url || null,
            badge: row.badge || "Disponible",
            active: row.active ?? true,
            orden: row.orden ?? 99,
          };

          if (!payload.rubro_id || !payload.name) continue;

          if (row.id) {
            const { error } = await db.from("rubro_items").update(payload).eq("id", row.id);
            if (error) throw error;
            updated += 1;
            continue;
          }

          if (slug) {
            const { data: existing, error: findError } = await db
              .from("rubro_items")
              .select("id")
              .eq("rubro_id", payload.rubro_id)
              .eq("slug", slug)
              .maybeSingle();
            if (findError) throw findError;
            if (existing?.id) {
              const { error } = await db.from("rubro_items").update(payload).eq("id", existing.id);
              if (error) throw error;
              updated += 1;
              continue;
            }
          }

          const { error } = await db.from("rubro_items").insert(payload);
          if (error) throw error;
          inserted += 1;
        }

        return NextResponse.json({ ok: true, inserted, updated });
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

      // ── TESTIMONIOS ─────────────────────────────────────
      case "upsert_testimonio": {
        const { error } = id
          ? await db.from("testimonios").update(data).eq("id", id)
          : await db.from("testimonios").insert(data);
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }
      case "delete_testimonio": {
        const { error } = await db.from("testimonios").delete().eq("id", id);
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
