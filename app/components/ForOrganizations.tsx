"use client";

import { motion } from "framer-motion";
import { SiteContent } from "../lib/translations";
import { ShieldCheck, Users, Clock, Star } from "lucide-react";

type OrgProps = {
  content: SiteContent["organizations"];
};

const icons = [ShieldCheck, Users, Clock, Star];

export default function ForOrganizations({ content }: OrgProps) {
  return (
    <section id="organizations" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 mb-4">
          For organisations
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {content.title}
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item, i) => {
          const Icon = icons[i] ?? ShieldCheck;
          return (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                <Icon size={20} className="text-brand-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
