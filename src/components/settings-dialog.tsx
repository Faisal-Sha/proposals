"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

const STORAGE_KEY = "proposal-theme";

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
  };

  React.useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-border bg-background p-4 text-sm shadow-xl">
          <div className="flex items-center justify-between">
            <span>Dark mode</span>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Autosave runs every few seconds and persists in this browser.
          </p>
        </div>
      ) : null}
    </div>
  );
}
