import Link from "next/link";
import { freelancers } from "../lib/freelancers";

export default function FreelancersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Meet our freelancers
            </h1>
            <p className="mt-2 text-sm text-slate-700 sm:text-base">
              Profiles of vetted Afghan women professionals working through the SheConnects studio.
            </p>
          </div>

          <Link
            href="/#freelancers"
            className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            ← Back to homepage
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {freelancers.map((f) => (
            <Link
              key={f.slug}
              href={`/freelancers/${f.slug}`}
              className="group rounded-2xl border border-violet-50 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-violet-800">
                    {f.name}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {f.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 ring-1 ring-violet-100"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-sm font-semibold text-violet-700">
                  View →
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-700 line-clamp-3">{f.bio}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
