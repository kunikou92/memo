import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function hasValidSession() {
  return Boolean(await getAuthenticatedUserId());
}

export async function getAuthenticatedUserId() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    return !error && typeof userId === "string" ? userId : null;
  } catch {
    return null;
  }
}

export async function requireAuthenticatedUser() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function redirectAuthenticatedUser() {
  if (await hasValidSession()) {
    redirect("/notes");
  }
}
