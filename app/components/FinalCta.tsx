"use client";

import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section
      id="final-cta"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <motion.div
        className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-10 text-center shadow-lg shadow-violet-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to work with us?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-700 sm:text-base">
          Whether you need translation, research, programming, or design
          support, our trained freelancers are ready to collaborate.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
          >
            Request support
          </a>

          {/* UPDATED BUTTON BELOW */}
          <a
            href="https://airtable.com/appTu7XehOpXfYbGs/pagFNaGNJuGLQXAuV/form"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            Join as a Freelancer
          </a>
          {/* END UPDATE */}
        </div>
      </motion.div>
    </section>
  );
}
