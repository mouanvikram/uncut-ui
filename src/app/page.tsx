import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SiteHeader } from "@/components/site-header";
import { EmbossedButton } from "@/components/ui/embossed-button";

export default function Home() {
	return (
		<>
			<SiteHeader />
			<div className="mx-auto flex min-h-[calc(100svh_-_55px)] w-full max-w-330 flex-col px-[var(--layout-gutter)]">
				<main className="grid flex-1 content-center py-20 sm:py-28">
					<div className="w-full max-w-5xl text-start">
						<h1 className="text-[min(9vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.065em]">
							<span className="block whitespace-nowrap">A component library</span>{" "}
							<span className="block whitespace-nowrap">for web and mobile.</span>
						</h1>
						<p className="mt-6 max-w-[44ch] text-base leading-relaxed text-pretty text-[var(--foreground-secondary)] sm:text-lg">
							Build for the web with React components you and your AI coding
							tools can copy and customize. React Native components are planned
							for mobile apps.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<EmbossedButton
								href="/docs/components/dust-text"
								className="min-h-11 px-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.12)]"
							>
								Browse components
							</EmbossedButton>
							<EmbossedButton
								href="/docs/components"
								tone="white"
								className="min-h-11 px-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.12)]"
							>
								Get All Access
							</EmbossedButton>
						</div>
					</div>
				</main>
				<footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] py-5 text-sm">
					<Link
						className="inline-flex items-center gap-0.5 font-bold"
						href="/"
						aria-label="Uncut UI home"
					>
						<BrandLogo size={32} />
						<span>Uncut UI</span>
					</Link>
					<Link
						className="font-semibold text-[var(--interaction)]"
						href="/docs"
					>
						Documentation
					</Link>
				</footer>
			</div>
		</>
	);
}
