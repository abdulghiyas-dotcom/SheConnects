"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const teacherProfileUrl = "/freelancers/farwa";
const externalTeacherProfileUrl = "https://www.sheconnects.work/freelancers/farwa";
const contactEmail = "hello@sheconnects.work";

type LandingLanguage = "fa" | "en";

type Copy = {
  dir: "rtl" | "ltr";
  langName: string;
  switchLabel: string;
  nav: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    impact: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string[];
    price: string;
    schedule: string;
  };
  why: {
    eyebrow: string;
    title: string;
    body: string[];
    cards: { title: string; text: string }[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  overview: {
    eyebrow: string;
    title: string;
    stats: { label: string; value: string; detail: string }[];
    levels: { title: string; items: string[] }[];
  };
  ages: {
    eyebrow: string;
    title: string;
    groups: { title: string; items: string[] }[];
  };
  teacher: {
    eyebrow: string;
    title: string;
    bio: string;
    details: string[];
    philosophyTitle: string;
    philosophy: string;
    cta: string;
    video: string;
  };
  impact: {
    eyebrow: string;
    title: string;
    text: string;
    items: string[];
    statement: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: { quote: string; parent: string; location: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };
  form: {
    eyebrow: string;
    title: string;
    text: string;
    fields: {
      parentName: string;
      childName: string;
      childAge: string;
      country: string;
      farsiLevel: string;
      email: string;
      countryCode: string;
      phone: string;
    };
    primaryCta: string;
    secondaryCta: string;
    privacy: string;
    note: string;
  };
  footer: {
    tagline: string;
    profile: string;
    contact: string;
    copyright: string;
  };
};

const copy: Record<LandingLanguage, Copy> = {
  fa: {
    dir: "rtl",
    langName: "فارسی",
    switchLabel: "زبان صفحه",
    nav: [
      { label: "چرا فارسی؟", href: "#why" },
      { label: "برنامه", href: "#program" },
      { label: "استاد", href: "#teacher" },
      { label: "ثبت‌نام", href: "#enroll" },
    ],
    hero: {
      eyebrow: "برنامه آنلاین زبان مادری برای کودکان خانواده‌های فارسی‌زبان در اروپا",
      title: "به فرزندتان کمک کنید زبان مادری را زنده نگه دارد",
      subtitle:
        "صنف‌های آنلاین، زنده و تعاملی فارسی/دری برای کودکان خانواده‌های فارسی‌زبان در اروپا؛ با تدریس یک آموزگار باتجربه از افغانستان.",
      impact:
        "فرزند شما زبان مادری‌اش را می‌آموزد و هم‌زمان به زنانی در افغانستان کمک می‌کند که در این وضعیت سخت از بسیاری فرصت‌های کار محروم شده‌اند.",
      primaryCta: "همین حالا ثبت‌نام کنید",
      secondaryCta: "جزئیات برنامه",
      trust: ["صنف‌های زنده آنلاین", "گروه‌های کوچک", "آموزگار باتجربه", "مناسب سنین ۵ تا ۱۶"],
      price: "€59 + VAT در ماه",
      schedule: "۳ جلسه زنده در هفته",
    },
    why: {
      eyebrow: "چرا زبان مادری مهم است؟",
      title: "زبان فقط کلمه نیست؛ بخشی از هویت، خاطره و خانواده است.",
      body: [
        "بسیاری از کودکان مهاجر در اروپا آرام‌آرام ارتباط زبانی خود را با پدرکلان، مادرکلان و خانواده در افغانستان از دست می‌دهند.",
        "وقتی کودک زبان مادری خود، فارسی/دری، را می‌آموزد، می‌تواند قصه‌های خانواده را بفهمد، با عزیزان خود حرف بزند و با اعتمادبه‌نفس بگوید: من ریشه دارم.",
      ],
      cards: [
        { title: "پیوند با خانواده", text: "گفت‌وگو با اعضای خانواده در افغانستان و اروپا آسان‌تر و گرم‌تر می‌شود." },
        { title: "اعتمادبه‌نفس فرهنگی", text: "کودکان یاد می‌گیرند به زبان، نام و فرهنگ خود افتخار کنند." },
        { title: "مهارت‌های پایدار", text: "خواندن، نوشتن و صحبت کردن به فارسی پایه‌ای برای یادگیری عمیق‌تر می‌سازد." },
      ],
    },
    benefits: {
      eyebrow: "چرا والدین این برنامه را انتخاب می‌کنند؟",
      title: "آموزش ساختارمند، گرم و مناسب زندگی خانواده‌های فارسی‌زبان در اروپا",
      items: [
        "نصاب مرحله‌به‌مرحله با تمرکز بر خواندن، نوشتن و صحبت کردن",
        "روش‌های آموزشی مناسب سن و سطح کودک",
        "یادگیری آنلاین تعاملی با فعالیت، تمرین و گفت‌وگو",
        "آموزگار بومی فارسی/دری با تجربه تدریس کودکان",
        "محیط گروهی کوچک برای توجه بیشتر به هر شاگرد",
        "زمان‌بندی قابل‌تنظیم برای خانواده‌های ساکن اروپا",
        "حمایت مستقیم از زنان در افغانستان از طریق SheConnects",
      ],
    },
    overview: {
      eyebrow: "جزئیات برنامه",
      title: "یک مسیر روشن برای پیشرفت در چهار ماه",
      stats: [
        { label: "هزینه", value: "€59 + VAT", detail: "در ماه" },
        { label: "تقریباً", value: "€4.90", detail: "برای هر جلسه" },
        { label: "برنامه هفتگی", value: "۳ جلسه", detail: "زنده آنلاین" },
        { label: "طول سمستر", value: "۴ ماه", detail: "برای هر مرحله" },
      ],
      levels: [
        { title: "سطح ابتدایی", items: ["الفبا", "تلفظ", "سلام و احوال‌پرسی", "واژگان پایه", "ساختن جمله‌های ساده"] },
        { title: "سطح متوسط", items: ["خواندن متن‌های کوتاه", "پایه‌های دستور زبان", "جمله‌سازی", "تمرین گفت‌وگوی روزمره"] },
        { title: "سطح پیشرفته", items: ["خواندن روان", "نوشتن پاراگراف", "دستور زبان پیشرفته", "بحث و گفت‌وگو", "بیان روشن و خلاق"] },
      ],
    },
    ages: {
      eyebrow: "گروه‌های سنی",
      title: "هر کودک با روش مناسب سن خود یاد می‌گیرد",
      groups: [
        { title: "۵ تا ۷ سال", items: ["بازی", "تصویر", "آهنگ", "تکرار", "واژگان ساده"] },
        { title: "۸ تا ۱۲ سال", items: ["قصه‌های کوتاه", "تمرین خواندن", "گسترش واژگان", "نوشتن جمله‌های ساده", "فعالیت‌های گفتاری"] },
        { title: "۱۳ تا ۱۶ سال", items: ["درس‌های منظم دستور زبان", "تمرین نوشتن", "درک مطلب", "بحث", "فعالیت‌های پیشرفته گفتاری"] },
      ],
    },
    teacher: {
      eyebrow: "با استاد خود آشنا شوید",
      title: "فروه؛ آموزگار فارسی‌زبان و علاقه‌مند به آموزش کودکان",
      bio:
        "فروه آموزگار آنلاین فارسی/دری و مترجم است. او برای شاگردان غیرفارسی‌زبان درس‌های ساده، قابل‌فهم و اعتمادساز طراحی می‌کند و با استفاده از روش‌های دو‌زبانه به کودکان کمک می‌کند تلفظ، واژگان و گفت‌وگوی روزمره را قدم‌به‌قدم یاد بگیرند.",
      details: ["آموزگار باتجربه", "فارسی/دری زبان مادری اوست", "علاقه‌مند به کار با کودکان", "آشنا با نیازهای خانواده‌های فارسی‌زبان در مهاجرت"],
      philosophyTitle: "فلسفه آموزشی",
      philosophy:
        "کودکان زمانی بهتر یاد می‌گیرند که احساس امنیت، شادی و ارتباط کنند. فروه آموزش زبان را با فرهنگ، خانواده و اعتمادبه‌نفس پیوند می‌دهد.",
      cta: "دیدن پروفایل فروه",
      video: "نمونه تدریس فروه",
    },
    impact: {
      eyebrow: "تأثیر اجتماعی",
      title: "فرزند شما می‌آموزد. یک زن کار می‌کند.",
      text:
        "SheConnects یک استارتاپ اثر اجتماعی است که به زنان در افغانستان کمک می‌کند در شرایط سخت کنونی، زمانی که بسیاری از آنان امکان کار حضوری یا دسترسی عادی به فرصت‌های شغلی را ندارند، به کار دورکار و درآمد معنادار دسترسی پیدا کنند. این برنامه فقط یک کورس زبان نیست؛ هر ثبت‌نام به آموزش کودک شما و ادامه کار یک زن متخصص در افغانستان کمک می‌کند.",
      items: ["حفظ زبان و فرهنگ افغانستان", "حمایت از آموزش باکیفیت", "ایجاد فرصت درآمد برای زنان در افغانستان", "کمک به آموزگاران باتجربه برای ادامه حرفه خود"],
      statement: "آموزش فرزند شما می‌تواند آینده خانواده دیگری را بسازد.",
    },
    testimonials: {
      eyebrow: "نظر خانواده‌ها",
      title: "داستان‌هایی که می‌خواهیم برای خانواده‌های فارسی‌زبان بسازیم",
      items: [
        { quote: "دخترم حالا با مادربزرگش به فارسی حرف می‌زند و خودش از یاد گرفتن کلمات تازه خوشحال است.", parent: "مادر یک شاگرد ۸ ساله", location: "آلمان" },
        { quote: "کلاس‌ها گرم و تعاملی است. فرزند ما احساس نمی‌کند در یک درس خشک نشسته؛ بازی می‌کند و یاد می‌گیرد.", parent: "پدر یک شاگرد ۶ ساله", location: "هالند" },
        { quote: "برای ما مهم بود که پرداخت ما هم به آموزش فرزندمان کمک کند و هم از کار یک زن در افغانستان حمایت کند.", parent: "والدین یک شاگرد ۱۲ ساله", location: "سویدن" },
      ],
    },
    faq: {
      eyebrow: "پرسش‌های رایج",
      title: "پاسخ‌های کوتاه برای تصمیم بهتر",
      items: [
        { question: "چه گروه‌های سنی می‌توانند شرکت کنند؟", answer: "برنامه برای کودکان و نوجوانان ۵ تا ۱۶ سال طراحی شده است و گروه‌ها بر اساس سن و سطح تنظیم می‌شوند." },
        { question: "آیا کودک باید از قبل فارسی بلد باشد؟", answer: "نه. کودکان می‌توانند از سطح ابتدایی شروع کنند. اگر کودک فارسی را در خانه شنیده باشد، سطح مناسب‌تری برای او پیشنهاد می‌شود." },
        { question: "صنف‌ها چگونه برگزار می‌شوند؟", answer: "صنف‌ها به‌صورت زنده آنلاین، در گروه‌های کوچک و با فعالیت‌های تعاملی برگزار می‌شود." },
        { question: "چه تکنالوژی لازم است؟", answer: "یک موبایل، تبلت یا کمپیوتر با اینترنت پایدار، میکروفون و دوربین کافی است." },
        { question: "آیا شاگردان بر اساس سن یا سطح گروه‌بندی می‌شوند؟", answer: "هر دو معیار در نظر گرفته می‌شود تا کودک در گروهی قرار بگیرد که هم مناسب سن و هم مناسب توانایی زبانی او باشد." },
        { question: "هر جلسه چقدر طول می‌کشد؟", answer: "مدت دقیق جلسه هنگام تشکیل گروه اعلام می‌شود و برای سن کودکان مناسب‌سازی می‌گردد." },
        { question: "آیا می‌توان وسط سمستر اضافه شد؟", answer: "در صورت موجود بودن جای خالی و مناسب بودن سطح، امکان پیوستن میان‌سمستر بررسی می‌شود." },
        { question: "SheConnects چگونه از زنان در افغانستان حمایت می‌کند؟", answer: "SheConnects برای زنان در افغانستان فرصت‌های کاری دورکار و درآمدزا ایجاد می‌کند؛ مخصوصاً در شرایطی که بسیاری از زنان نمی‌توانند مثل گذشته کار کنند یا به فرصت‌های شغلی دسترسی داشته باشند." },
      ],
    },
    form: {
      eyebrow: "ثبت‌نام",
      title: "علاقه‌مندی خود را ثبت کنید",
      text: "فرم را پر کنید تا برای زمان‌بندی، سطح‌بندی و شروع اولین سمستر با شما تماس بگیریم.",
      fields: {
        parentName: "نام والدین",
        childName: "نام کودک",
        childAge: "سن کودک",
        country: "کشور محل زندگی",
        farsiLevel: "سطح فارسی کودک",
        email: "ایمیل",
        countryCode: "کد کشور",
        phone: "شماره تماس",
      },
      primaryCta: "ثبت‌نام کنید",
      secondaryCta: "ثبت علاقه‌مندی",
      privacy: "اطلاعات شما فقط برای تماس درباره همین برنامه استفاده می‌شود و با شخص ثالث به اشتراک گذاشته نمی‌شود.",
      note: "پس از ارسال، یک ایمیل آماده می‌شود تا جزئیات را به تیم SheConnects بفرستید.",
    },
    footer: {
      tagline: "کار دیجیتال با اثر انسانی — فرصت برای زنان در افغانستان، کیفیت برای خانواده‌ها.",
      profile: "پروفایل فروه",
      contact: "تماس",
      copyright: "تمام حقوق محفوظ است.",
    },
  },
  en: {
    dir: "ltr",
    langName: "English",
    switchLabel: "Page language",
    nav: [
      { label: "Why Farsi", href: "#why" },
      { label: "Program", href: "#program" },
      { label: "Teacher", href: "#teacher" },
      { label: "Enroll", href: "#enroll" },
    ],
    hero: {
      eyebrow: "Online mother-tongue Farsi program for children in Europe",
      title: "Help Your Child Keep Their Mother Tongue Alive",
      subtitle:
        "Interactive live online Farsi/Dari classes for children living in Europe, taught by an experienced teacher from Afghanistan.",
      impact:
        "Your child learns their mother tongue while supporting women in Afghanistan who are facing severe restrictions on work and opportunity.",
      primaryCta: "Enroll Now",
      secondaryCta: "Learn More",
      trust: ["Live online classes", "Small groups", "Experienced teacher", "Ages 5–16"],
      price: "€59 + VAT/month",
      schedule: "3 live sessions per week",
    },
    why: {
      eyebrow: "Why mother tongue matters",
      title: "Language is more than vocabulary; it is identity, memory, and family connection.",
      body: [
        "Many children growing up abroad gradually lose the language that connects them to grandparents, relatives, stories, and Afghanistan.",
        "When children learn their mother tongue, Farsi/Dari, they can speak with family, understand their roots, and grow with the confidence of knowing where they come from.",
      ],
      cards: [
        { title: "Family connection", text: "Children can communicate more warmly with relatives in Afghanistan and across Europe." },
        { title: "Cultural confidence", text: "They learn to feel proud of their language, family story, and identity." },
        { title: "Lasting skills", text: "Reading, writing, and speaking foundations create a path for deeper learning." },
      ],
    },
    benefits: {
      eyebrow: "Why parents choose this program",
      title: "Structured, warm, and built for Farsi-speaking families living in Europe",
      items: [
        "Step-by-step curriculum for reading, writing, and speaking",
        "Age-appropriate teaching methods",
        "Interactive online learning with activities and conversation",
        "Native Farsi/Dari-speaking teacher with children’s teaching experience",
        "Small group environment with more attention for every child",
        "Flexible for families living in European time zones",
        "Directly supports women in Afghanistan through SheConnects",
      ],
    },
    overview: {
      eyebrow: "Program overview",
      title: "A clear four-month path for steady progress",
      stats: [
        { label: "Price", value: "€59 + VAT", detail: "per month" },
        { label: "Approx.", value: "€4.90", detail: "per session" },
        { label: "Weekly schedule", value: "3 sessions", detail: "live online" },
        { label: "Semester length", value: "4 months", detail: "per semester" },
      ],
      levels: [
        { title: "Beginner", items: ["Alphabet", "Pronunciation", "Greetings", "Basic vocabulary", "Simple sentence formation"] },
        { title: "Intermediate", items: ["Reading short texts", "Grammar foundations", "Sentence building", "Daily conversation practice"] },
        { title: "Advanced", items: ["Fluent reading", "Paragraph writing", "Advanced grammar", "Discussions", "Expressive communication"] },
      ],
    },
    ages: {
      eyebrow: "Age groups",
      title: "Each child learns through methods suited to their age",
      groups: [
        { title: "Ages 5–7", items: ["Games", "Visuals", "Songs", "Repetition", "Simple vocabulary"] },
        { title: "Ages 8–12", items: ["Short stories", "Reading practice", "Vocabulary development", "Writing simple sentences", "Speaking activities"] },
        { title: "Ages 13–16", items: ["Structured grammar lessons", "Writing practice", "Reading comprehension", "Discussions", "Advanced speaking activities"] },
      ],
    },
    teacher: {
      eyebrow: "Meet your teacher",
      title: "Farwa, a native Farsi/Dari-speaking educator passionate about teaching children",
      bio:
        "Farwa is an online Persian (Dari) teacher and translator. She creates beginner-friendly lessons for non-native learners, using bilingual explanations to build vocabulary, pronunciation, conversation skills, and confidence step by step.",
      details: ["Experienced educator", "Native Farsi/Dari speaker", "Passionate about teaching children", "Understands diaspora family needs"],
      philosophyTitle: "Teaching philosophy",
      philosophy:
        "Children learn best when they feel safe, joyful, and connected. Farwa links language learning with culture, family, and confidence.",
      cta: "Meet Farwa",
      video: "Farwa teaching sample",
    },
    impact: {
      eyebrow: "Social impact",
      title: "Your Child Learns. A Woman Works.",
      text:
        "SheConnects is a social-impact startup helping women in Afghanistan access remote work during a difficult situation in which many cannot work or reach normal job opportunities. This is not just a language course: every enrollment supports your child’s education and meaningful income for a skilled woman in Afghanistan.",
      items: ["Preserving language and culture", "Supporting quality education", "Creating income opportunities for women in Afghanistan", "Helping experienced educators continue their profession"],
      statement: "Your child’s education helps build another family’s future.",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "The kind of progress we want Farsi-speaking families to experience",
      items: [
        { quote: "My daughter now speaks Farsi with her grandmother and feels excited when she learns new words.", parent: "Parent of an 8-year-old", location: "Germany" },
        { quote: "The classes feel warm and interactive. Our child does not feel like it is a dry lesson; he plays and learns.", parent: "Parent of a 6-year-old", location: "Netherlands" },
        { quote: "We loved that our payment helps our child learn and also supports a woman’s work in Afghanistan.", parent: "Parents of a 12-year-old", location: "Sweden" },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Clear answers for confident enrollment",
      items: [
        { question: "What age groups can join?", answer: "The program is designed for children and teens ages 5–16, with groups organized by age and language level." },
        { question: "Do children need prior knowledge of Farsi?", answer: "No. Children can start at beginner level. If your child has heard Farsi at home, we will recommend the right level." },
        { question: "How are classes conducted?", answer: "Classes are live online, held in small groups, and include interactive activities, speaking practice, and guided learning." },
        { question: "What technology is required?", answer: "A phone, tablet, or computer with a stable internet connection, microphone, and camera is enough." },
        { question: "Are classes grouped by age or level?", answer: "Both are considered so every child joins a group that fits their age and current Farsi ability." },
        { question: "How long is each session?", answer: "The exact session length is confirmed when groups are formed and is adapted to the age of the children." },
        { question: "Can students join mid-semester?", answer: "If there is availability and the level is a good fit, mid-semester enrollment can be considered." },
        { question: "How does SheConnects support women in Afghanistan?", answer: "SheConnects creates remote, income-generating opportunities for women in Afghanistan so they can continue using professional skills such as online teaching despite severe limits on work access." },
      ],
    },
    form: {
      eyebrow: "Enrollment",
      title: "Register your interest",
      text: "Fill out the form and we will contact you about scheduling, level placement, and the next semester start.",
      fields: {
        parentName: "Parent Name",
        childName: "Child Name",
        childAge: "Child Age",
        country: "Country",
        farsiLevel: "Child's Farsi Level",
        email: "Email Address",
        countryCode: "Country Code",
        phone: "Phone Number",
      },
      primaryCta: "Enroll Now",
      secondaryCta: "Register Interest",
      privacy: "Your information will only be used to contact you about this program and will not be shared with third parties.",
      note: "After submitting, an email draft will open so you can send the details to the SheConnects team.",
    },
    footer: {
      tagline: "Digital work with human impact — opportunity for women in Afghanistan, quality for families.",
      profile: "Farwa profile",
      contact: "Contact",
      copyright: "All rights reserved.",
    },
  },
};

const sectionClass = "mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8";

export default function FarsiProgramLandingPage() {
  const [language, setLanguage] = useState<LandingLanguage>("fa");
  const content = copy[language];
  const isRtl = content.dir === "rtl";

  const inputAlign = isRtl ? "text-right" : "text-left";
  const teacherName = language === "fa" ? "فروه" : "Farwa";

  const mailSubject = useMemo(
    () => encodeURIComponent("Farsi program enrollment interest"),
    []
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = encodeURIComponent(
      [
        "Farsi program enrollment interest",
        "",
        `Parent Name: ${data.get("parentName") ?? ""}`,
        `Child Name: ${data.get("childName") ?? ""}`,
        `Child Age: ${data.get("childAge") ?? ""}`,
        `Country: ${data.get("country") ?? ""}`,
        `Child Farsi Level: ${data.get("farsiLevel") ?? ""}`,
        `Email: ${data.get("email") ?? ""}`,
        `Country Code: ${data.get("countryCode") ?? ""}`,
        `Phone: ${data.get("phone") ?? ""}`,
      ].join("\n")
    );

    window.location.href = `mailto:${contactEmail}?subject=${mailSubject}&body=${body}`;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" dir={content.dir} lang={language}>
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3" aria-label="Farsi program navigation">
          <Link href="/" className="flex items-center gap-3" aria-label="SheConnects home">
            <Image src="/icon.png" alt="SheConnects logo" width={44} height={44} className="rounded-full" priority />
            <div className={isRtl ? "text-right" : "text-left"}>
              <p className="text-sm font-semibold tracking-tight text-slate-900">SheConnects</p>
              <p className="text-[11px] font-medium text-slate-500">Mother-tongue Farsi</p>
            </div>
          </Link>

          <div className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
            {content.nav.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-violet-700">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 p-1" aria-label={content.switchLabel}>
            {(["fa", "en"] as LandingLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  language === lang
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-600 hover:text-violet-700"
                }`}
                aria-pressed={language === lang}
              >
                {copy[lang].langName}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-fuchsia-50">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_30%)]" />
        <div className={`${sectionClass} relative grid items-center gap-10 py-20 lg:grid-cols-[1.08fr_0.92fr]`}>
          <div>
            <p className="inline-flex rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
              {content.hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {content.hero.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl">{content.hero.subtitle}</p>
            <p className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-base font-medium leading-7 text-amber-900">
              {content.hero.impact}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#enroll" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                {content.hero.primaryCta}
              </a>
              <a href="#program" className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-7 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50">
                {content.hero.secondaryCta}
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {content.hero.trust.map((item) => (
                <div key={item} className="rounded-2xl border border-white bg-white/80 p-3 text-center text-sm font-semibold text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-2xl shadow-violet-100 backdrop-blur">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 p-1">
              <div className="rounded-[1.25rem] bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
                    {language === "fa" ? "ف" : "F"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{teacherName}</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">{content.teacher.title}</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-violet-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{content.overview.stats[0].label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">{content.hero.price}</p>
                  </div>
                  <div className="rounded-2xl bg-fuchsia-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-700">{content.overview.stats[2].label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-950">{content.hero.schedule}</p>
                  </div>
                </div>
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                  <video className="aspect-video w-full" controls preload="metadata" aria-label={content.teacher.video}>
                    <source src="/portfolio/Farwa_teaching.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{content.teacher.philosophy}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className={sectionClass}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.why.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.why.title}</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            {content.why.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.why.cards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-950">{card.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className={sectionClass}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.benefits.eyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.benefits.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.benefits.items.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">✓</span>
                <p className="leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="program" className={sectionClass}>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.overview.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.overview.title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.overview.stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-violet-700">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-600">{stat.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {content.overview.levels.map((level) => (
            <article key={level.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">{level.title}</h3>
              <ul className="mt-5 space-y-3 text-slate-700">
                {level.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-violet-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-violet-100 bg-gradient-to-br from-violet-50 to-white">
        <div className={sectionClass}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.ages.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.ages.title}</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {content.ages.groups.map((group) => (
              <article key={group.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-violet-100">
                <h3 className="text-2xl font-bold text-slate-950">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="teacher" className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/70">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-6xl font-bold text-violet-700">{language === "fa" ? "ف" : "F"}</div>
              </div>
              <h2 className="mt-5 text-3xl font-bold text-slate-950">{teacherName}</h2>
              <p className="mt-2 text-violet-700">Online Persian (Dari) Teacher</p>
              <Link href={teacherProfileUrl} className="mt-5 inline-flex rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">
                {content.teacher.cta}
              </Link>
              <a href={externalTeacherProfileUrl} className="mt-3 text-xs font-semibold text-slate-500 underline hover:text-violet-700">
                sheconnects.work/freelancers/farwa
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.teacher.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.teacher.title}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">{content.teacher.bio}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.teacher.details.map((detail) => (
                <div key={detail} className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold text-slate-700 shadow-sm">
                  {detail}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="text-xl font-bold text-amber-950">{content.teacher.philosophyTitle}</h3>
              <p className="mt-3 leading-7 text-amber-900">{content.teacher.philosophy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className={sectionClass}>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-300">{content.impact.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{content.impact.title}</h2>
              <p className="mt-6 text-lg leading-8 text-slate-200">{content.impact.text}</p>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-6 ring-1 ring-white/15">
              <ul className="space-y-4">
                {content.impact.items.map((item) => (
                  <li key={item} className="flex gap-3 text-lg text-slate-100">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fuchsia-400 text-sm font-bold text-slate-950">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 rounded-3xl bg-white p-6 text-2xl font-bold leading-9 text-slate-950">
                {content.impact.statement}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.testimonials.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.testimonials.title}</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {content.testimonials.items.map((testimonial) => (
            <figure key={testimonial.quote} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <blockquote className="text-lg leading-8 text-slate-700">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-violet-700">
                {testimonial.parent} · {testimonial.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className={sectionClass}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">{content.faq.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{content.faq.title}</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {content.faq.items.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none text-lg font-bold text-slate-950 marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enroll" className={sectionClass}>
        <div className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 shadow-2xl shadow-violet-200 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
          <div className="p-4 text-white lg:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-100">{content.form.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{content.form.title}</h2>
            <p className="mt-5 text-lg leading-8 text-violet-50">{content.form.text}</p>
            <div className="mt-8 rounded-3xl bg-white/15 p-5 ring-1 ring-white/20">
              <p className="text-2xl font-bold">{content.hero.price}</p>
              <p className="mt-2 text-violet-50">{content.hero.schedule} · {content.overview.stats[3].value}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-white p-5 shadow-xl sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.parentName}
                <input name="parentName" required className={`mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${inputAlign}`} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.childName}
                <input name="childName" required className={`mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${inputAlign}`} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.childAge}
                <input name="childAge" required inputMode="numeric" className={`mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${inputAlign}`} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.country}
                <input name="country" required className={`mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${inputAlign}`} />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.farsiLevel}
                <select name="farsiLevel" required className={`mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${inputAlign}`}>
                  <option value="">{language === "fa" ? "انتخاب کنید" : "Select one"}</option>
                  <option value="Beginner">{language === "fa" ? "ابتدایی / آشنایی کم" : "Beginner / little exposure"}</option>
                  <option value="Understands but does not speak">{language === "fa" ? "می‌فهمد، اما کم صحبت می‌کند" : "Understands but speaks little"}</option>
                  <option value="Conversational">{language === "fa" ? "گفت‌وگوی روزمره" : "Conversational"}</option>
                  <option value="Reads and writes">{language === "fa" ? "خواندن و نوشتن بلد است" : "Can read and write"}</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.email}
                <input name="email" type="email" required dir="ltr" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.countryCode}
                <input name="countryCode" type="tel" required dir="ltr" placeholder="+49" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {content.form.fields.phone}
                <input name="phone" type="tel" required dir="ltr" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800">
                {content.form.primaryCta}
              </button>
              <a href={`mailto:${contactEmail}?subject=${mailSubject}`} className="inline-flex flex-1 items-center justify-center rounded-full border border-violet-200 px-7 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
                {content.form.secondaryCta}
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">{content.form.privacy}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{content.form.note}</p>
          </form>
        </div>
      </section>

      <footer className="border-t border-violet-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="SheConnects logo" width={52} height={52} className="rounded-full" />
            <div>
              <p className="font-bold text-slate-950">SheConnects SRL</p>
              <p className="mt-1 max-w-xl">{content.footer.tagline}</p>
              <p className="mt-1 text-xs text-slate-500">P. IVA 14470870966</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <a href={`mailto:${contactEmail}`} className="font-semibold text-violet-700 underline">
              {content.footer.contact}: {contactEmail}
            </a>
            <Link href={teacherProfileUrl} className="font-semibold text-violet-700 underline">
              {content.footer.profile}
            </Link>
            <a href="https://www.instagram.com/sheconnects.work" aria-label="Instagram" className="font-semibold text-slate-700 hover:text-violet-700">Instagram</a>
            <a href="https://www.linkedin.com/company/sheconnects-work" aria-label="LinkedIn" className="font-semibold text-slate-700 hover:text-violet-700">LinkedIn</a>
            <div className="flex rounded-full border border-violet-100 bg-violet-50 p-1">
              {(["fa", "en"] as LandingLanguage[]).map((lang) => (
                <button key={lang} type="button" onClick={() => setLanguage(lang)} className={`rounded-full px-3 py-1 text-xs font-semibold ${language === lang ? "bg-white text-violet-700" : "text-slate-600"}`}>
                  {copy[lang].langName}
                </button>
              ))}
            </div>
            <p className="w-full text-xs text-slate-500 lg:text-right">© {new Date().getFullYear()} SheConnects. {content.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
