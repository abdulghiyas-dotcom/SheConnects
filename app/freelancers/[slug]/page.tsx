"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { freelancers } from "../../lib/freelancers";
import { translations, defaultLanguage } from "../../lib/translations";

type Props = {
  params: {
    slug: string;
  };
};

// Simple User Icon Component for Privacy
const UserIcon = () => (
  <svg className="w-full h-full text-violet-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export default function FreelancerProfilePage({ params }: Props) {
  const freelancer = freelancers.find((f) => f.slug === params.slug);
  const content = translations[defaultLanguage];

  if (!freelancer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      <Header
        content={content.header}
        language="en"
        onLanguageChange={() => {}}
        languageNames={content.languageNames}
      />

      {/* Modern Header - Reduced text size */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-10">
        <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-32 w-32 md:h-40 md:w-40 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100 shadow-inner"
          >
            <div className="p-6">
              <UserIcon />
            </div>
          </motion.div>
          
          <div className="text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              {freelancer.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {freelancer.name}
            </h1>
            <p className="mt-1 text-lg text-slate-500 font-medium">
              {freelancer.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Left Side: Professional Summary */}
        <div className="md:col-span-2 space-y-10">
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Professional Summary
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              {freelancer.bio}
            </p>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Specific Services
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {freelancer.services.map((service) => (
                <div key={service} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="text-sm font-medium text-slate-700">{service}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2">
              Portfolio & Work Samples
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {freelancer.portfolio.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:border-violet-300 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Hiring Card */}
        <aside>
          <div className="sticky top-28 rounded-2xl bg-slate-900 p-8 text-center shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Work with {freelancer.name}</h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Submit your project details and our studio team will handle the matching and project management for you.
            </p>
            <Link 
              href="/#contact"
              className="block w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact Our Studio
            </Link>
          </div>
          
          <div className="mt-6 p-6 rounded-2xl border border-dashed border-slate-300">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Managed Service Benefits</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-xs text-slate-600">
                <span className="text-emerald-500">✓</span> Quality Assurance
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-600">
                <span className="text-emerald-500">✓</span> Secure Payments
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-600">
                <span className="text-emerald-500">✓</span> Ethical Impact
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <Footer content={content.footer} />
    </main>
  );
}
