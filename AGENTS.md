<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Uncut-Ui design contract

Every page, component, block, template, and example must work on mobile as well as desktop. Support narrow phone widths from 320px upward, reflow content without horizontal page overflow, keep essential navigation and controls available to touch users, and preserve readable text, keyboard access, visible focus, RTL support, and reduced-motion behavior.

Use the shared radius tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, and `--radius-full`) for all component and layout corners. Avoid one-off radius values so the library keeps one coherent roundedness system.
