"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProposalTemplate, TemplateSectionKey } from "@/data/templates";
import { defaultVariables, sectionsOrder } from "@/data/templates";

type ProposalState = {
  html: string;
  sections: Record<TemplateSectionKey, boolean>;
  variables: Record<string, string>;
  selectedTemplateId?: string;
  lastSaved?: number;
  setHtml: (html: string) => void;
  toggleSection: (key: TemplateSectionKey) => void;
  setVariable: (key: string, value: string) => void;
  setSelectedTemplate: (id?: string) => void;
  reset: () => void;
  applyTemplate: (template: ProposalTemplate) => string;
};

const defaultSections = sectionsOrder.reduce(
  (acc, key) => {
    acc[key] = true;
    return acc;
  },
  {} as Record<TemplateSectionKey, boolean>
);

export const useProposalStore = create<ProposalState>()(
  persist(
    (set, get) => ({
      html: "",
      sections: { ...defaultSections },
      variables: { ...defaultVariables },
      selectedTemplateId: undefined,
      lastSaved: undefined,
      setHtml: (html) => set({ html, lastSaved: Date.now() }),
      toggleSection: (key) =>
        set(({ sections }) => ({
          sections: { ...sections, [key]: !sections[key] }
        })),
      setVariable: (key, value) =>
        set(({ variables }) => ({
          variables: { ...variables, [key]: value }
        })),
      setSelectedTemplate: (id) => set({ selectedTemplateId: id }),
      reset: () =>
        set({
          html: "",
          sections: { ...defaultSections },
          variables: { ...defaultVariables },
          selectedTemplateId: undefined
        }),
      applyTemplate: (template) => {
        const { sections, variables } = get();
        const resolved = sectionsOrder
          .filter((key) => sections[key])
          .map((key) => template.sections[key] ?? "")
          .filter(Boolean)
          .join("\n\n");

        const mergedVariables = { ...defaultVariables, ...variables, emoji_hook: template.emoji };

        const text = resolved.replace(/{{(.*?)}}/g, (_, token) => {
          const lookup = token.trim().replace(/[^a-zA-Z0-9_]/g, "");
          return mergedVariables[lookup] ?? `{{${lookup}}}`;
        });

        const html = text
          .split(/\n{2,}/)
          .map((block) => block.trim())
          .filter(Boolean)
          .map((block) => `<p>${block}</p>`)
          .join("\n");

        set({
          html,
          selectedTemplateId: template.id,
          lastSaved: Date.now()
        });

        return html;
      }
    }),
    {
      name: "proposal-writer",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ html, sections, variables, selectedTemplateId }) => ({
        html,
        sections,
        variables,
        selectedTemplateId
      })
    }
  )
);
