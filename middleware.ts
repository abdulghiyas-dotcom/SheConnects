import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existingLang = request.cookies.get("lang")?.value;

  if (!existingLang) {
    const country = request.geo?.country || request.headers.get("x-vercel-ip-country");
    if (country && country.toUpperCase() === "IT") {
      response.cookies.set("lang", "it", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/(.*)"],
};
