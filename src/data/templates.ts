export type TemplateSectionKey =
  | "hook"
  | "credibility"
  | "questions"
  | "plan"
  | "cta"
  | "ps";

export type ProposalTemplate = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  sections: Record<TemplateSectionKey, string>;
};

export const defaultVariables: Record<string, string> = {
  client_name: "there",
  project_title: "your project",
  deliverables: "key deliverables",
  rate: "$20/hr",
  eta: "7–10 days",
  emoji_hook: "🚀"
};

const baseSections: Record<TemplateSectionKey, string> = {
  hook:
    "{{emoji_hook}} I reviewed {{project_title}} and spotted the same friction I solve on repeat.",
  credibility:
    "Quick cred: shipped {{deliverables}} for teams like Stripe Atlas & Calm; happy clients left 12 ⭐⭐⭐⭐⭐ notes.",
  questions:
    "Before I prescribe, can you clarify the current blockers and success criteria?",
  plan:
    "Game plan: (1) Audit current repo (2) Patch priority bugs (3) Ship tested handoff within {{eta}}.",
  cta: "Want me to map the first 48 hours so you can see momentum fast?",
  ps: "P.S. Share a repo slice and I’ll highlight two high-impact fixes before kickoff."
};

export const templates: ProposalTemplate[] = [
  {
    id: "next-rescue",
    name: "Next.js Rescue / Fix & Finish",
    description: "Stabilize and finish a half-built Next.js project.",
    emoji: "🛠️",
    sections: {
      ...baseSections,
      hook:
        "🛠️ I combed through {{project_title}} — the unfinished flows match battles I've already won for VC-backed SaaS teams.",
      plan:
        "Rescue plan: (1) Sync on failing routes (2) Stabilize backend/API handoffs (3) Hard test + deploy in {{eta}} with a tidy changelog."
    }
  },
  {
    id: "supabase-setup",
    name: "Supabase Expert Setup",
    description: "Set up auth, storage, and automation on Supabase without duct tape.",
    emoji: "🧱",
    sections: {
      ...baseSections,
      hook:
        "🧱 Your Supabase foundation can be production-hardened this week — I’ve rolled this stack for YC alumni repeatedly.",
      plan:
        "Setup path: (1) Model data + RLS (2) Auth flows + invites (3) Automations & QA with logging."
    }
  },
  {
    id: "ai-add-on",
    name: "AI Feature Add-on",
    description: "Ship a trustworthy AI feature inside an existing product.",
    emoji: "🧠",
    sections: {
      ...baseSections,
      hook:
        "🧠 I build AI assistants that feel native — including retrieval-augmented chat and summarizers for remote teams.",
      plan:
        "Addon plan: (1) Outline the narrowest lovable workflow (2) Wire model + guardrails (3) Measure + iterate within {{eta}}."
    }
  },
  {
    id: "migrations-hardening",
    name: "Migrations & Hardening",
    description: "Clean migrations, env parity, and zero-downtime releases.",
    emoji: "🛡️",
    sections: {
      ...baseSections,
      hook:
        "🛡️ I keep production calm during hairy migrations — think blue/green deploys and rollback-ready SQL scripts.",
      plan:
        "Hardening plan: (1) Map risk + rollback (2) Stage/test with synthetic data (3) Cutover with dashboards + alerts."
    }
  }
];

export const sectionsOrder: TemplateSectionKey[] = [
  "hook",
  "credibility",
  "questions",
  "plan",
  "cta",
  "ps"
];
