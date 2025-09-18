"use client";

import { templates, sectionsOrder } from "@/data/templates";
import { useProposalStore } from "@/store/use-proposal-store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function TemplatePicker({ onApply }: { onApply: (html: string) => void }) {
  const sections = useProposalStore((state) => state.sections);
  const toggleSection = useProposalStore((state) => state.toggleSection);
  const applyTemplate = useProposalStore((state) => state.applyTemplate);
  const selectedTemplateId = useProposalStore((state) => state.selectedTemplateId);
  const setHtml = useProposalStore((state) => state.setHtml);
  const setSelectedTemplate = useProposalStore((state) => state.setSelectedTemplate);

  const handleTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    const html = applyTemplate(template);
    onApply(html);
  };

  const handleScaffold = () => {
    const scaffold = [
      "Hook → write a custom opener",
      "Credibility snapshot → results & proof",
      "Questions → ask 1-2 specifics",
      "Game plan → outline next 3 moves",
      "CTA → invite action",
      "P.S. → bonus insight"
    ]
      .map((line) => `<p>${line}</p>`)
      .join("\n");
    setHtml(scaffold);
    setSelectedTemplate(undefined);
    onApply(scaffold);
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Templates
        </h3>
        <Button type="button" size="sm" variant="secondary" onClick={handleScaffold}>
          Insert scaffold
        </Button>
      </div>
      <div className="space-y-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleTemplate(template.id)}
            className={`w-full rounded-md border px-3 py-2 text-left text-sm transition hover:border-foreground/40 ${
              selectedTemplateId === template.id
                ? "border-foreground bg-foreground/5"
                : "border-border"
            }`}
          >
            <div className="font-medium">
              {template.emoji} {template.name}
            </div>
            <p className="text-xs text-muted-foreground">{template.description}</p>
          </button>
        ))}
      </div>
      <div className="space-y-2 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sections
        </p>
        <ul className="space-y-2 text-sm">
          {sectionsOrder.map((section) => {
            const label =
              section === "ps"
                ? "P.S."
                : section
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());
            return (
              <li key={section} className="flex items-center justify-between">
                <span>{label}</span>
                <Switch
                  checked={sections[section]}
                  onCheckedChange={() => toggleSection(section)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
