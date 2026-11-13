import Link from "next/link";
import { Download01Icon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { EmbossedButton } from "@/components/ui/embossed-button";
import { DustText } from "@/components/ui";
import { MobileComponentsSidebar } from "./mobile-components-sidebar";

const titles = {
  "": "Documentation",
  components: "React components",
  "components/button": "Embossed button",
  "components/dust-text": "Dust Text",
  ai: "Instructions for AI agents",
  registry: "Install with shadcn",
} as const;

type Doc = keyof typeof titles;

const componentGroups = [
  { title: "Buttons", id: "buttons", pages: ["components/button"] },
  { title: "Text Effects", id: "text-effects", pages: ["components/dust-text"] },
] as const;

const componentPreviews = [
  {
    path: "components/button",
    description: "A raised button with inset highlights and a pressed state.",
    preview: (
      <div className="grid size-full place-items-center bg-[radial-gradient(ellipse_at_center,var(--surface)_15%,var(--surface-contrast)_100%)]">
        <span className="rounded-[var(--radius-lg)] bg-linear-to-b from-blue-500 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_2px_0_#93c5fd8c,inset_0_-2px_0_#2344c8,0_4px_8px_#00000025]">Continue</span>
      </div>
    ),
  },
  {
    path: "components/dust-text",
    description: "Text that crumbles into tiny particles and settles under gravity.",
    preview: (
      <div className="relative grid size-full place-items-center bg-neutral-950 text-neutral-100">
        <span className="text-[clamp(1.5rem,4vw,2.75rem)] font-semibold tracking-tight">Playground</span>
        <span className="absolute top-[67%] h-5 w-24 bg-[radial-gradient(circle,#ffffff85_0.75px,transparent_1px)] bg-size-[5px_5px] [mask-image:radial-gradient(ellipse,black_10%,transparent_73%)]" />
      </div>
    ),
  },
] as const;

function ComponentsIndex() {
  return (
    <>
      <div className="relative isolate grid gap-4 pb-12 @min-[42rem]:grid-cols-2 @min-[42rem]:gap-8 @min-[42rem]:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-x-[var(--layout-gutter)] -top-8 -z-10 h-40 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[7px_7px] opacity-55 [mask-image:linear-gradient(black,transparent)] md:-top-12" />
        <h1 className="text-3xl leading-tight font-bold tracking-tight lg:text-4xl">React UI Components</h1>
        <p className="max-w-[38ch] text-base leading-relaxed text-[var(--foreground-secondary)] lg:text-lg">
          Browse React components for the web, from buttons to interactive text effects. Preview each component and find its usage and installation details.
        </p>
      </div>
      <div className="grid gap-5 @min-[30rem]:grid-cols-2">
        {componentPreviews.map(({ path, description, preview }) => (
          <Link key={path} href={`/docs/${path}`} className="group overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-1 hover:border-[var(--border-strong)]">
            <div aria-hidden="true" className="aspect-[9/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
              {preview}
            </div>
            <div className="space-y-1 px-4 pt-4 pb-5">
              <h2 className="text-lg font-semibold group-hover:underline">{titles[path]}</h2>
              <p className="text-sm text-[var(--foreground-secondary)]">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function ComponentGroupIcon({ group }: { group: (typeof componentGroups)[number]["id"] }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {group === "buttons" ? (
        <>
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <path d="M8 12h8" />
        </>
      ) : (
        <>
          <path d="m17 3 1.3 3.7L22 8l-3.7 1.3L17 13l-1.3-3.7L12 8l3.7-1.3L17 3Z" />
          <path d="M3 9V7h8v2M7 7v12m-2 0h4" />
        </>
      )}
    </svg>
  );
}

function SidebarGroup({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <details open className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 font-medium hover:bg-[#eeeeee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:hover:bg-[var(--surface-contrast)] [&::-webkit-details-marker]:hidden">
        {icon}
        {title}
        <svg aria-hidden="true" viewBox="0 0 16 16" className="ms-auto size-3 shrink-0 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </summary>
      <ul className="ms-[21px] space-y-1 border-s border-[var(--border)] ps-2">
        {children}
      </ul>
    </details>
  );
}

function ComponentsNavigation({ doc }: { doc: Doc }) {
  return (
      <nav aria-label="Components" className="space-y-3 text-sm [&_a]:rounded-[var(--radius-md)] [&_a]:px-3 [&_a]:py-2 [&_a:is(:hover,[aria-current=page])]:bg-[#eeeeee] dark:[&_a:is(:hover,[aria-current=page])]:bg-[var(--surface-contrast)]">
        <div className="group/profile relative">
          <a href="https://x.com/mouanvikram" className="flex items-center gap-2 font-medium">
            <HugeiconsIcon icon={NewTwitterIcon} size={16} aria-hidden="true" />
            @mouanvikram
          </a>
          <div aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-full z-10 pt-1 group-hover/profile:visible group-focus-within/profile:visible">
            <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-md">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--foreground)] text-[var(--canvas)]">
                <HugeiconsIcon icon={NewTwitterIcon} size={18} />
              </span>
              <div className="min-w-0">
                <div className="font-semibold">@mouanvikram</div>
                <div className="text-xs text-[var(--foreground-secondary)]">Profile on X</div>
              </div>
            </div>
          </div>
        </div>
        <SidebarGroup title="Installation" icon={<HugeiconsIcon icon={Download01Icon} size={20} aria-hidden="true" />}>
          <li><Link href="/docs/registry" className="block text-[var(--foreground-secondary)]">Installation guide</Link></li>
        </SidebarGroup>
        {componentGroups.map(({ title, id, pages }) => (
          <SidebarGroup key={id} title={title} icon={<ComponentGroupIcon group={id} />}>
              {pages.map((path) => (
                <li key={path}>
                  <Link href={`/docs/${path}`} aria-current={path === doc ? "page" : undefined} className="block text-[var(--foreground-secondary)] aria-[current=page]:font-semibold">
                    {titles[path]}
                  </Link>
                </li>
              ))}
          </SidebarGroup>
        ))}
      </nav>
  );
}

export function DocsPage({ doc }: { doc: Doc }) {
  const isIndex = doc === "components";
  const isComponents = doc === "components" || doc.startsWith("components/");

  return (
    <>
      <SiteHeader />
      <div className={isComponents
        ? isIndex
          ? "grid md:grid-cols-[256px_minmax(0,1fr)_clamp(8.5rem,15vw,13rem)]"
          : "grid md:grid-cols-[256px_minmax(0,1fr)]"
        : "mx-auto max-w-5xl px-[var(--layout-gutter)] py-8 md:py-12"}>
      {isComponents && (
        <>
          <aside className="components-sidebar sticky top-[55px] hidden h-[calc(100dvh-55px)] self-start overflow-y-auto bg-[#f4f4f4] p-3 md:block dark:bg-[var(--surface)]">
            <ComponentsNavigation doc={doc} />
          </aside>
          <MobileComponentsSidebar>
            <ComponentsNavigation doc={doc} />
          </MobileComponentsSidebar>
        </>
      )}
      <main className={`min-w-0 ${isIndex ? "@container w-full max-w-5xl justify-self-center px-[var(--layout-gutter)] pt-8 pb-24 md:py-12" : `space-y-6 [&_a]:underline [&_h2]:text-xl [&_h2]:font-semibold ${isComponents ? "max-w-5xl px-[var(--layout-gutter)] pt-8 pb-24 md:py-12" : ""}`}`}>
        {!isComponents && <nav aria-label="Documentation" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {Object.entries(titles).filter(([path]) => !path.startsWith("components/")).map(([path, title]) => (
            <Link key={path} href={path ? `/docs/${path}` : "/docs"} aria-current={path === doc ? "page" : undefined}>{title}</Link>
          ))}
        </nav>}
        {isIndex ? <ComponentsIndex /> : <h1 className="text-3xl font-bold">{titles[doc]}</h1>}
        {doc === "" && (
          <>
            <p>Uncut UI is a React design system for building interfaces with consistent styling and interactions.</p>
            <section id="foundations" className="scroll-mt-20"><h2>Design foundations</h2><p>Use the shared radius tokens and neutral surfaces. Design for narrow screens, keyboard navigation, and both text directions.</p></section>
            <section id="backgrounds" className="scroll-mt-20"><h2>Backgrounds</h2><p>Pixel Rain is available in the source under <code>src/components/backgrounds</code>.</p></section>
            <section id="animations" className="scroll-mt-20"><h2>Animations</h2><p>Try the cherry tree in <Link href="/experiments">Experiments</Link>. Tap its canopy to release petals or drag a twig to bend it.</p></section>
            <section id="templates" className="scroll-mt-20"><h2>Templates</h2><p>There are no published templates yet.</p></section>
            <section id="patterns" className="scroll-mt-20"><h2>Patterns</h2><p>Use semantic controls with clear labels and visible keyboard focus.</p></section>
          </>
        )}
        {doc === "components/dust-text" && (
          <>
            <p>Click or tap the word to crumble it into dust. Activate it again to restore it.</p>
            <div className="grid min-h-40 place-items-center rounded-[var(--radius-md)] bg-[var(--surface)] text-[38px] font-semibold">
              <DustText text="Playground" crumbleBy="word" />
            </div>
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface)] p-4 text-sm"><code>{'bunx --bun shadcn add @uncut-ui/dust-text'}</code></pre>
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface)] p-4 text-sm"><code>{'<DustText text="Playground" crumbleBy="word" />'}</code></pre>
          </>
        )}
        {doc === "components/button" && (
          <>
            <p>Use <code>EmbossedButton</code> for a primary action. Pass <code>href</code> when it should navigate as a link.</p>
            <EmbossedButton>Example button</EmbossedButton>
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface)] p-4 text-sm"><code>{'<EmbossedButton type="submit">Save changes</EmbossedButton>'}</code></pre>
          </>
        )}
        {doc === "ai" && <p>Use documented React components and shared tokens. Keep layouts usable at 320px, preserve keyboard access and visible focus, support RTL, and respect reduced motion. Check the <Link href="/r/registry.json">registry catalog</Link> before suggesting an install.</p>}
        {doc === "registry" && (
          <>
            <p>Browse installable items in the <Link href="/r/registry.json">registry catalog</Link>.</p>
            <p>Configure the namespace in <code>components.json</code> in your project.</p>
            <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface)] p-4 text-sm"><code>{JSON.stringify({ registries: { "@uncut-ui": "https://uncut-ui.dev/r/{name}.json" } }, null, 2)}</code></pre>
          </>
        )}
      </main>
      {isIndex && (
        <aside aria-label="Sponsorship" className="sticky top-[55px] hidden self-start pe-[var(--layout-gutter)] pt-12 md:block">
          <div className="grid min-h-32 place-items-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-3 text-center text-sm text-[var(--foreground-secondary)]">
            Add a sponsor here
          </div>
        </aside>
      )}
      </div>
    </>
  );
}
