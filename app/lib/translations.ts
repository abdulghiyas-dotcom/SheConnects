export type Language = "en" | "it";

export const defaultLanguage: Language = "en";

export type SiteContent = {
  languageNames: Record<Language, string>;
  common: {
    requestSupport: string;
    joinFreelancer: string;
    privacyPolicy: string;
    contactEmail: string;
    contactEmailLabel: string;
  };
  header: {
    brand: string;
    tagline: string;
    navItems: { href: string; label: string }[];
    cta: string;
    menu: string;
    close: string;
    languageLabel: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    whyTitle: string;
    whyDescription: string;
  };
  services: {
    title: string;
    description: string;
    items: { title: string; bullets: string[] }[];
    customPrompt: string;
    customCta: string;
  };
  howItWorks: {
    title: string;
    steps: string[];
  };
  impact: {
    title: string;
    subtitle: string;
    stats: { number: string; label: string; description: string }[];
  };
  organizations: {
    title: string;
    items: { title: string; description: string }[];
  };
  vas: {
    title: string;
    steps: string[];
  };
  testimonials: {
    title: string;
    items: { quote: string; author: string }[];
  };
  blog: {
    label: string;
    title: string;
    description: string;
    readMore: string;
    backHome: string;
  };
  faq: {
    title: string;
    intro: string;
    contactLink: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    emailIntro: string;
    namePlaceholder: string;
    organizationPlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    sendLabel: string;
    sendingLabel: string;
    success: string;
    error: string;
    dataNotice: string;
  };
  finalCta: {
    title: string;
    description: string;
  };
  footer: {
    tagline: string;
    location: string;
    contact: string;
    privacy: string;
    copyright: string;
  };
  cookie: {
    message: string;
    reject: string;
    accept: string;
    learnMorePrefix: string;
    learnMore: string;
  };
  privacy: {
    title: string;
    intro: string;
    effectiveLabel: string;
    effectiveDate: string;
    sections: {
      title: string;
      description?: string;
      items?: ({ label?: string; content: string } | string)[];
    }[];
    contact: string;
  };
};

export const translations: Record<Language, SiteContent> = {
  en: {
    languageNames: { en: "English", it: "Italiano" },
    common: {
      requestSupport: "Request support",
      joinFreelancer: "Join as a Freelancer",
      privacyPolicy: "Privacy Policy",
      contactEmail: "hello@sheconnects.work",
      contactEmailLabel: "hello@sheconnects.work",
    },
    header: {
      brand: "SheConnects",
      tagline: "Digital work with human impact.",
      navItems: [
        { href: "/#services", label: "Services" },
        { href: "/#how-it-works", label: "How it works" },
        { href: "/#impact", label: "Impact" },
        { href: "/#organizations", label: "For organizations" },
        { href: "/#vas", label: "For Afghan women" },
        { href: "/blog", label: "Blog" },
        { href: "/#faq", label: "FAQ" },
      ],
      cta: "Talk to our team",
      menu: "Menu",
      close: "Close",
      languageLabel: "Language",
    },
    hero: {
      badge: "Tech for good · woman-founded",
      title: "Remote support with",
      highlight: "impact",
      description:
        "SheConnects is a managed service studio powered by professional women in Afghanistan. We deliver remote support for programming, translation, graphics, lead generation, and digital tasks — fully compliant and impact-driven.",
      whyTitle: "Why we exist",
      whyDescription:
        "Since 2021, hundreds of thousands of professional women in Afghanistan have lost the right to work. SheConnects creates dignified freelancing opportunities by connecting their skills to international market.",
    },
    services: {
      title: "What we deliver",
      description:
        "These are our core studio capabilities – programming, translation, creative production, and research. We also regularly design custom support packages based on the specific needs of NGOs, social enterprises, and impact-driven teams.",
      items: [
        {
          title: "Programming",
          bullets: [
            "Back-end and front-end development",
            "WordPress development and customization",
          ],
        },
        {
          title: "Document Translation",
          bullets: [
            "Translation between English ↔ Dari/Farsi/Pashto",
            "Localization and cultural adaptation of materials",
            "Subtitling and transcript services for NGOs and media",
          ],
        },
        {
          title: "Creative & Design",
          bullets: [
            "Graphic design (posters, infographics, presentations)",
            "Branding & visual identity packages",
            "Social media visuals and templates",
            "Canva / Adobe-based design production",
            "video editing for campaigns and storytelling",
          ],
        },
        {
          title: "Research & Data Studio",
          bullets: [
            "Market research & competitor analysis",
            "Donor and partner mapping (for NGOs)",
            "Desk-based studies and literature reviews",
            "Data cleaning and structuring for reports",
          ],
        },
      ],
      customPrompt: "Need something different? Many of our collaborations start with a unique request.",
      customCta: "Tell us what you need",
    },
    howItWorks: {
      title: "How partnering with SheConnects works",
      steps: [
        "Share your needs",
        "We design your support package",
        "Delivery through SheConnects",
        "Impact & performance reports",
      ],
    },
    impact: {
      title: "Measurable impact for Afghan women",
      subtitle:
        "Through careful screening, capability-building, and a managed workflow, SheConnects supports Afghan women in gaining dignified, remote-friendly professional opportunities.",
      stats: [
        {
          number: "150+",
          label: "Applications received",
          description:
            "Talented women from across Afghanistan expressed interest in joining SheConnects.",
        },
        {
          number: "40+",
          label: "Interviews completed",
          description:
            "Rigorous screening to understand technical skills, communication, and project readiness.",
        },
        {
          number: "20",
          label: "Women selected & trained",
          description:
            "A cohort of motivated professionals trained to deliver digital and creative services internationally.",
        },
      ],
    },
    organizations: {
      title: "For organizations across Europe",
      items: [
        { title: "Ethical, impact-first outsourcing", description: "Every project supports Afghan women." },
        { title: "Managed & compliant", description: "We are your contractual partner." },
        { title: "Aligned time zones", description: "Smooth communication with Europe." },
        { title: "Vetted talent", description: "Professionals with NGO & admin experience." },
      ],
    },
    vas: {
      title: "Afghan women: build your remote career with us",
      steps: [
        "Apply online",
        "Training & onboarding",
        "Work through SheConnects",
        "Earn with support",
      ],
    },
    testimonials: {
      title: "Stories from both sides",
      items: [
        {
          quote: "Working with SheConnects felt like an extension of our own team.",
          author: "Program Manager, European NGO",
        },
        {
          quote: "Before SheConnects, I thought my career was over.",
          author: "S., Virtual Assistant",
        },
        {
          quote: "The model is simple and compliant: one contract, one partner.",
          author: "Director, Social Enterprise",
        },
      ],
    },
    blog: {
      label: "SheConnects blog",
      title: "Stories from our remote studio",
      description:
        "Reflections on digital work, social impact, and practical tips for NGOs, social enterprises, and impact-driven teams working with remote talent.",
      readMore: "Read more",
      backHome: "← Back to homepage",
    },
    faq: {
      title: "Frequently asked questions",
      intro: "If you don't see your question answered here, feel free to contact us directly.",
      contactLink: "contact us",
      items: [
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
      ],
    },
    contact: {
      title: "Let's explore how we can work together",
      subtitle:
        "Share a bit about your organization and the kind of digital support you're looking for. We'll get back to you with next steps.",
      emailIntro: "Prefer email?",
      namePlaceholder: "Full name",
      organizationPlaceholder: "Organization",
      emailPlaceholder: "you@org.org",
      messagePlaceholder: "Short description of your needs",
      sendLabel: "Send message",
      sendingLabel: "Sending...",
      success: "Thank you! Your message has been sent. We'll get back to you soon.",
      error:
        "Something went wrong. Please try again or email us directly at hello@sheconnects.work.",
      dataNotice:
        "By submitting, you agree that we may process your data in line with our Privacy Policy.",
    },
    finalCta: {
      title: "Ready to work with us?",
      description:
        "Whether you need translation, research, programming, or design support, our trained freelancers are ready to collaborate.",
    },
    footer: {
      tagline: "Impact-driven remote service studio powered by Afghan women.",
      location: "Milan, Italy",
      contact: "Contact:",
      privacy: "Privacy Policy",
      copyright: "© {year} SheConnects",
    },
    cookie: {
      message:
        "We use cookies for anonymous analytics to understand how SheConnects is used and to improve our services. You can choose to accept or reject analytics cookies. We don't use marketing or tracking cookies here.",
      reject: "Reject analytics",
      accept: "Accept analytics",
      learnMorePrefix: "You can learn more in our",
      learnMore: "Privacy Policy",
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "Learn how SheConnects collects, uses, and protects your information when you visit our site or use our services, including how we use cookies and analytics in line with GDPR.",
      effectiveLabel: "Effective date:",
      effectiveDate: "2 December 2024",
      sections: [
        {
          title: "Information We Collect",
          description:
            "We collect information that helps us deliver reliable, ethical services while keeping your data protected.",
          items: [
            {
              label: "Personal Information",
              content:
                "Name, email address, phone number, country, job title, resume/CV details for freelancers, and company name and contact details for clients.",
            },
            {
              label: "Usage Data",
              content:
                "IP address, browser type, pages visited, time spent on pages, and referring URLs to understand how people use our site.",
            },
            {
              label: "Cookies & Analytics",
              content:
                "We use cookies and similar technologies to understand how our website is used and to improve our services. We use Google Analytics 4 (GA4) to collect anonymized usage statistics. Analytics cookies are only activated after you provide consent via the cookie banner. You can also disable cookies at any time in your browser settings.",
            },
          ],
        },
        {
          title: "How We Use Your Information",
          items: [
            "Provide and manage our freelancing and remote services",
            "Match clients with suitable freelancers and service teams in a managed way",
            "Communicate with you about our platform, projects, or opportunities",
            "Improve our website and services, including via anonymized analytics (where consent is given)",
            "Comply with legal and regulatory obligations",
          ],
        },
        {
          title: "Information Sharing and Disclosure",
          items: [
            "We do not sell your personal information.",
            "We may share data with trusted third-party service providers (e.g., hosting, email, and analytics services) who process data on our behalf and under our instructions.",
            "We may disclose information to legal authorities when required by law.",
            "During the matching process, we may share relevant details with clients and freelancers with your knowledge and consent.",
          ],
        },
        {
          title: "Data Security",
          description:
            "We implement appropriate technical and organizational security measures to protect your data from unauthorized access, loss, misuse, or disclosure. However, no system is 100% secure, and we cannot guarantee absolute security of information transmitted or stored electronically.",
        },
        {
          title: "Your Rights (Under GDPR)",
          items: [
            "Access your data",
            "Correct or delete your data",
            "Object to or restrict processing",
            "Data portability, where applicable",
            "File a complaint with a data protection authority",
          ],
          description:
            "To exercise these rights, contact us at hello@sheconnects.work and we will respond as soon as reasonably possible.",
        },
        {
          title: "Third-Party Links",
          description:
            "Our site may contain links to third-party websites or services. We are not responsible for their privacy practices or content. We encourage you to review the privacy policies of any third-party websites you visit.",
        },
        {
          title: "Changes to This Policy",
          description:
            "We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. When we make significant changes, we will update the effective date at the top of this page and, where appropriate, provide additional notice.",
        },
        {
          title: "Contact Us",
          description:
            "If you have questions about this Privacy Policy or how we handle your data, please contact us at hello@sheconnects.work.",
        },
      ],
      contact: "If you have questions about this Privacy Policy or how we handle your data, please contact us at hello@sheconnects.work.",
    },
  },
  it: {
    languageNames: { en: "English", it: "Italiano" },
    common: {
      requestSupport: "Richiedi supporto",
      joinFreelancer: "Unisciti come freelance",
      privacyPolicy: "Informativa sulla privacy",
      contactEmail: "hello@sheconnects.work",
      contactEmailLabel: "hello@sheconnects.work",
    },
    header: {
      brand: "SheConnects",
      tagline: "Lavoro digitale con impatto umano.",
      navItems: [
        { href: "/#services", label: "Servizi" },
        { href: "/#how-it-works", label: "Come funziona" },
        { href: "/#impact", label: "Impatto" },
        { href: "/#organizations", label: "Per le organizzazioni" },
        { href: "/#vas", label: "Per le donne afghane" },
        { href: "/blog", label: "Blog" },
        { href: "/#faq", label: "FAQ" },
      ],
      cta: "Parla con il nostro team",
      menu: "Menu",
      close: "Chiudi",
      languageLabel: "Lingua",
    },
    hero: {
      badge: "Tech for good · fondata da donne",
      title: "Supporto remoto con",
      highlight: "impatto",
      description:
        "SheConnects è uno studio di servizi gestito da professioniste in Afghanistan. Offriamo supporto remoto per programmazione, traduzione, grafica, lead generation e attività digitali — pienamente conforme e orientato all'impatto.",
      whyTitle: "Perché esistiamo",
      whyDescription:
        "Dal 2021 centinaia di migliaia di donne professioniste in Afghanistan hanno perso il diritto al lavoro. SheConnects crea opportunità di freelance dignitose collegando le loro competenze al mercato internazionale.",
    },
    services: {
      title: "Cosa realizziamo",
      description:
        "Queste sono le nostre competenze principali – programmazione, traduzione, produzione creativa e ricerca. Progettiamo anche pacchetti di supporto su misura in base alle esigenze specifiche di ONG, imprese sociali e team orientati all'impatto.",
      items: [
        {
          title: "Programmazione",
          bullets: [
            "Sviluppo back-end e front-end",
            "Sviluppo e personalizzazione WordPress",
          ],
        },
        {
          title: "Traduzione di documenti",
          bullets: [
            "Traduzione tra inglese ↔ dari/farsi/pashtu",
            "Localizzazione e adattamento culturale dei materiali",
            "Sottotitolazione e trascrizioni per ONG e media",
          ],
        },
        {
          title: "Creatività e design",
          bullets: [
            "Graphic design (poster, infografiche, presentazioni)",
            "Branding e pacchetti di identità visiva",
            "Visual e template per i social media",
            "Produzione grafica con Canva / Adobe",
            "Montaggio video per campagne e storytelling",
          ],
        },
        {
          title: "Ricerca e dati",
          bullets: [
            "Ricerche di mercato e analisi competitor",
            "Mappatura di donor e partner (per ONG)",
            "Studi desk e revisioni della letteratura",
            "Pulizia e strutturazione dati per report",
          ],
        },
      ],
      customPrompt:
        "Hai bisogno di altro? Molte collaborazioni iniziano con una richiesta unica.",
      customCta: "Raccontaci di cosa hai bisogno",
    },
    howItWorks: {
      title: "Come funziona collaborare con SheConnects",
      steps: [
        "Raccontaci le tue esigenze",
        "Progettiamo il pacchetto di supporto",
        "Delivery tramite SheConnects",
        "Report di impatto e performance",
      ],
    },
    impact: {
      title: "Impatto misurabile per le donne afghane",
      subtitle:
        "Attraverso selezione accurata, formazione e un flusso di lavoro gestito, SheConnects aiuta le donne afghane ad accedere a opportunità professionali dignitose e compatibili con il lavoro da remoto.",
      stats: [
        {
          number: "150+",
          label: "Candidature ricevute",
          description:
            "Donne talentuose da tutta l'Afghanistan hanno espresso interesse a unirsi a SheConnects.",
        },
        {
          number: "40+",
          label: "Colloqui completati",
          description:
            "Selezione rigorosa per valutare competenze tecniche, comunicazione e prontezza ai progetti.",
        },
        {
          number: "20",
          label: "Donne selezionate e formate",
          description:
            "Un gruppo di professioniste motivate, formate per offrire servizi digitali e creativi a livello internazionale.",
        },
      ],
    },
    organizations: {
      title: "Per le organizzazioni in Europa",
      items: [
        {
          title: "Outsourcing etico e orientato all'impatto",
          description: "Ogni progetto sostiene le donne afghane.",
        },
        { title: "Gestito e conforme", description: "Siamo il tuo partner contrattuale." },
        { title: "Fusi orari allineati", description: "Comunicazione fluida con l'Europa." },
        {
          title: "Talenti verificati",
          description: "Professioniste con esperienza in ONG e amministrazione.",
        },
      ],
    },
    vas: {
      title: "Donne afghane: costruite con noi la vostra carriera remota",
      steps: [
        "Candidati online",
        "Formazione e onboarding",
        "Lavora tramite SheConnects",
        "Guadagna con il nostro supporto",
      ],
    },
    testimonials: {
      title: "Storie da entrambe le prospettive",
      items: [
        {
          quote: "Lavorare con SheConnects è stato come avere un'estensione del nostro team.",
          author: "Program Manager, ONG europea",
        },
        {
          quote: "Prima di SheConnects pensavo che la mia carriera fosse finita.",
          author: "S., Assistente virtuale",
        },
        {
          quote: "Il modello è semplice e conforme: un contratto, un unico partner.",
          author: "Direttore, impresa sociale",
        },
      ],
    },
    blog: {
      label: "Blog di SheConnects",
      title: "Storie dal nostro studio remoto",
      description:
        "Riflessioni su lavoro digitale, impatto sociale e consigli pratici per ONG, imprese sociali e team orientati all'impatto che collaborano con talenti remoti.",
      readMore: "Leggi di più",
      backHome: "← Torna alla home",
    },
    faq: {
      title: "Domande frequenti",
      intro:
        "Se non trovi una risposta qui, puoi contattarci direttamente.",
      contactLink: "contattaci",
      items: [
        {
          question: "Come funziona SheConnects?",
          answer:
            "Le organizzazioni condividono con noi le loro esigenze, noi le colleghiamo a freelance afghane formate e il nostro studio gestisce consegna, comunicazione e qualità end-to-end.",
        },
        {
          question: "SheConnects è conforme alle normative europee sul lavoro?",
          answer:
            "Sì. SheConnects opera come studio di servizi gestiti, non come agenzia di staffing. I clienti contrattano direttamente con SheConnects e tutto il lavoro viene erogato tramite i nostri processi interni.",
        },
        {
          question: "Chi sono le freelance?",
          answer:
            "Le nostre freelance sono donne afghane con esperienza in programmazione, design, traduzione, ricerca e operazioni digitali. Molte hanno lavorato con ONG, imprese sociali e aziende private.",
        },
        {
          question: "Quali servizi offrite?",
          answer:
            "I nostri servizi principali includono programmazione (front-end, back-end, WordPress), traduzione di documenti (dari/farsi/pashtu ↔ inglese), lavori creativi e di design, e supporto su ricerca e dati. Progettiamo anche pacchetti su misura in base alle esigenze specifiche.",
        },
        {
          question: "Offrite servizi personalizzati o una tantum?",
          answer:
            "Sì. Molte collaborazioni iniziano con una richiesta unica o una tantum. Anche se non vedi il tuo bisogno esatto, puoi scriverci e progetteremo insieme una soluzione dedicata.",
        },
        {
          question: "Come posso richiedere supporto?",
          answer:
            "Puoi compilare il form di contatto su questo sito oppure scriverci a hello@sheconnects.work. Ti ricontatteremo con domande di approfondimento e una proposta di collaborazione.",
        },
        {
          question: "Come garantite la qualità del lavoro?",
          answer:
            "Ogni freelance passa attraverso selezione, valutazione delle competenze e onboarding. Durante i progetti il nostro studio fornisce coordinamento, guida e revisione per garantire risultati costanti e affidabili.",
        },
        {
          question: "Quanto costano i vostri servizi?",
          answer:
            "I prezzi dipendono da ambito, complessità e durata del lavoro. Forniamo preventivi trasparenti e basati sul progetto prima di iniziare qualsiasi collaborazione.",
        },
        {
          question: "Che impatto sociale genera la mia collaborazione?",
          answer:
            "Ogni progetto crea direttamente opportunità di lavoro remoto dignitose per donne afghane che affrontano gravi barriere all'occupazione locale. La tua collaborazione offre reddito e continuità professionale.",
        },
        {
          question: "Come possono candidarsi le donne afghane?",
          answer:
            "Le donne afghane possono candidarsi tramite il canale “Unisciti come freelance” sul nostro sito. Le candidate vengono valutate e, se selezionate, inserite nel nostro studio per formazione e possibili abbinamenti ai progetti.",
        },
        {
          question: "I miei dati sono al sicuro?",
          answer:
            "Seguiamo pratiche allineate al GDPR e utilizziamo i dati solo per fornire e migliorare i nostri servizi. Non vendiamo le tue informazioni personali. Per maggiori dettagli, consulta la nostra Informativa sulla privacy.",
        },
      ],
    },
    contact: {
      title: "Esploriamo come collaborare",
      subtitle:
        "Raccontaci qualcosa sulla tua organizzazione e sul tipo di supporto digitale che cerchi. Ti ricontatteremo con i prossimi passi.",
      emailIntro: "Preferisci l'email?",
      namePlaceholder: "Nome e cognome",
      organizationPlaceholder: "Organizzazione",
      emailPlaceholder: "tu@org.org",
      messagePlaceholder: "Breve descrizione delle tue necessità",
      sendLabel: "Invia messaggio",
      sendingLabel: "Invio...",
      success:
        "Grazie! Il tuo messaggio è stato inviato. Ti risponderemo al più presto.",
      error:
        "Qualcosa è andato storto. Riprova o scrivici direttamente a hello@sheconnects.work.",
      dataNotice:
        "Inviando il form accetti che trattiamo i tuoi dati in linea con la nostra Informativa sulla privacy.",
    },
    finalCta: {
      title: "Pronti a lavorare insieme?",
      description:
        "Che tu abbia bisogno di traduzione, ricerca, programmazione o design, le nostre freelance sono pronte a collaborare.",
    },
    footer: {
      tagline: "Studio di servizi remoti a impatto, guidato da donne afghane.",
      location: "Milano, Italia",
      contact: "Contatto:",
      privacy: "Informativa sulla privacy",
      copyright: "© {year} SheConnects",
    },
    cookie: {
      message:
        "Utilizziamo cookie di analisi anonimi per capire come viene usato SheConnects e migliorare i nostri servizi. Puoi scegliere se accettarli o rifiutarli. Non usiamo cookie di marketing o tracciamento.",
      reject: "Rifiuta analytics",
      accept: "Accetta analytics",
      learnMorePrefix: "Per saperne di più consulta la nostra",
      learnMore: "Informativa sulla privacy",
    },
    privacy: {
      title: "Informativa sulla privacy",
      intro:
        "Scopri come SheConnects raccoglie, utilizza e protegge le tue informazioni quando visiti il nostro sito o utilizzi i nostri servizi, incluso l'uso di cookie e analytics in linea con il GDPR.",
      effectiveLabel: "Data di efficacia:",
      effectiveDate: "2 dicembre 2024",
      sections: [
        {
          title: "Dati che raccogliamo",
          description:
            "Raccogliamo informazioni che ci aiutano a offrire servizi affidabili ed etici, proteggendo al contempo i tuoi dati.",
          items: [
            {
              label: "Dati personali",
              content:
                "Nome, email, numero di telefono, Paese, ruolo professionale, dettagli del CV per le freelance, e nome e contatti dell'azienda per i clienti.",
            },
            {
              label: "Dati di utilizzo",
              content:
                "Indirizzo IP, tipo di browser, pagine visitate, tempo trascorso sulle pagine e URL di provenienza per capire come viene utilizzato il sito.",
            },
            {
              label: "Cookie e analytics",
              content:
                "Utilizziamo cookie e tecnologie simili per capire come viene usato il sito e migliorare i nostri servizi. Usiamo Google Analytics 4 (GA4) per raccogliere statistiche di utilizzo anonime. I cookie di analytics si attivano solo dopo il tuo consenso tramite il banner. Puoi disabilitare i cookie in qualsiasi momento dalle impostazioni del browser.",
            },
          ],
        },
        {
          title: "Come utilizziamo le informazioni",
          items: [
            "Fornire e gestire i nostri servizi di freelance e supporto remoto",
            "Abbinare i clienti a freelance e team di servizio idonei in modo gestito",
            "Comunicare con te riguardo alla piattaforma, ai progetti o alle opportunità",
            "Migliorare il sito e i servizi, anche tramite analytics anonimizzati (quando c'è consenso)",
            "Rispondere ad obblighi legali e normativi",
          ],
        },
        {
          title: "Condivisione e divulgazione dei dati",
          items: [
            "Non vendiamo le tue informazioni personali.",
            "Possiamo condividere dati con fornitori di servizi terzi di fiducia (es. hosting, email, analytics) che trattano i dati per nostro conto e secondo le nostre istruzioni.",
            "Possiamo divulgare informazioni alle autorità competenti quando richiesto dalla legge.",
            "Durante il processo di matching, possiamo condividere dettagli rilevanti con clienti e freelance con la tua conoscenza e consenso.",
          ],
        },
        {
          title: "Sicurezza dei dati",
          description:
            "Applichiamo misure tecniche e organizzative adeguate per proteggere i dati da accessi non autorizzati, perdita, uso improprio o divulgazione. Nessun sistema è però al 100% sicuro, e non possiamo garantire sicurezza assoluta delle informazioni trasmesse o archiviate elettronicamente.",
        },
        {
          title: "I tuoi diritti (ai sensi del GDPR)",
          items: [
            "Accedere ai tuoi dati",
            "Correggere o cancellare i tuoi dati",
            "Opporti o limitare il trattamento",
            "Portabilità dei dati, dove applicabile",
            "Presentare un reclamo a un'autorità di controllo",
          ],
          description:
            "Per esercitare questi diritti, contattaci su hello@sheconnects.work e risponderemo il prima possibile.",
        },
        {
          title: "Link a terze parti",
          description:
            "Il sito può contenere link a siti o servizi di terzi. Non siamo responsabili delle loro pratiche sulla privacy o dei loro contenuti. Ti invitiamo a leggere le informative sulla privacy di ogni sito di terze parti che visiti.",
        },
        {
          title: "Modifiche a questa informativa",
          description:
            "Possiamo aggiornare periodicamente questa informativa per riflettere cambiamenti nelle pratiche, nelle tecnologie o nei requisiti legali. In caso di modifiche rilevanti aggiorneremo la data di efficacia in alto e, se necessario, forniremo ulteriori avvisi.",
        },
        {
          title: "Contatti",
          description:
            "Se hai domande su questa informativa o su come trattiamo i dati, contattaci a hello@sheconnects.work.",
        },
      ],
      contact:
        "Se hai domande su questa informativa o su come trattiamo i dati, contattaci a hello@sheconnects.work.",
    },
  },
};
