# Prompt Việt Constitution

## Core Principles

### I. Static-First
Every feature must work as a static site. No server-side runtime required. All data is embedded at build time. Dynamic behavior (search, filter, copy) must work client-side.

### II. Community-Driven
Content is curated by the community. Every prompt must be high-quality, tested, and useful. Contributors get credit. No auto-generated spam.

### III. Vietnamese-First
All UI text in Vietnamese. Technical terms kept in English inline. Tone: friendly, professional, accessible.

### IV. Performance Budget
- Lighthouse score ≥ 90 for all categories
- First contentful paint < 1.5s on 3G
- Total JS bundle < 200KB gzipped
- Images: WebP/AVIF, lazy-loaded, responsive

### V. Accessibility (NON-NEGOTIABLE)
- WCAG 2.1 AA minimum
- Keyboard navigable
- Screen reader tested
- Color contrast ≥ 4.5:1

## Tech Stack Constraints

- **Framework**: Next.js 16 (App Router, static export)
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Language**: TypeScript strict mode
- **Icons**: Lucide React (no emoji icons)
- **Deployment**: Cloudflare Pages
- **No external UI libraries** (shadcn/ui components copied, not installed)

## Development Workflow

1. Feature starts in `.specify/specs/` with spec → plan → tasks
2. Implementation follows tasks.md order
3. Each user story independently testable
4. Build verification: `next build --webpack` must pass
5. No Turbopack on Windows (WASM fallback only)

## Governance

Constitution supersedes all other practices. Amendments require documentation and migration plan.

**Version**: 1.0.0 | **Ratified**: 2026-11-16 | **Last Amended**: 2026-11-16
