import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { SiteContent } from "./types";
import { DEFAULT_SITE_CONTENT } from "./defaultData";
import { getSupabaseClient } from "../supabase/client";

const DB_PATH = path.join(process.cwd(), "public", "site-content.json");

function readLocalFallback(): SiteContent {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("[ContentService] Local file read warning, using default", err);
  }
  return DEFAULT_SITE_CONTENT;
}

function writeLocalFallback(data: SiteContent): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // In serverless / read-only production this might throw, which is normal
    console.warn("[ContentService] Local disk write skipped (normal in serverless)", err);
  }
}

/**
 * Reads content: checks Supabase cloud database first, then falls back to local JSON.
 */
export async function readStoredContent(): Promise<SiteContent> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.warn("[ContentService] Supabase read error:", error.message, error.code);
      } else if (data?.data) {
        return data.data as SiteContent;
      }
    } catch (err) {
      console.warn("[ContentService] Supabase read exception fallback to local", err);
    }
  }

  return readLocalFallback();
}

/**
 * Writes content: saves to Supabase cloud database and syncs local file when possible.
 */
export async function writeStoredContent(data: SiteContent): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("site_content").upsert({
        id: "main",
        data,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error("[ContentService] Supabase upsert error:", error);
        throw new Error(
          `Supabase Error: ${error.message} (code ${error.code || "unknown"}). Check if the 'site_content' table exists in Supabase SQL editor.`
        );
      }
    } catch (err: any) {
      console.error("[ContentService] Supabase write failed:", err);
      throw err;
    }
  }

  writeLocalFallback(data);
}

/**
 * Cached tagged getter for site content.
 * Prerenders statically and invalidates immediately when an admin writes.
 */
export const getCachedSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    return await readStoredContent();
  },
  ["site-content"],
  {
    tags: ["content-all", "content-hero", "content-projects", "content-career", "content-achievements"],
    revalidate: false, // Only revalidate on demand via revalidateTag
  }
);

/**
 * Updates site content and invalidates exact cache tags.
 */
export async function updateSiteContent(
  updates: Partial<SiteContent>,
  tagToInvalidate: string = "content-all"
): Promise<SiteContent> {
  const current = await readStoredContent();
  const merged: SiteContent = {
    ...current,
    ...updates,
  };

  await writeStoredContent(merged);

  // Invalidate the cache tag on demand
  try {
    revalidateTag(tagToInvalidate, { expire: 0 });
    revalidatePath("/", "page");
  } catch (e) {
    console.log("[Revalidate Triggered]", tagToInvalidate, e);
  }

  return merged;
}
