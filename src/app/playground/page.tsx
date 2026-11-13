import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DustText } from "@/components/ui";

export const metadata: Metadata = { title: "Playground", robots: { index: false, follow: false } };

export default function PlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <SiteHeader />
      <main className="grid min-h-[calc(100svh_-_55px)] place-items-center px-[var(--layout-gutter)] py-6">
        <h1 className="text-[38px] font-semibold">
          <DustText text="Playground" crumbleBy="word" />
        </h1>
      </main>
    </>
  );
}
