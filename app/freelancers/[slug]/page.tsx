import Link from "next/link";
import { freelancers } from "../../lib/freelancers";

export default function FreelancerProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const freelancer = freelancers.find((f) => f.slug === params.slug);

  if (!freelancer) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold">Profile not found</h1>
          <p className="mt-2 text-slate-700">
            The freelancer profile you’re looking for does not exist.
          </p>
          <Link href="/freelancers" className="mt-4 inline-block underline">
            Back to freelancers
          </Link>
        </section>
      </main>
    );
  }

  // ✅ Option 1: go back to homepage contact section with prefill params
  const hireLink = `/?freelancer=${encodeURIComponent(
    freelancer.name
  )}&categories=${encodeURIComponent(freelancer.categories.join(", "))}#contact`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/freelancers"
            className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            ← Back to freelancers
          </Link>

          <Link
            href={hireLink}
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            Hire her
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-violet-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(99,102,241,0.08)]">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {freelancer.name}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {freelancer.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-700">{freelancer.bio}</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Services offered
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {freelancer.services.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Portfolio</h2>
            <div className="mt-3 space-y-2">
              {freelancer.portfolio.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200"
                >
                  <span className="font-semibold text-slate-900">{p.label}</span>
                  <span className="block text-xs text-slate-500 break-all">
                    {p.url}
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Projects are managed through SheConnects to ensure quality and compliance.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
