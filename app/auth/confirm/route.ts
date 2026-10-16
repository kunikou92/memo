import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function redirectToLogin(request: NextRequest, result: "confirmed" | "error") {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.search = "";

  if (result === "confirmed") {
    redirectUrl.searchParams.set("confirmed", "true");
  } else {
    redirectUrl.searchParams.set("error", "confirmation");
  }

  const response = NextResponse.redirect(redirectUrl);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      await supabase.auth.signOut({ scope: "local" });
      return redirectToLogin(request, "confirmed");
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      await supabase.auth.signOut({ scope: "local" });
      return redirectToLogin(request, "confirmed");
    }
  }

  return redirectToLogin(request, "error");
}
