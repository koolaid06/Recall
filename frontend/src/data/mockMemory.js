export const memory = {
  id: "product-strategy",
  title: "Product Strategy Meeting",
  date: "August 29, 2026",
  duration: "48:21",
  participants: 6,

  events: [
    { time: "01:12", seconds: 72, title: "Firebase proposed", type: "Idea", detail: "The original backend direction was introduced." },
    // { time: "01:37", seconds: 97, title: "Integration issue", type: "Problem", detail: "The team identified a problem with the current architecture." },
    // { time: "02:04", seconds: 124, title: "Decision changed", type: "Decision", detail: "Supabase was selected as the new direction." },
    // { time: "04:18", seconds: 258, title: "Authentication discussed", type: "Discussion", detail: "The team compared authentication approaches." },
    { time: "18:42", seconds: 1122, title: "Deployment strategy", type: "Unresolved", detail: "No final deployment approach was agreed upon." },
    { time: "31:08", seconds: 1868, title: "Provider lock-in", type: "Unresolved", detail: "The team flagged a concern for a future discussion." }
  ],

  decisions: [
    { time: "02:04", title: "Supabase selected", reason: "Better fit with the current architecture and integration flow." },
    { time: "11:26", title: "React + Vite frontend", reason: "Fast development cycle and a simple component model." }
  ],

  unresolved: [
    { time: "18:42", title: "Deployment strategy", detail: "Cloud deployment provider still undecided." },
    { time: "31:08", title: "Long-term provider lock-in", detail: "To be revisited after the MVP." }
  ],

  answer: {
    question: "Why did the team switch databases?",
    response: "The team changed direction after an integration issue made the original architecture impractical. Supabase was proposed and selected because it better fit the current architecture and integration flow.",
    evidence: [
      { time: "01:37", seconds: 97, title: "Integration issue", quote: "The current flow isn't working with Firebase..." },
      { time: "02:04", seconds: 124, title: "Final decision", quote: "Let's switch to Supabase." }
    ]
  }
};
