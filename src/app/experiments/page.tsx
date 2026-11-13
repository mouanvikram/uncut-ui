import type { Metadata } from "next";
import { PixelTree } from "@/components/pixel-tree";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Experiments" };

export default function ExperimentsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-[var(--layout-gutter)] py-12">
        <h1 className="text-3xl font-bold">Experiments</h1>
        <section className="mt-8" aria-labelledby="cherry-tree-heading">
          <h2 id="cherry-tree-heading" className="text-xl font-semibold">Pixel cherry tree</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Tap the canopy to release petals or drag a twig to bend it.</p>
          <PixelTree className="mx-auto mt-6 w-full max-w-[min(25rem,70svh)]" />
        </section>
        <section className="mt-12" aria-labelledby="green-tree-heading">
          <h2 id="green-tree-heading" className="text-xl font-semibold">Pixel green tree</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Tap the canopy to release leaves or drag a twig to bend it.</p>
          <PixelTree variant="green" className="mx-auto mt-6 w-full max-w-[min(25rem,70svh)]" />
        </section>
      </main>
    </>
  );
}
