"use client";

import { notFound } from "next/navigation";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { freelancers } from "../../lib/freelancers";
import { translations, defaultLanguage } from "../../lib/translations";

type Props = { params: { slug: string } };

// Privacy-focused Icon to replace profile pictures
const UserIcon = () => (
  <svg className="w-10 h-10 text-violet-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export default function FreelancerProfile({ params }: Props) {
  const freelancer = freelancers.find((f) => f.slug === params.slug);
  const content = translations[defaultLanguage];
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!freelancer) notFound();

  const handleSampleClick = (link: string) => {
    setActiveSample(link);
    // Smooth scroll to the previewer so the user sees the document
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header content={content.header} language="en" onLanguageChange={() => {}} languageNames={content.languageNames} />

      {/* Modern Compact Header with smaller text */}
      <div className="border-b border-slate-100 bg-slate-50/50 pt-24 pb-8">
        <div className="mx-auto max-w-5xl px-6 flex items-center gap-6">
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
            <UserIcon />
          </div>
          <div>
            <div className="flex gap-2 mb-1">
              {freelancer.categories.map(cat => (
                <span key={cat} className="text-[9px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{freelancer.name}</h1>
            <p className="text-xs text-slate-500 font-medium">{freelancer.role}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          
          {/* Portfolio Section with Scrollable Viewer */}
          <section ref={previewRef}>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Work Samples</h2>
            
            <AnimatePresence>
              {activeSample && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 shadow-inner"
                >
                  <div className="bg-white p-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 px-2">DOCUMENT PREVIEW</span>
                    <button onClick={() => setActiveSample(null)} className="text-[9px] font-bold text-red-400 hover:text-red-600 px-2">CLOSE PREVIEW ×</button>
                  </div>
                  <div className="h-[500px] overflow-y-auto bg-white">
                    <iframe src={activeSample} className="w-full h-full" title="PDF Preview" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-2">
              {freelancer.portfolio.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSampleClick(item.link)}
                  className={`flex items-center justify-between text-left p-3 rounded-lg border transition-all ${
                    activeSample === item.link ? "border-violet-400 bg-violet-50/50" : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{item.title}</h3>
                    <p className="text-[10px] text-slate-500">{item.description}</p>
                  </div>
                  <span className="text-[9px] font-bold text-violet-500 px-2 uppercase">View Sample</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bio & Services</h2>
            <p className="text-xs leading-relaxed text-slate-600 mb-4">{freelancer.bio}</p>
            <div className="flex flex-wrap gap-2">
              {freelancer.services.map((s) => (
                <span key={s} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-medium text-slate-600">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar with Integrated Hire Form */}
        <aside>
          <div className="sticky top-28 rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
            {!isFormOpen ? (
              <div className="text-center">
                <h3 className="text-sm font-bold mb-2">Hire {freelancer.name}</h3>
                <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
                  Submit a project request for this expert. Our studio handles the management to ensure quality and safety.
                </p>
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-500 transition-all"
                >
                  Start Collaboration
                </button>
              </div>
            ) : (
              <form action="https://formsubmit.co/hello@sheconnects.work" method="POST" className="space-y-3">
                {/* Subject for the email you receive */}
                <input type="hidden" name="_subject" value={`New Hire Request: ${freelancer.name}`} />
                
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Project Request</h3>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="text-[10px] text-slate-400 hover:text-white">Cancel</button>
                </div>
                
                <input required name="name" type="text" placeholder="Your Name" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-violet-500" />
                <input required name="email" type="email" placeholder="Your Email" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-violet-500" />
                <textarea required name="message" rows={4} placeholder={`Describe the project you'd like ${freelancer.name} to work on...`} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-violet-500" />
                
                <button type="submit" className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-500 transition-all">
                  Send Request
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      <Footer content={content.footer} />
    </main>
  );
}
