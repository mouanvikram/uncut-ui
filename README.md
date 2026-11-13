# Uncut-Ui

An AI-first React design library for building professional interfaces. The workspace includes the public docs and a personal, white-canvas component workbench for developing new components.

## Develop locally

```bash
npm run dev
```

Open `http://localhost:3000` for the library, `/docs` for documentation, and `/playground` for the personal workbench. The workbench is not linked from public navigation, is marked `noindex`, and returns a 404 in production.

## Project map

- `src/app/` — Next.js App Router pages, metadata, and social share images.
- `src/components/ui/` — typed React primitives and public exports.
- `src/app/playground/` — interactive local-only component canvas.
- `src/app/docs/` — public documentation.
- `public/llms.txt` — concise discovery file for AI coding agents.
- `registry/` and `registry.json` — modular shadcn registry sources; category manifests are intentionally empty until items are ready.
- `src/app/r/` — dynamic shadcn registry catalog and item endpoints.

The source library includes the Embossed Button. Registry items will be added as they are created. See `/docs/registry` or `registry/README.md` for the consumer namespace setup and `bunx --bun shadcn add @uncut-ui/<item-name>` install flow.

## Site URL

Set `NEXT_PUBLIC_SITE_URL` to the canonical site origin before deploying. The metadata base is used to create absolute Open Graph and Twitter image URLs.

## Design contract

React components should have typed props, keyboard support, visible focus, and useful defaults. Every page, component, block, template, and example must work on mobile from 320px upward without horizontal page overflow. Keep essential navigation and controls available to touch users. Keep the visual system white, gray, and black. Use the shared `--radius-*` tokens for every corner; avoid one-off roundedness values. Keep long-form content to a readable measure around 900px, support RTL with CSS logical properties, and include page descriptions plus Open Graph and Twitter/X sharing metadata and images in each project built from the library.

## Analytics

Uncut UI loads the Ankora SDK from `https://ankora.mouan.in/sdk.js` on
`uncut-ui.mouan.in`. Deploy this repository to that hostname to enable tracking.
Keep the hostname registered in Ankora. To verify the installation, open Uncut UI
and check that `POST /api/collect` returns 204 in DevTools, then check the
pageview in the [Ankora dashboard](https://ankora.mouan.in/).
