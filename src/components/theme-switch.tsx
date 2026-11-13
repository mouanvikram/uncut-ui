"use client";

import { useSyncExternalStore, useState } from "react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MotionConfig, motion } from "motion/react";

type ThemeMode = "light" | "dark";

const modes: { id: ThemeMode; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "sun" },
  { id: "dark", label: "Dark", icon: "moon" },
];

function ThemeIcon({ name }: { name: string }) {
  const icon = name === "sun" ? Sun01Icon : Moon02Icon;
  return <HugeiconsIcon icon={icon} size={18} color="currentColor" strokeWidth={1.6} aria-hidden="true" />;
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.themeMode = mode;
  root.style.colorScheme = mode;
}

let currentMode: ThemeMode | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): ThemeMode {
  if (currentMode === null) {
    currentMode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
  return currentMode;
}

function getServerSnapshot(): ThemeMode {
  return "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function setTheme(next: ThemeMode) {
  currentMode = next;
  applyTheme(next);
  try {
    window.localStorage.setItem("uncut-ui-theme", next);
  } catch {
    // The theme still works when browser storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

export function ThemeSwitch() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [announcement, setAnnouncement] = useState("");
  const current = modes.find((item) => item.id === mode)!;
  const next = modes[(modes.findIndex((item) => item.id === mode) + 1) % modes.length];
  return (
    <div className="relative shrink-0">
      <MotionConfig reducedMotion="user">
        <motion.button
          className="grid h-9.5 w-9.5 cursor-pointer place-items-center rounded-[var(--radius-md)] bg-transparent text-[var(--foreground-secondary)] transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] dark:hover:bg-[var(--surface)] dark:hover:text-[var(--foreground)]"
          type="button"
          aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
          title={`Theme: ${current.label}`}
          onClick={() => { setTheme(next.id); setAnnouncement(`Theme set to ${next.label.toLowerCase()}`); }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          <ThemeIcon name={current.icon} />
        </motion.button>
      </MotionConfig>
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </div>
  );
}
