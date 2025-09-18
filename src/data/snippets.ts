export type Snippet = {
  id: string;
  name: string;
  content: string;
  category: "questions" | "risk" | "cta" | "portfolio";
};

export const snippets: Snippet[] = [
  {
    id: "discovery-questions",
    name: "Discovery Questions",
    category: "questions",
    content:
      "• What’s the single riskiest assumption about {{project_title}} right now?\n• How are you validating success after launch?\n• Any integrations or stakeholders I should loop in during week one?"
  },
  {
    id: "risk-reversal",
    name: "Risk Reversal",
    category: "risk",
    content:
      "No-risk kickoff: first milestone scoped so you can evaluate momentum before green-lighting the rest."
  },
  {
    id: "portfolio-blurb",
    name: "Portfolio Blurb",
    category: "portfolio",
    content:
      "Recent wins: scaled Next.js commerce for a DTC brand (35% conversion lift) and launched a Supabase CRM in 9 days."
  },
  {
    id: "cta-audit",
    name: "CTA — Audit",
    category: "cta",
    content: "Want me to record a Loom audit so you can see the first fixes before hiring?"
  }
];
