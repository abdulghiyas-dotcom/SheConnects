import { notFound } from "next/navigation";
import Link from "next/link";
import { freelancers } from "../../lib/freelancers";

type Props = {
  params: { slug: string };
};

export default function FreelancerProfile({ params }: Props) {
  const freelancer = freelancers.find(f => f.slug === params.slug);

  if (!freelancer) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          href="/freelancers"
          className="mb-6 inline-block text-sm text-violet-700 underline underline-offset-2"
        >
          ← Back to freelancers
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            {freelancer.name}
          </h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {freelancer.categories.map(cat => (
              <span
                key={cat}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
              >
                {cat}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {freelancer.bio}
          </p>

          {/* Services */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Services offered
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {freelancer.services.map(service => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Portfolio */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Portfolio samples
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              PDF samples open in the same window.
            </p>

            <ul className="mt-3 space-y-2">
              {freelancer.portfolio.map(item => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    className="text-sm text-violet-700 underline underline-offset-2 hover:text-violet-900"
                  >
                    {item.label} — PDF
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hire button */}
          <div className="mt-8">
            <Link
              href={`/#contact?freelancer=${encodeURIComponent(
                freelancer.name
              )}&services=${encodeURIComponent(
                freelancer.categories.join(", ")
              )}`}
              className="inline-block rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition-transform hover:-translate-y-0.5"
            >
              Request collaboration
            </Link>

            <p className="mt-2 text-[11px] text-slate-500">
              Projects are managed through SheConnects to ensure quality and compliance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
