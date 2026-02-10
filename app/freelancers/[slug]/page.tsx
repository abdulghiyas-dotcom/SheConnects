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

export default function FreelancerProfilePage({ params }: Props) {
  const freelancer = freelancers.find((f) => f.slug === params.slug);
  const content = translations[defaultLanguage];

  if (!freelancer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header
        content={content.header}
        language="en"
        onLanguageChange={() => {}}
        languageNames={content.languageNames}
      />

      {/* Modern Profile Hero */}
      <div className="bg-gradient-to-b from-violet-50 to-white pt-20 pb-16">
        <div className="mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-[3rem] shadow-2xl ring-8 ring-white"
          >
            <img 
              src={`/freelancers/${freelancer.slug}.jpg`} 
              alt={freelancer.name} 
              className="h-full w-full object-cover" 
            />
          </motion.div>
          
          <div className="text-center md:text-left">
            <span className="inline-block rounded-full bg-violet-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-violet-700">
              Verified Expert
            </span>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              {freelancer.name}
            </h1>
            <p className="mt-2 text-2xl font-medium text-slate-500">
              {freelancer.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-3 gap-16">
        {/* Left Content Area */}
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-violet-200 decoration-4 underline-offset-8">
              About
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              {freelancer.bio}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-violet-200 decoration-4 underline-offset-8">
              Services Offered
            </h2>
            <div className="flex flex-wrap gap-3">
              {freelancer.services.map((service) => (
                <span key={service} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-700">
                  {service}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-violet-200 decoration-4 underline-offset-8">
              Portfolio & Work Samples
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {freelancer.portfolio.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl border border-slate-200 p-6 transition-all hover:border-violet-300 hover:bg-violet-50/50"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-2">
                    {item.type}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside>
          <div className="sticky top-28 rounded-[2.5rem] border border-violet-100 bg-violet-50/30 p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Hire {freelancer.name}</h3>
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              Every project is managed through our studio to ensure the highest quality and safety standards.
            </p>
            <Link 
              href="/#contact"
              className="block w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl hover:bg-violet-700 transition-all active:scale-95"
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
