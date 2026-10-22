import { createClient } from "@supabase/supabase-js";

export function getSupabaseCredentials() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  return { url, key, isConfigured: Boolean(url && key) };
}

export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function checkSupabaseHealth(): Promise<{
  configured: boolean;
  tableReady: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { configured: false, tableReady: false, error: "Environment keys not configured" };
  }

  try {
    const { error } = await supabase.from("site_content").select("id").limit(1);
    if (error) {
      return { configured: true, tableReady: false, error: error.message };
    }
    return { configured: true, tableReady: true };
  } catch (err: any) {
    return { configured: true, tableReady: false, error: err?.message || "Connection failed" };
  }
}
