import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy – SheConnects",
  description:
    "Learn how SheConnects collects, uses, and protects your information when you visit our site or use our services, including how we use cookies and analytics in line with GDPR.",
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
        label: "Cookies & Analytics",
        content:
          "We use cookies and similar technologies to understand how our website is used and to improve our services. In particular, we use Google Analytics 4 (GA4) to collect anonymized usage statistics (for example, which pages are visited and how visitors navigate the site). Analytics cookies are only activated after you provide consent via the cookie banner on our website. If you reject analytics cookies, Google Analytics will not be loaded and no analytics data will be collected about your visit. You can also disable cookies at any time in your browser settings.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "Provide and manage our freelancing and remote services",
      "Match clients with suitable freelancers and service teams in a managed way",
      "Communicate with you about our platform, projects, or opportunities",
      "Improve our website and services, including via anonymized analytics (where consent is given)",
      "Comply with legal and regulatory obligations",
    ],
  },
  {
    title: "Information Sharing and Disclosure",
    items: [
      "We do not sell your personal information.",
      "We may share data with trusted third-party service providers (e.g., hosting, email, and analytics services) who process data on our behalf and under our instructions.",
      "We may disclose information to legal authorities when required by law.",
      "During the matching process, we may share relevant details with clients and freelancers (VAs) with your knowledge and consent.",
    ],
  },
  {
    title: "Data Security",
    description:
      "We implement appropriate technical and organizational security measures to protect your data from unauthorized access, loss, misuse, or disclosure. However, no system is 100% secure, and we cannot guarantee absolute security of information transmitted or stored electronically.",
  },
  {
    title: "Your Rights (Under GDPR)",
    items: [
      "Access your data",
      "Correct or delete your data",
      "Object to or restrict processing",
      "Data portability, where applicable",
      "File a complaint with a data protection authority",
    ],
    description:
      "To exercise these rights, contact us at hello@sheconnects.work and we will respond as soon as reasonably possible.",
  },
  {
    title: "Third-Party Links",
    description:
      "Our site may contain links to third-party websites or services (for example, external resources or tools). We are not responsible for their privacy practices or content. We encourage you to review the privacy policies of any third-party websites you visit.",
  },
  {
    title: "Changes to This Policy",
    description:
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. When we make significant changes, we will update the effective date at the top of this page and, where appropriate, provide additional notice.",
  },
  {
    title: "Contact Us",
    description:
      "If you have any questions about this Privacy Policy, your personal data, or how we use cookies and analytics, please contact us at hello@sheconnects.work.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-14">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-violet-200 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-fuchsia-200 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between rounded-2xl border border-violet-100 bg-white/80 px-6 py-4 shadow-sm shadow-violet-100 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              SheConnects
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-600">
              Effective Date: 12 May, 2025
            </p>
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
            SheConnects (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
            committed to protecting your privacy. This policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website, use our services, or interact with us, in line
            with applicable data protection laws such as the GDPR.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-slate-100 bg-white/70 p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="mt-2 text-sm text-slate-700">
                    {section.description}
                  </p>
                )}

                {section.items && (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {section.items.map((item) => (
                      <li
                        key={typeof item === "string" ? item : item.label}
                        className="flex gap-3"
                      >
                        <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <span>
                          {typeof item === "string"
                            ? item
                            : `${item.label}: ${item.content}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 text-sm text-slate-700 shadow-sm">
            <p>
              If you have questions or want to exercise your privacy rights,
              email us at{" "}
              <a
                href="mailto:hello@sheconnects.work"
                className="font-semibold text-violet-700 underline"
              >
                hello@sheconnects.work
              </a>{" "}
              or visit{" "}
              <a
                href="https://www.sheconnects.work"
                className="font-semibold text-violet-700 underline"
              >
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
