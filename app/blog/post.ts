export type BlogPost = {
  slug: string;
  title: string;
  date: string; // e.g. "2025-05-12"
  displayDate: string; // e.g. "12 May 2025"
  category: string;
  readTime: string; // e.g. "5 min read"
  excerpt: string;
  content: string[]; // paragraphs
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-remote-service-studios-matter",
    title: "Why remote service studios matter for Afghan women",
    date: "2025-05-12",
    displayDate: "12 May 2025",
    category: "Social impact",
    readTime: "6 min read",
    excerpt:
      "How a managed remote service model can create safe, dignified work opportunities for Afghan women while delivering real value to European organizations.",
    content: [
      "For many Afghan women, access to stable, dignified work has become almost impossible due to restrictions on education, mobility, and public life. At the same time, organizations across Europe are struggling to find reliable, flexible digital support.",
      "SheConnects exists at this intersection. Instead of a marketplace where freelancers are left alone, we operate as a managed remote service studio. This means we screen, train, coordinate, and support Afghan women professionals while delivering structured services to clients.",
      "For our clients, this model reduces risk and friction: they collaborate with a single, stable partner while still creating social impact through their procurement. For our freelancers, it creates a safer, more supportive environment with coaching, quality feedback, and a community.",
      "In future posts, we’ll share more concrete stories, examples of projects, and lessons learned from building a social impact studio across borders."
    ]
  },
  {
    slug: "how-ngos-can-work-with-remote-teams",
    title: "How NGOs can safely collaborate with remote digital teams",
    date: "2025-05-20",
    displayDate: "20 May 2025",
    category: "NGO operations",
    readTime: "7 min read",
    excerpt:
      "Practical tips for NGOs and social enterprises who want to delegate research, design, or technical work to remote teams while staying compliant and secure.",
    content: [
      "NGOs often operate with limited internal capacity, especially when it comes to digital work: research, data cleaning, design, and web updates. Remote teams can help — but only if collaboration is set up in a structured, safe way.",
      "At SheConnects, we work with NGOs by clearly defining scope, deliverables, timelines, and communication channels up front. Rather than adding more management burden to your team, we coordinate internally and provide a single point of contact.",
      "Key ingredients for a good collaboration include: clear briefs, shared expectations around timelines, and a transparent process for feedback and revisions. We encourage NGOs to start small, learn together, and then expand the partnership based on what works.",
      "If you’re curious about how a remote studio could support your team, you can always start with a small pilot project and build from there."
    ]
  }
];
