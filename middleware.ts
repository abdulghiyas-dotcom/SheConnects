import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes under /app/* that don't require login
const PUBLIC_APP_ROUTES = [
  "/app/sign-in",
  "/app/sign-up",
  "/app/apply",
];

// Detect whether a visitor should see Italian
// Italy (IT) and Italian-speaking Switzerland (Ticino, CH+TI) get Italian by default
function detectLocale(request: NextRequest): "en" | "it" {
  const country = request.geo?.country ?? request.headers.get("x-vercel-ip-country");
  const region = request.geo?.region;

  if (country?.toUpperCase() === "IT") return "it";
  if (country?.toUpperCase() === "CH" && region?.toUpperCase() === "TI") return "it";
  return "en";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ── Existing marketing site: lang cookie for Italian detection ──────────────
  // Preserved exactly as before — do not modify this block
  const existingLang = request.cookies.get("lang")?.value;
  if (!existingLang) {
    const locale = detectLocale(request);
    if (locale === "it") {
      response.cookies.set("lang", "it", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
  }

  // ── Platform routes (/app/*) ────────────────────────────────────────────────
  if (pathname.startsWith("/app")) {
    const isPublicRoute = PUBLIC_APP_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!isPublicRoute) {
      // Refresh the Supabase session and check auth
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const signInUrl = new URL("/app/sign-in", request.url);
        signInUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(signInUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|icon.png|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
