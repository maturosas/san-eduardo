import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024";
const BUCKET = "media";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = form.get("token") as string;
  const file = form.get("file") as File;

  if (token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const db = serverClient();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await db.storage.from(BUCKET).upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = db.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
