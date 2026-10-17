import "server-only";

import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function readAuthenticatedUserId() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;

    return !error && typeof userId === "string" ? userId : null;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUserId() {
  "use cache: private";

  cacheLife({ stale: 30 });
  return readAuthenticatedUserId();
}

export async function hasValidSession() {
  return Boolean(await getAuthenticatedUserId());
}

export async function requireAuthenticatedUser() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function requireAuthenticatedUserForAction() {
  const userId = await readAuthenticatedUserId();

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
