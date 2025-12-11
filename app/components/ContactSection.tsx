"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";

type ContactProps = {
  content: SiteContent["contact"];
  common: SiteContent["common"];
};

export default function ContactSection({ content, common }: ContactProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append("_subject", "New contact from SheConnects website");
    formData.append("_captcha", "false");

    try {
      const res = await fetch("https://formsubmit.co/hello@sheconnects.work", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        try {
          const data = await res.json();
          if (data?.message) {
            setErrorMessage(data.message);
          }
        } catch {
          // ignore JSON parse error
        }
      }
    } catch {
      setStatus("error");
      setErrorMessage(content.error);
    }
  };

  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        className="grid gap-8 md:grid-cols-[1.5fr,2fr]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.title}
          </h2>
          <p className="mt-2 text-sm text-slate-700 sm:text-base">
            {content.subtitle}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            {content.emailIntro}{" "}
            <a
              href={`mailto:${common.contactEmail}`}
              className="font-medium text-violet-700 underline underline-offset-2"
            >
              {common.contactEmailLabel}
            </a>
          </p>
        </div>

        <form
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="mb-2">
            <input
              name="name"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              placeholder={content.namePlaceholder}
              required
            />
          </div>

          <div className="mb-2">
            <input
              name="organization"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              placeholder={content.organizationPlaceholder}
            />
          </div>

          <div className="mb-2">
            <input
              type="email"
              name="email"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              placeholder={content.emailPlaceholder}
              required
            />
          </div>

          <div className="mb-2">
            <textarea
              name="message"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm text-slate-900"
              rows={3}
              placeholder={content.messagePlaceholder}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? content.sendingLabel : content.sendLabel}
          </button>

          {status === "success" && (
            <p className="mt-2 text-[11px] text-emerald-600">{content.success}</p>
          )}

          {status === "error" && (
            <p className="mt-2 text-[11px] text-rose-600">
              {errorMessage ? errorMessage : content.error}
            </p>
          )}

          <p className="mt-2 text-[11px] text-slate-400">
            {content.dataNotice}{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-violet-700"
            >
              {common.privacyPolicy}
            </a>
            .
          </p>
        </form>
      </motion.div>
    </section>
  );
}
