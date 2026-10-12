const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getSupabaseEnv() {
  if (!supabaseUrl) {
    throw new Error(
      "環境変数 NEXT_PUBLIC_SUPABASE_URL が設定されていません。",
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "環境変数 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY が設定されていません。",
    );
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}
