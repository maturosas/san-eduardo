import { serverClient } from "@/lib/supabase";
import { CONTENT_DEFAULTS, SiteContent } from "@/lib/contentDefaults";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const db = serverClient();
    const keys = Object.keys(CONTENT_DEFAULTS);
    const { data } = await db.from("site_config").select("key,value").in("key", keys);
    const remote = Object.fromEntries((data || []).map((row: { key: string; value: string }) => [row.key, row.value || ""]));
    return { ...CONTENT_DEFAULTS, ...remote };
  } catch {
    return { ...CONTENT_DEFAULTS };
  }
}

export function splitLines(value: string) {
  return value.split("|").map(line => line.trim()).filter(Boolean);
}
