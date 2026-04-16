import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function createSupabaseClient(): SupabaseClient {
  // During build time, env vars may be placeholders — guard against invalid URLs
  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    // Return a minimal client that will fail at runtime but not at build time
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();
