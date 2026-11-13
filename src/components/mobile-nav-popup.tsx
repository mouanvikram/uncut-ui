"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type NavigationLink = { label: string; href: string; section?: string };

const linkClasses =
  "flex items-center gap-2.75 rounded-[var(--radius-md)] px-2.5 text-[15px] text-[var(--foreground)] hover:bg-[#f2f2f2] dark:hover:bg-[#1e1e1e]";

const emptySubscribe = () => () => {};

const closeClasses =
  "grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-[var(--radius-md)] border-0 bg-transparent p-0 leading-none text-[var(--foreground-secondary)] hover:bg-[#f1f1f1] active:scale-[.96] dark:hover:bg-[#2a2a2a]";

export function MobileNavPopup({ links, searchItems, className = "" }: { links: NavigationLink[]; searchItems?: NavigationLink[]; className?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelId = "mobile-navigation-panel";
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isOpen = menuOpen || searchOpen;
  const filteredLinks = query.trim()
    ? (searchItems ?? links).filter((link) => `${link.label} ${link.section ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()))
    : searchOpen ? (searchItems ?? links) : links;


  function closePopup() {
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    const desktopLayout = window.matchMedia("(min-width: 1025px)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) closePopup();
    }
    desktopLayout.addEventListener("change", closeOnDesktop);
    return () => desktopLayout.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    function openSearch() {
      setMenuOpen(false);
      setQuery("");
      setActiveIndex(0);
      setSearchOpen(true);
    }
    window.addEventListener("uncut-ui:open-search-popup", openSearch);
    return () => window.removeEventListener("uncut-ui:open-search-popup", openSearch);
  }, []);

  useEffect(() => {
    if (!isOpen || !mounted) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (searchOpen) searchRef.current?.focus();
    else panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [isOpen, searchOpen, mounted]);

  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closePopup();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("input:not(:disabled), a[href], button:not(:disabled)");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(filteredLinks.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && filteredLinks[activeIndex]) {
      window.location.href = filteredLinks[activeIndex].href;
      closePopup();
    }
  }

  return (
    <>
      <button
        ref={toggleRef}
        className={cn("hidden h-9.5 w-9.5 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border-0 bg-transparent p-0 text-[var(--foreground)] transition-colors duration-150 hover:bg-[#f4f4f4] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777] active:scale-[.96] max-[1024px]:inline-flex dark:hover:bg-[var(--surface)]", className)}
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls={panelId}
        onClick={() => { setSearchOpen(false); setMenuOpen((open) => !open); }}
      >
        <HugeiconsIcon icon={Menu01Icon} size={20} color="currentColor" strokeWidth={1.7} aria-hidden="true" />
      </button>
      {isOpen && mounted && createPortal(
        <>
          <button className="fixed inset-0 z-1000 h-dvh w-screen cursor-default border-0 bg-black/48 p-0 backdrop-blur-xs animate-[menu-backdrop-in_.18s_ease-out_both]" type="button" tabIndex={-1} aria-label="Close popup" onClick={closePopup} />
          {searchOpen ? (
            <aside ref={panelRef} id={panelId} className="fixed left-1/2 top-1/2 z-1001 flex w-[min(775px,calc(100vw_-_32px))] max-h-[min(662px,calc(100dvh_-_32px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--radius-lg)] border-0 bg-white shadow-[0_24px_80px_#00000030] animate-[menu-popup-in_.18s_cubic-bezier(0.2,0.75,0.25,1)_both] dark:bg-[var(--surface)] dark:text-[var(--foreground)] max-[520px]:w-[calc(100vw_-_20px)] max-[520px]:max-h-[calc(100dvh_-_20px)]" role="dialog" aria-modal="true" aria-label="Search Uncut UI" onKeyDown={trapFocus}>
              <div className="flex min-h-15 items-center gap-3 border-b border-[#e8e8e8] px-4 dark:border-[var(--border)] max-[520px]:gap-2 max-[520px]:px-3">
                <svg className="h-4.75 w-4.75 shrink-0 text-[#777]" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" />
                </svg>
                <input ref={searchRef} className="h-13 w-full min-w-0 border-0 bg-transparent p-0 text-[15px] text-[var(--foreground)] outline-none placeholder:text-[#777] placeholder:opacity-100" type="search" value={query} placeholder="Search components, backgrounds, animations..." aria-label="Search library" onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} onKeyDown={handleSearchKeyDown} />
                <button type="button" className={closeClasses} aria-label="Close search" onClick={closePopup}>
                  <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
              <div className="px-5 pb-1 pt-2.5 text-xs text-[#707070]">{query.trim() ? "Search results" : "Browse"}</div>
              <nav className="grid gap-0.5 overflow-auto px-2.5 pb-2" aria-label="Search results">
                {filteredLinks.map((link, index) => (
                  <Link className={cn(linkClasses, "min-h-11.25", index === activeIndex && "bg-[#f2f2f2] dark:bg-[#1e1e1e]")} href={link.href} key={`${link.label}-${link.href}`} onMouseEnter={() => setActiveIndex(index)} onClick={closePopup}>
                    <span className="w-4.5 text-center text-lg text-[#707070]" aria-hidden="true">·</span><span>{link.label}</span>{link.section && <small className="ml-auto text-xs text-[#777]">{link.section}</small>}<kbd className="ml-auto min-w-4.5 text-end font-mono text-xs text-[#858585]">{index === activeIndex ? "↵" : ""}</kbd>
                  </Link>
                ))}
                {!filteredLinks.length && <p className="m-0 px-3 py-3.75 text-sm text-[var(--muted)]">No matches found.</p>}
              </nav>
              <footer className="flex min-h-12.5 items-center justify-between gap-3 border-t border-[#e8e8e8] px-3.5 text-xs text-[#666] dark:border-[var(--border)] max-[520px]:gap-1 max-[520px]:px-2 max-[520px]:text-[10px]"><span className="inline-flex items-center gap-1.5 whitespace-nowrap max-[520px]:gap-1"><kbd className="rounded-[var(--radius-sm)] border border-[#e8e8e8] bg-[#fafafa] px-1.5 py-0.75 font-mono text-[11px] text-[#626262] dark:border-[var(--border)] dark:bg-[#1e1e1e] dark:text-[var(--foreground)] max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:text-[10px]">Enter</kbd> Open</span><span className="inline-flex items-center gap-1.5 whitespace-nowrap max-[520px]:gap-1"><kbd className="rounded-[var(--radius-sm)] border border-[#e8e8e8] bg-[#fafafa] px-1.5 py-0.75 font-mono text-[11px] text-[#626262] dark:border-[var(--border)] dark:bg-[#1e1e1e] dark:text-[var(--foreground)] max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:text-[10px]">↑</kbd><kbd className="rounded-[var(--radius-sm)] border border-[#e8e8e8] bg-[#fafafa] px-1.5 py-0.75 font-mono text-[11px] text-[#626262] dark:border-[var(--border)] dark:bg-[#1e1e1e] dark:text-[var(--foreground)] max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:text-[10px]">↓</kbd> Navigate</span><span className="inline-flex items-center gap-1.5 whitespace-nowrap max-[520px]:gap-1"><kbd className="rounded-[var(--radius-sm)] border border-[#e8e8e8] bg-[#fafafa] px-1.5 py-0.75 font-mono text-[11px] text-[#626262] dark:border-[var(--border)] dark:bg-[#1e1e1e] dark:text-[var(--foreground)] max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:text-[10px]">Esc</kbd> Close</span></footer>
            </aside>
          ) : (
            <aside ref={panelRef} id={panelId} className="fixed left-1/2 top-1/2 z-1001 flex w-[min(420px,calc(100vw_-_32px))] max-h-[min(620px,calc(100dvh_-_32px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-auto overscroll-contain rounded-[var(--radius-lg)] border-0 bg-white p-3 shadow-[0_24px_80px_#00000030] animate-[navigation-popup-in_.18s_cubic-bezier(0.2,0.75,0.25,1)_both] dark:bg-[var(--surface)] dark:text-[var(--foreground)]" role="dialog" aria-modal="true" aria-label="Uncut UI navigation" onKeyDown={trapFocus}>
              <div className="flex min-h-10.5 items-center justify-between px-1 pb-2 text-sm text-[var(--foreground)]"><strong>Menu</strong><button type="button" className={closeClasses} aria-label="Close navigation" onClick={closePopup}><HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" strokeWidth={1.8} aria-hidden="true" /></button></div>
              <nav className="grid gap-0.5 overflow-auto px-2.5 pb-2 pt-1" aria-label="Main navigation">
                {links.map((link) => <Link className={cn(linkClasses, "min-h-11")} href={link.href} key={`${link.label}-${link.href}`} onClick={closePopup}>{link.label}</Link>)}
              </nav>
            </aside>
          )}
        </>,
        document.body,
      )}
    </>
  );
}
