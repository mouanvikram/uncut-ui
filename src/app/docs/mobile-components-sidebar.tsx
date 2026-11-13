"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

const toggleStyle = "grid size-11 cursor-pointer place-items-center rounded-[var(--radius-md)] hover:bg-[#f1f1f1] dark:hover:bg-[var(--surface-contrast)]";

function SidebarIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M9 4v16" />
      <path d={open ? "m16 9-3 3 3 3" : "m14 9 3 3-3 3"} />
    </svg>
  );
}

export function MobileComponentsSidebar({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDialogElement>(null);
  const panelId = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    function closeOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) panelRef.current?.close();
    }
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Open components sidebar"
        aria-haspopup="dialog"
        aria-controls={panelId}
        className={`${toggleStyle} fixed bottom-[max(1rem,env(safe-area-inset-bottom))] start-[var(--layout-gutter)] z-30 border border-[var(--border)] bg-[#fafafa] shadow-sm md:hidden dark:bg-[var(--surface)]`}
        onClick={() => panelRef.current?.showModal()}
      >
        <SidebarIcon open={false} />
      </button>
      <dialog
        id={panelId}
        ref={panelRef}
        aria-label="Components navigation"
        className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-64 max-w-full bg-[#fafafa] text-[var(--foreground)] backdrop:bg-black/40 md:hidden dark:bg-[var(--surface)]"
        onClick={(event) => {
          if (event.target === event.currentTarget || (event.target instanceof Element && event.target.closest("a[href]"))) {
            event.currentTarget.close();
          }
        }}
      >
        <div className="flex h-full flex-col">
          <div className="components-sidebar min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 ps-[calc(var(--layout-gutter)-0.75rem)] pe-3">
            {children}
          </div>
          <form method="dialog" className="ps-[var(--layout-gutter)] pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button type="submit" aria-label="Close components sidebar" className={toggleStyle}>
              <SidebarIcon open />
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
