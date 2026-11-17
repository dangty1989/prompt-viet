# Implementation Plan: Prompt Library Foundation

**Branch**: `001-prompt-library-foundation` | **Date**: 2026-11-16 | **Spec**: spec.md

**Input**: Feature specification from `/specs/001-prompt-library-foundation/spec.md`

## Summary

Build a static Next.js 16 site for browsing, searching, and copying Vietnamese AI prompts. The site is fully client-side (static export), deployable to Cloudflare Pages. Core features: prompt grid, search/filter, detail pages, copy-to-clipboard, dark mode.

## Technical Context

**Language/Version**: TypeScript 5.7, Next.js 16.4.6 (App Router)
**Primary Dependencies**: React 19, Tailwind CSS v4, Lucide React, clsx, tailwind-merge
**Storage**: Static JSON (`src/data/prompts.json`)
**Testing**: Manual (no test framework in project)
**Target Platform**: Static export → Cloudflare Pages
**Project Type**: Web application (static site)
**Performance Goals**: Lighthouse ≥ 90, FCP < 1.5s on 3G
**Constraints**: No server runtime, no external UI libs, bundle < 200KB gzipped
**Scale/Scope**: 8-100 prompts, single-page app with detail routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Static-First**: All data embedded at build time, client-side interactions only
- ✅ **Community-Driven**: Manual curation, contributor credits in UI
- ✅ **Vietnamese-First**: All UI in Vietnamese, technical terms in English inline
- ✅ **Performance Budget**: Minimal JS, no heavy dependencies, static assets
- ✅ **Accessibility**: WCAG 2.1 AA, keyboard nav, focus rings, ARIA labels

## Project Structure

### Documentation (this feature)

```text
specs/001-prompt-library-foundation/
├── spec.md              # Feature specification
├── plan.md              # This file
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx         # Homepage (hero, stats, grid, sidebar)
│   ├── layout.tsx       # Root layout (header, footer, dark mode)
│   ├── globals.css      # Tailwind + custom tokens
│   ├── prompt/[id]/
│   │   └── page.tsx     # Prompt detail page
│   └── support/
│       ├── page.tsx     # Support page
│       └── SupportPageClient.tsx
├── components/
│   ├── PromptCard.tsx   # Prompt card (default + compact variants)
│   ├── SearchFilter.tsx # Search input + category/platform filters
│   ├── CopyPromptButton.tsx
│   ├── DarkModeToggle.tsx
│   ├── Footer.tsx
│   ├── ContactInfo.tsx
│   ├── SupportSection.tsx
│   ├── SurveyEmbed.tsx
│   └── CustomIcons.tsx  # GitHub, Facebook SVG icons
├── data/
│   ├── prompts.json     # Prompt data (8 prompts)
│   └── contact.json     # Contact info
└── lib/
    └── utils.ts         # cn() helper
```

**Structure Decision**: Single Next.js project with App Router. All components are client-side ("use client") except layout and static pages. No backend, no database — pure static export.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | — | — |