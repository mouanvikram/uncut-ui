import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uncut-ui.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Uncut-Ui — a design system for AI-built interfaces",
    template: "%s — Uncut-Ui",
  },
  description:
    "A React component library with a considered design system, practical docs, patterns, and templates for AI-built interfaces.",
  applicationName: "Uncut-Ui",
  openGraph: {
    type: "website",
    siteName: "Uncut-Ui",
    title: "Uncut-Ui — a design system for AI-built interfaces",
    description:
      "A React component library with a considered design system, practical docs, patterns, and templates for AI-built interfaces.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Uncut-Ui component library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uncut-Ui — a design system for AI-built interfaces",
    description:
      "A React component library with a considered design system, practical docs, patterns, and templates for AI-built interfaces.",
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem("uncut-ui-theme")==="dark"?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.dataset.themeMode=t;document.documentElement.style.colorScheme=t}catch{}` }} /></head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
