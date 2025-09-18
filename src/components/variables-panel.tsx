"use client";

import { Input } from "@/components/ui/input";
import { useProposalStore } from "@/store/use-proposal-store";

export function VariablesPanel() {
  const variables = useProposalStore((state) => state.variables);
  const setVariable = useProposalStore((state) => state.setVariable);

  const entries = Object.entries(variables);

  return (
    <div className="space-y-2 rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Variables
        </h3>
        <span className="text-xs text-muted-foreground">
          Use like {{client_name}}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {entries.map(([key, value]) => (
          <label key={key} className="space-y-1 text-sm">
            <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
            <Input
              value={value}
              onChange={(event) => setVariable(key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
