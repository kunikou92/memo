import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function hasValidSession() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    return !error && Boolean(data?.claims?.sub);
  } catch {
    return false;
  }
}

export async function requireAuthenticatedUser() {
  if (!(await hasValidSession())) {
    redirect("/login");
  }
}

export async function redirectAuthenticatedUser() {
  if (await hasValidSession()) {
    redirect("/notes");
  }
}
