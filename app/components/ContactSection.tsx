"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { useSearchParams } from "next/navigation";

// 1. Define the missing props type to fix the build error
type ContactProps = {
  content: SiteContent["contact"];
  common: SiteContent["common"];
};

// Internal form component to handle the logic
function ContactForm({ content, common }: ContactProps) {
  const searchParams = useSearchParams();
  
  // Get the freelancer name from the URL query parameter (?freelancer=Name)
  const freelancerName = searchParams.get("freelancer");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // 2. This Effect triggers auto-fill as soon as the freelancerName is hydrated from the URL
  useEffect(() => {
    if (freelancerName && !message) {
      setMessage(
        `Hello SheConnects,\n\nI’m interested in working with ${freelancerName}. Please share availability, pricing, and next steps.\n\nThank you.`
      );
    }
  }, [freelancerName, message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Contextual subject for the email
    if (freelancerName) {
      formData.append("_subject", `Hire request: ${freelancerName}`);
    } else {
      formData.append("_subject", "New contact from SheConnects website");
    }

    formData.append("_captcha", "false");

    try {
      const res = await fetch("https://formsubmit.co/hello@sheconnects.work", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setMessage(""); 
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setErrorMessage(content.error);
    }
  };

  return (
    <motion.div
      className="grid gap-10 md:grid-cols-[1.5fr,2fr]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 mb-4">
          Contact
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-3 text-base text-slate-500 leading-relaxed">
          {content.subtitle}
        </p>

        {freelancerName && (
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Inquiry for <span className="font-bold ml-1">{freelancerName}</span>
          </div>
        )}

        <p className="mt-5 text-sm text-slate-500">
          {content.emailIntro}{" "}
          <a href={`mailto:${common.contactEmail}`} className="font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2">
            {common.contactEmailLabel}
          </a>
        </p>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <input
            name="name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
            placeholder={content.namePlaceholder}
            required
          />
          <input
            name="organization"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
            placeholder={content.organizationPlaceholder}
          />
          <input
            type="email"
            name="email"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
            placeholder={content.emailPlaceholder}
            required
          />
          <textarea
            name="message"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors resize-none"
            rows={5}
            placeholder={content.messagePlaceholder}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-4 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-brand transition-all hover:bg-brand-700 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "loading" ? content.sendingLabel : content.sendLabel}
        </button>

        {status === "success" && (
          <p className="mt-3 text-sm font-medium text-trust-600">{content.success}</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">{errorMessage || content.error}</p>
        )}

        <p className="mt-3 text-[11px] text-slate-400">
          {content.dataNotice}{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-brand-600">{common.privacyPolicy}</a>.
        </p>
      </form>
    </motion.div>
  );
}

// 3. Main export with Suspense boundary to allow client-side hydration of search params
export default function ContactSection(props: ContactProps) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-64 animate-pulse bg-slate-50 rounded-2xl" />}>
        <ContactForm {...props} />
      </Suspense>
    </section>
  );
}
