# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16** app using the App Router (`src/app/`), React 19, TypeScript, and Tailwind CSS v4.

- `src/app/` — App Router pages and layouts. Each folder is a route segment; `page.tsx` renders the route, `layout.tsx` wraps children.
- `src/app/layout.tsx` — Root layout (fonts, global metadata, shared UI shell).
- `@/*` — Path alias resolving to `src/`.
- Tailwind v4 is configured via PostCSS (`postcss.config.mjs`), not a `tailwind.config.js`.
