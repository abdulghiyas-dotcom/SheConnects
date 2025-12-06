"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "What is SheConnects?",
    answer:
      "SheConnects is a digital service studio powered by skilled Afghan women freelancers. We provide programming, design, translation, research, and custom digital support to organizations in Europe and beyond.",
  },
  {
    question: "How does SheConnects work?",
    answer:
      "Organizations share their needs with us, we match them with trained Afghan women freelancers, and our studio manages delivery, communication, and quality from end to end.",
  },
  {
    question: "Is SheConnects compliant with EU labor laws?",
    answer:
      "Yes. SheConnects operates as a managed service studio, not a staffing agency. Clients contract with SheConnects directly, and all work is delivered through our internal managed processes.",
  },
  {
    question: "Who are the freelancers?",
    answer:
      "Our freelancers are Afghan women with backgrounds in programming, design, translation, research, and digital operations. Many have previous experience with NGOs, social enterprises, and private sector organizations.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Our core services include programming (front-end, back-end, WordPress), document translation (Dari/Farsi/Pashto ↔ English), creative and design work, and research & data support. We also design custom support packages based on specific client needs.",
  },
  {
    question: "Do you offer custom or one-off services?",
    answer:
      "Yes. Many collaborations start with a unique or one-off request. If you don’t see your exact need listed, you can still reach out and we will design a tailored solution with you.",
  },
  {
    question: "How do I request support?",
    answer:
      "You can fill out the contact form on this website or email us at hello@sheconnects.work. We’ll follow up with clarifying questions and a proposed support model.",
  },
  {
    question: "How do you ensure quality of work?",
    answer:
      "Every freelancer goes through screening, skills assessment, and onboarding. During projects, our studio provides coordination, guidance, and review to ensure consistent and reliable output.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Pricing depends on the scope, complexity, and duration of the work. We provide transparent, project-based quotes before starting any collaboration.",
  },
  {
    question: "What social impact does my collaboration create?",
    answer:
      "Each project directly creates dignified remote work opportunities for Afghan women who face severe barriers to local employment. Your collaboration provides both income and professional continuity.",
  },
  {
    question: "How can Afghan women apply to join SheConnects?",
    answer:
      "Afghan women can apply via our website’s “Join as a freelancer” channel. Applicants are screened and, if selected, onboarded into our studio for training and potential matching with projects.",
  },
  {
    question: "Is my data safe?",
    answer:
      "We follow GDPR-aligned practices and only use your data to provide and improve our services. We do not sell your personal information. For more details, see our Privacy Policy.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base">
          If you don&apos;t see your question answered here, feel free to{" "}
          <a
            href="#contact"
            className="font-medium text-violet-700 underline underline-offset-2"
          >
            contact us
          </a>{" "}
          directly.
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/80">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm sm:text-base"
              >
                <span className="font-medium text-slate-900">
                  {item.question}
                </span>
                <span className="text-xs font-semibold text-violet-700">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="px-4 pb-3 text-sm text-slate-700 sm:text-[15px]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
