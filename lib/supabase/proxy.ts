import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);
  const pathname = request.nextUrl.pathname;
  const isNotesRoute = pathname === "/notes" || pathname.startsWith("/notes/");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  let redirectPath: string | null = null;

  if (isNotesRoute && !isAuthenticated) {
    redirectPath = "/login";
  } else if (isAuthRoute && isAuthenticated) {
    redirectPath = "/notes";
  }

  if (redirectPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectPath;
    redirectUrl.search = "";

    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    for (const headerName of ["cache-control", "expires", "pragma"]) {
      const headerValue = response.headers.get(headerName);

      if (headerValue) {
        redirectResponse.headers.set(headerName, headerValue);
      }
    }

    return redirectResponse;
  }

  return response;
}
