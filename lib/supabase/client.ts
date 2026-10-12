import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
