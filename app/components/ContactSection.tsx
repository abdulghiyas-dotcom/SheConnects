"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { useSearchParams } from "next/navigation";

// Define the missing props type
type ContactProps = {
  content: SiteContent["contact"];
  common: SiteContent["common"];
};

// Internal component to handle search params
function ContactForm({ content, common }: ContactProps) {
  const searchParams = useSearchParams();
  const freelancerName = searchParams.get("freelancer");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Auto-fill the message when a freelancer is detected
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

    // Add contextual subject line for the email
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
        
        {/* Visual Confirmation Badge */}
        {freelancerName && (
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Inquiry for <span className="font-bold ml-1">{freelancerName}</span>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          {content.emailIntro}{" "}
          <a href={`mailto:${common.contactEmail}`} className="font-medium text-violet-700 underline underline-offset-2">
            {common.contactEmailLabel}
          </a>
        </p>
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-2">
          <input name="name" className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm" placeholder={content.namePlaceholder} required />
        </div>
        <div className="mb-2">
          <input name="organization" className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm" placeholder={content.organizationPlaceholder} />
        </div>
        <div className="mb-2">
          <input type="email" name="email" className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm" placeholder={content.emailPlaceholder} required />
        </div>
        <div className="mb-2">
          <textarea
            name="message"
            className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm"
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
          className="mt-1 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {status === "loading" ? content.sendingLabel : content.sendLabel}
        </button>

        {status === "success" && <p className="mt-2 text-[11px] text-emerald-600">{content.success}</p>}
        {status === "error" && <p className="mt-2 text-[11px] text-rose-600">{errorMessage || content.error}</p>}

        <p className="mt-2 text-[11px] text-slate-400">
          {content.dataNotice}{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-violet-700">{common.privacyPolicy}</a>.
        </p>
      </form>
    </motion.div>
  );
}

// Wrapper component to provide Suspense boundary (required for useSearchParams in Next.js)
export default function ContactSection(props: ContactProps) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-64 animate-pulse bg-slate-50 rounded-2xl" />}>
        <ContactForm {...props} />
      </Suspense>
    </section>
  );
}
