import { Freelancer } from "../freelancers";

export const farwa: Freelancer = {
  slug: "farwa",
  name: "Farwa",
  categories: {
    en: ["Translation", "Online Teacher"],
    it: ["Traduzione", "Insegnante Online"],
  },
  en: {
    role: "Online Persian (Dari) Teacher & Translator",
    bio: "Farwa is an online Persian (Dari) language teacher for non-native learners, using English to explain vocabulary, pronunciation, and basic conversation. She creates beginner-friendly lessons focused on practical communication and learner confidence. Due to current restrictions in Afghanistan, she is seeking remote teaching opportunities.",
    languages: "English, Dari",
    services: [
      "Online Persian (Dari) teaching for beginners",
      "Bilingual instruction (English/Dari)",
      "Practical conversation coaching",
      "General translation (English ↔ Dari)",
    ],
  },
  it: {
    role: "Insegnante di Persiano (Dari) Online e Traduttrice",
    bio: "Farwa è un'insegnante online di lingua persiana (Dari) per studenti non madrelingua, che utilizza l'inglese per spiegare vocaboli, pronuncia e conversazioni di base. Crea lezioni adatte ai principianti focalizzate sulla comunicazione pratica. A causa delle attuali restrizioni in Afghanistan, cerca opportunità di insegnamento a distanza.",
    languages: "Inglese, Dari",
    services: [
      "Insegnamento online del persiano (Dari) per principianti",
      "Istruzione bilingue (Inglese/Dari)",
      "Coaching di conversazione pratica",
      "Traduzione generale (Inglese ↔ Dari)",
    ],
  },
  portfolio: [
    {
      title: {
        en: "Online Teaching Demonstration",
        it: "Dimostrazione di Insegnamento Online",
      },
      description: {
        en: "A video demonstration of Farwa's teaching style and bilingual instruction methods.",
        it: "Una dimostrazione video dello stile di insegnamento di Farwa e dei metodi di istruzione bilingue.",
      },
      link: "/portfolio/Farwa_teaching.mp4",
      type: "link",
    },
  ],
};
