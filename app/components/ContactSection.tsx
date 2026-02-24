"use client";

import { useSearchParams } from "next/navigation"; //
import { useEffect, useState } from "react";
// ... other imports

export default function ContactSection({ content, common }: ContactProps) {
  const searchParams = useSearchParams();
  const freelancerName = searchParams.get("freelancer"); // Get name from URL

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    message: "",
  });

  // Auto-fill the message when a freelancer is detected
  useEffect(() => {
    if (freelancerName) {
      setFormData((prev) => ({
        ...prev,
        message: `I would like to collaborate with ${freelancerName} on a project. `,
      }));
    }
  }, [freelancerName]);

  return (
    <section id="contact" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Visual Confirmation Badge */}
        {freelancerName && (
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-sm font-medium animate-in fade-in slide-in-from-top-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Inquiry for {freelancerName}
          </div>
        )}

        <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        {/* ... rest of your header section */}

        <form className="space-y-4">
          {/* ... Name, Email, Org inputs */}

          <div>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={content.messagePlaceholder}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 min-h-[150px]"
              required
            />
          </div>

          <button type="submit" className="w-full py-4 bg-violet-600 text-white rounded-full font-bold hover:bg-violet-700 transition-colors">
            {content.sendLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
