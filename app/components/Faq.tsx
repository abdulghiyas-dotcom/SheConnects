"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteContent } from "../lib/translations";

type FaqProps = {
  content: SiteContent["faq"];
};

export default function Faq({ content }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        className="max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base">
          {content.intro}{" "}
          <a
            href="#contact"
            className="font-medium text-violet-700 underline underline-offset-2"
          >
            {content.contactLink}
          </a>{" "}
          .
        </p>
      </motion.div>

      <motion.div
        className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/80 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {content.items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={item.question}
              initial={false}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm sm:text-base hover:bg-violet-50/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-violet-400" />
                  <span className="font-medium text-slate-900">
                    {item.question}
                  </span>
                </div>

                <motion.span
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-xs font-semibold text-violet-700"
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  ▸
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-3 text-sm text-slate-700 sm:text-[15px]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
