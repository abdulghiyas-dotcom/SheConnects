import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy – SheConnects",
  description:
    "Learn how SheConnects collects, uses, and protects your information when you visit our site or use our services.",
};

const sections = [
  {
    title: "Information We Collect",
    description:
      "We collect information that helps us deliver reliable, ethical services while keeping your data protected.",
    items: [
      {
        label: "Personal Information",
        content:
          "Name, email address, phone number, country, job title, resume/CV details for freelancers, and company name and contact details for clients.",
      },
      {
        label: "Usage Data",
        content:
          "IP address, browser type, pages visited, time spent on pages, and referring URLs to understand how people use our site.",
      },
      {
        label: "Cookies",
        content:
          "We use cookies to enhance your experience and track website usage. You can disable cookies in your browser settings.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "Provide and manage our freelancing services",
      "Match clients with suitable freelancers",
      "Communicate with you about our platform",
      "Improve our website and services",
      "Comply with legal obligations",
    ],
  },
  {
    title: "Information Sharing and Disclosure",
    items: [
      "We do not sell your personal information.",
      "We may share data with trusted third-party service providers (e.g., hosting and email services).",
      "We may disclose information to legal authorities when required by law.",
      "During the matching process, we may share relevant details with clients and VAs with your consent.",
    ],
  },
  {
    title: "Data Security",
    description:
      "We implement appropriate technical and organizational security measures to protect your data. However, no system is 100% secure.",
  },
  {
    title: "Your Rights (Under GDPR)",
    items: [
      "Access your data",
      "Correct or delete your data",
      "Object to or restrict processing",
      "Data portability",
      "File a complaint with a data protection authority",
    ],
    description:
      "To exercise these rights, contact us at hello@sheconnects.work and we will respond promptly.",
  },
  {
    title: "Third-Party Links",
    description:
      "Our site may contain links to third-party websites. We are not responsible for their privacy practices.",
  },
  {
    title: "Changes to This Policy",
    description:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our website.",
  },
  {
    title: "Contact Us",
    description:
      "If you have any questions about this Privacy Policy or your personal data, please contact us at hello@sheconnects.work.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-14">
        <div id="hero" className="sr-only">
          Privacy Policy
        </div>
        <div id="services" className="sr-only">
          Services
        </div>
        <div id="how-it-works" className="sr-only">
          How it works
        </div>
        <div id="impact" className="sr-only">
          Impact
        </div>
        <div id="organizations" className="sr-only">
          For organizations
        </div>
        <div id="vas" className="sr-only">
          For Afghan women
        </div>
        <div id="testimonials" className="sr-only">
          Stories
        </div>
        <div id="contact" className="sr-only">
          Contact
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-violet-200 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-fuchsia-200 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between rounded-2xl border border-violet-100 bg-white/80 px-6 py-4 shadow-sm shadow-violet-100 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">SheConnects</p>
            <h1 className="text-2xl font-semibold text-slate-900">Privacy Policy</h1>
            <p className="text-sm text-slate-600">Effective Date: 12 May, 2025</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            ← Back to homepage
          </Link>
        </div>

        <div className="relative mt-6 space-y-6 rounded-3xl border border-violet-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(99,102,241,0.08)]">
          <p className="text-sm text-slate-700">
            SheConnects ("we," "our," or "us") is committed to protecting your privacy. This policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website, use our services, or interact with us.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                {section.description && (
                  <p className="mt-2 text-sm text-slate-700">{section.description}</p>
                )}

                {section.items && (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {section.items.map((item) => (
                      <li
                        key={typeof item === "string" ? item : item.label}
                        className="flex gap-3"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <span>{typeof item === "string" ? item : `${item.label}: ${item.content}`}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 text-sm text-slate-700 shadow-sm">
            <p>
              If you have questions or want to exercise your privacy rights, email us at {" "}
              <a href="mailto:hello@sheconnects.work" className="font-semibold text-violet-700 underline">
                hello@sheconnects.work
              </a>{" "}
              or visit {" "}
              <a href="https://www.sheconnects.work" className="font-semibold text-violet-700 underline">
                sheconnects.work
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
