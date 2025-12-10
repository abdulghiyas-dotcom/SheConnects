export type BlogPost = {
  slug: string;
  title: string;
  date: string; // e.g. "2025-12-10"
  displayDate: string; // e.g. "10 December 2025"
  category: string;
  readTime: string; // e.g. "6 min read"
  excerpt: string;
  content: string[]; // paragraphs
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-remote-service-studios-matter",
    title: "Why remote service studios matter for Afghan women",
    date: "2025-12-10",
    displayDate: "10 December 2025",
    category: "Social impact",
    readTime: "6 min read",
    excerpt:
      "For many Afghan women, access to dignified work has become nearly impossible. A managed remote service studio model creates a bridge between their skills and the needs of international organizations—without exposing them to additional risk.",
    content: [
      "For many Afghan women, the idea of a normal career has been pushed out of reach. Restrictions on education, movement, and participation in public life mean that talented women who could be building products, supporting research, or creating designs are instead shut out of traditional workplaces. At the same time, organizations in Europe and beyond are under pressure to do more with less, especially when it comes to research, digital work, and communication tasks.",
      "Remote work is often presented as a solution, but in practice an unstructured freelance marketplace does not work well for women in fragile contexts. Competing alone on global platforms, navigating contracts, managing payments, and handling demanding clients without any protection can be overwhelming—and sometimes unsafe. This is where the idea of a remote service studio comes in.",
      "A remote service studio, like SheConnects, acts as a structured middle layer between international clients and local talent. Instead of every Afghan woman having to find her own clients, negotiate alone, and manage complex projects, the studio screens, trains, and supports her. Clients work with a single coordinated team, while the actual work is carried out by women who would otherwise have very limited access to the global job market.",
      "For clients—NGOs, social enterprises, and impact-driven teams—this model reduces risk and friction. They don’t have to build their own remote hiring process or learn the realities of working across borders alone. They receive scoped services: programming tasks, research support, data cleaning, translation, or design work, with clear timelines and points of contact. The studio takes responsibility for quality assurance, communication, and continuity, so the collaboration feels like working with a professional partner, not a loose network of individuals.",
      "For Afghan women, the impact goes beyond income. A remote service studio offers a sense of belonging and professional identity. There is mentorship, feedback, and the chance to grow skills over time instead of starting from zero with every new client. The work can be organized in ways that respect safety, connectivity limitations, and family responsibilities. In many cases, this is the only viable way to keep a career alive without leaving the country.",
      "This model is also important from an ethical and legal perspective. In Europe, labor laws and compliance requirements matter. Operating as a service studio rather than a staffing agency ensures that relationships remain clear: clients contract with the studio, and the studio works with its network of freelancers in a way that respects both EU rules and the realities on the ground. It’s a way to align social impact with responsible, professional delivery.",
      "Remote service studios will not solve every structural barrier faced by Afghan women—but they do create a practical, working bridge between two worlds: organizations that need reliable digital support, and women whose skills deserve to be seen and valued. At SheConnects, our ambition is simple: turn digital work into human impact, one project and one collaboration at a time."
    ]
  }
];
