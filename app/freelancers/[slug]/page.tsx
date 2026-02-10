"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { freelancers } from "../../lib/freelancers";
import { translations, defaultLanguage } from "../../lib/translations";

type Props = { params: { slug: string } };

const UserIcon = () => (
  <svg className="w-12 h-12 text-violet-200" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export default function FreelancerProfile({ params }: Props) {
  const freelancer = freelancers.find((f) => f.slug === params.slug);
  const content = translations[defaultLanguage];
  const [activeSample, setActiveSample] = useState<string | null>(null);

  if (!freelancer) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header content={content.header} language="en" onLanguageChange={() => {}} languageNames={content.languageNames} />

      {/* Compact Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 pt-24 pb-8">
        <div className="mx-auto max-w-5xl px-6 flex items-center gap-6">
          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
            <UserIcon />
          </div>
          <div>
            <div className="flex gap-2 mb-1">
              {freelancer.categories.map(cat => (
                <span key={cat} className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{freelancer.name}</h1>
            <p className="text-sm text-slate-500 font-medium">{freelancer.role}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-12">
          {/* About Section - Smaller Text */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Professional Bio</h2>
            <p className="text-sm leading-relaxed text-slate-600 max-w-2xl">{freelancer.bio}</p>
          </section>

          {/* Portfolio Section with Integrated Viewer */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Work Samples</h2>
            
            <AnimatePresence>
              {activeSample && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="mb-6 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 shadow-inner"
                >
                  <div className="bg-white p-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 px-2">DOCUMENT PREVIEW</span>
                    <button onClick={() => setActiveSample(null)} className="text-[10px] font-bold text-red-400 hover:text-red-600 px-2">CLOSE ×</button>
                  </div>
                  <div className="h-[400px] overflow-y-auto">
                    <iframe src={activeSample} className="w-full h-full" title="PDF Preview" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-3">
              {freelancer.portfolio.map((item) => (
                <button
                  key={item.title}
                  onClick={() => setActiveSample(item.link)}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    activeSample === item.link ? "border-violet-400 bg-violet-50/30" : "border-slate-100 bg-white hover:border-slate-300"
                  }`}
                >
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Services</h2>
            <div className="flex flex-wrap gap-2">
              {freelancer.services.map((s) => (
                <span key={s} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Action Card */}
        <aside>
          <div className="sticky top-28 rounded-2xl bg-slate-900 p-6 text-center shadow-lg">
            <h3 className="text-sm font-bold text-white mb-2">Hire {freelancer.name}</h3>
            <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
              Contact our managed studio to request a collaboration with this expert.
            </p>
            <Link 
              href="/#contact" 
              className="block w-full py-3 bg-violet-600 text-white rounded-xl text-xs font-bold transition-all hover:bg-violet-500 active:scale-95"
            >
              Request Collaboration
            </Link>
          </div>
        </aside>
      </div>

      <Footer content={content.footer} />
    </main>
  );
}
