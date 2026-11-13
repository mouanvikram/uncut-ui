"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MobileNavPopup } from "@/components/mobile-nav-popup";
import { ThemeSwitch } from "@/components/theme-switch";
import { BrandLogo } from "@/components/brand-logo";
import { EmbossedButton } from "@/components/ui/embossed-button";

const searchItems = [
  { label: "Experiments", section: "Interactive demos", href: "/experiments" },
  { label: "Introduction", section: "Get started", href: "/docs" },
  { label: "Design foundations", section: "Foundations", href: "/docs#foundations" },
  { label: "React components", section: "Components", href: "/docs/components" },
  { label: "Backgrounds", section: "Visuals", href: "/docs#backgrounds" },
  { label: "Animations", section: "Motion", href: "/docs#animations" },
  { label: "Button", section: "Components", href: "/docs/components/button" },
  { label: "Dust Text", section: "Components", href: "/docs/components/dust-text" },
  { label: "Patterns and templates", section: "Library", href: "/docs#patterns" },
  { label: "Instructions for AI agents", section: "Get started", href: "/docs/ai" },
];

const ctaOverrides = "leading-[1.55] max-[680px]:px-2.5 max-[680px]:text-[13px] max-[520px]:px-2";

export function SiteHeader() {
  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        window.dispatchEvent(new Event("uncut-ui:open-search-popup"));
      }
    }
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-13.75 items-center justify-between gap-4 border-b border-[var(--border)] bg-white/58 px-[var(--layout-gutter)] backdrop-blur-xl backdrop-saturate-145 dark:bg-[rgba(17,17,17,0.68)] max-[980px]:gap-4.5 max-[680px]:gap-2">
      <div className="flex min-w-0 items-center gap-6 max-[680px]:gap-1">
        <Link className="inline-flex items-center gap-3 text-base leading-[1.55] font-medium tracking-[-0.02em] whitespace-nowrap text-[var(--foreground)] max-[520px]:text-[15px]" href="/" aria-label="Uncut UI home">
          <span className="grid h-9.5 w-9.5 shrink-0 basis-9.5 place-items-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-white dark:border-[#484848] dark:bg-[#171717]">
            <BrandLogo size={36} priority />
          </span>
          <span className="font-bold max-[680px]:hidden">Uncut UI</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm leading-[1.55] whitespace-nowrap text-[#5f5f5f] min-[1025px]:flex dark:text-[var(--muted)]" aria-label="Main navigation">
          <Link className="inline-flex h-9.5 items-center rounded-[var(--radius-md)] px-2.5 py-1.75 transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] dark:hover:bg-[#1e1e1e]" href="/docs/components">Components</Link>
          <Link className="inline-flex h-9.5 items-center rounded-[var(--radius-md)] px-2.5 py-1.75 transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] dark:hover:bg-[#1e1e1e]" href="/docs#backgrounds">Backgrounds</Link>
          <Link className="inline-flex h-9.5 items-center rounded-[var(--radius-md)] px-2.5 py-1.75 transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] dark:hover:bg-[#1e1e1e]" href="/docs#animations">Animations</Link>
          <Link className="inline-flex h-9.5 items-center rounded-[var(--radius-md)] px-2.5 py-1.75 transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] dark:hover:bg-[#1e1e1e]" href="/docs#templates">Templates</Link>
          <Link className="inline-flex h-9.5 items-center rounded-[var(--radius-md)] px-2.5 py-1.75 transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] dark:hover:bg-[#1e1e1e]" href="/experiments">Experiments</Link>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-3 max-[980px]:gap-2 max-[680px]:gap-1.5 max-[520px]:gap-1.25">
        <div className="relative h-9.5 max-[520px]:w-9.5 max-[520px]:shrink-0 basis-9.5">
          <button
            className="group inline-flex h-9.5 w-auto cursor-pointer items-center gap-2.5 rounded-[var(--radius-md)] border border-[#e8e8e8] bg-[#fafafa] px-2 pl-3 text-[#666] transition-[background-color,border-color,transform] duration-150 hover:border-[#e0e0e0] hover:bg-[#f4f4f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777] active:scale-[.96] dark:border-[var(--border)] dark:bg-[#1e1e1e] dark:text-[var(--foreground)] dark:hover:border-[var(--border)] dark:hover:bg-[#1e1e1e] max-[680px]:w-9.5 max-[680px]:border-0 max-[680px]:bg-transparent max-[680px]:hover:bg-[#f4f4f4] dark:max-[680px]:bg-transparent dark:max-[680px]:hover:bg-[#1e1e1e] max-[680px]:justify-center max-[680px]:p-0 max-[520px]:absolute max-[520px]:inset-y-0 max-[520px]:right-0 max-[520px]:justify-center max-[520px]:gap-1.5 max-[520px]:p-0"
            type="button"
            aria-label="Open library search"
            onClick={() => window.dispatchEvent(new Event("uncut-ui:open-search-popup"))}
          >
            <svg className="h-4.25 w-4.25 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
            <kbd className="shrink-0 rounded-[var(--radius-md)] border border-[#e8e8e8] bg-white px-1.5 py-0.75 font-mono text-[10px] leading-[normal] whitespace-nowrap text-[#666] group-hover:bg-[#f4f4f4] dark:border-[var(--border)] dark:bg-[#1e1e1e] dark:text-[var(--foreground)] dark:group-hover:bg-[#1e1e1e] max-[680px]:hidden">Ctrl K</kbd>
          </button>
        </div>
        <ThemeSwitch />
        <a
          href="https://github.com/mouanvikram/uncut-ui"
          aria-label="Uncut UI on GitHub"
          className="inline-flex h-9.5 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)] px-2.5 text-sm font-medium hover:bg-[#f4f4f4] max-[680px]:w-9.5 max-[680px]:px-0 dark:hover:bg-[#1e1e1e]"
        >
          <HugeiconsIcon icon={GithubIcon} size={18} aria-hidden="true" />
          <span className="max-[680px]:hidden min-[1025px]:max-[1150px]:hidden">GitHub</span>
        </a>
        <EmbossedButton className={ctaOverrides} href="/docs/registry">Install</EmbossedButton>
        <MobileNavPopup
          searchItems={searchItems}
          links={[
            { label: "Components", href: "/docs/components" },
            { label: "Backgrounds", href: "/docs#backgrounds" },
            { label: "Animations", href: "/docs#animations" },
            { label: "Templates", href: "/docs#templates" },
            { label: "Experiments", href: "/experiments" },
          ]}
        />
      </div>
    </header>
  );
}
