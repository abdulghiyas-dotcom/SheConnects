import { cookies, headers } from "next/headers";
import { Language, defaultLanguage } from "./translations";

export function getPreferredLanguage(): Language {
  const cookieLang = cookies().get("lang")?.value as Language | undefined;
  if (cookieLang === "en" || cookieLang === "it") {
    return cookieLang;
  }

  const country = headers().get("x-vercel-ip-country");
  if (country && country.toUpperCase() === "IT") {
    return "it";
  }

  return defaultLanguage;
}
