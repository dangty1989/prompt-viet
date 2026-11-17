---
description: "Task list for Prompt Library Foundation feature"
---

# Tasks: Prompt Library Foundation

**Input**: Design documents from `/specs/001-prompt-library-foundation/`

**Prerequisites**: plan.md, spec.md

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure (Next.js 16 App Router)
- [x] T002 Initialize package.json with dependencies (React 19, Tailwind v4, Lucide, clsx, tailwind-merge)
- [x] T003 [P] Configure TypeScript strict mode, ESLint, next.config.ts (static export)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

- [x] T004 [P] Create `src/data/prompts.json` with initial 8 prompts
- [x] T004b [P] Create `src/data/contact.json` with contact info
- [x] T005 [P] Create `src/lib/utils.ts` with `cn()` helper
- [x] T006 [P] Create `src/app/globals.css` with design tokens (brand colors, spacing, dark mode)
- [x] T007 [P] Create `tailwind.config.ts` with custom theme extensions
- [x] T008 [P] Create `src/components/CustomIcons.tsx` (GitHub, Facebook SVG)
- [x] T009 Create `src/app/layout.tsx` (root layout with header, footer, font loading)
- [x] T010 [P] Create `src/components/Footer.tsx` (3-column footer with links)
- [x] T011 [P] Create `src/components/DarkModeToggle.tsx` (toggle with localStorage)

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Browse and Discover Prompts (Priority: P1) 🎯 MVP

**Goal**: Homepage with hero, stats, prompt grid, sidebar

**Independent Test**: Load homepage, verify cards render, copy button works

### Implementation for User Story 1

- [x] T012 [P] [US1] Create `src/components/PromptCard.tsx` (default + compact variants)
- [x] T013 [US1] Create `src/app/page.tsx` (homepage: hero, stats, grid, sidebar)
- [x] T014 [P] [US1] Create `src/components/ContactInfo.tsx` (contact links component)
- [x] T015 [US1] Add copy-to-clipboard functionality to PromptCard
- [x] T016 [US1] Add responsive grid layout (1/2/3 columns)

**Checkpoint**: US1 complete — homepage browsable, cards copyable

---

## Phase 4: User Story 2 - Search and Filter Prompts (Priority: P2)

**Goal**: Real-time search and category/platform filters

**Independent Test**: Type in search, select filters, verify filtered results

### Implementation for User Story 2

- [x] T017 [P] [US2] Create `src/components/SearchFilter.tsx` (search input, category/platform dropdowns, advanced toggle)
- [x] T018 [US2] Wire SearchFilter to homepage grid via `onFilterChange` callback
- [x] T019 [US2] Add "Xóa bộ lọc" (clear filters) button
- [x] T020 [US2] Add result count display ("Tìm thấy X / Y prompt")

**Checkpoint**: US2 complete — search and filter working

---

## Phase 5: User Story 3 - Prompt Detail Page (Priority: P2)

**Goal**: Detail page at `/prompt/[id]` with full content, metadata, survey

**Independent Test**: Navigate to detail page, verify content and copy

### Implementation for User Story 3

- [x] T021 [P] [US3] Create `src/app/prompt/[id]/page.tsx` (detail page with generateStaticParams)
- [x] T022 [P] [US3] Create `src/components/CopyPromptButton.tsx` (copy with confirmation)
- [x] T023 [P] [US3] Create `src/components/SurveyEmbed.tsx` (survey section)
- [x] T024 [US3] Add reference links section (prompts.chat, awesome-chatgpt-prompts, etc.)
- [x] T025 [US3] Add metadata (InfoCard grid: category, updated, source)

**Checkpoint**: US3 complete — detail pages working

---

## Phase 6: User Story 4 - Support Page (Priority: P3)

**Goal**: `/support` page with donation options

**Independent Test**: Visit /support, verify all options render

### Implementation for User Story 4

- [x] T026 [P] [US4] Create `src/components/SupportSection.tsx` (support cards: Coffee, Ko-fi, Bank, MoMo)
- [x] T027 [P] [US4] Create `src/app/support/page.tsx` (support page layout)
- [x] T028 [P] [US4] Create `src/app/support/SupportPageClient.tsx` (client-side support page)
- [x] T029 [P] [US4] Create `src/components/SupportQRServer.tsx` (QR code display)
- [x] T030 [P] [US4] Create `src/components/QRCodeItem.tsx` (QR code with fallback)

**Checkpoint**: US4 complete — support page functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

- [x] T031 [P] Add `robots.ts` and `sitemap.ts` for SEO
- [x] T032 [P] Add OG image metadata in layout.tsx
- [x] T033 Add viewport meta tag with themeColor
- [x] T034 Add color-scheme meta tag sync script
- [x] T035 Verify build: `next build --webpack` passes
- [ ] T036 [P] Deploy to Cloudflare Pages (push to GitHub, connect repo)
- [ ] T037 [P] Replace placeholder contact info (contact.json, SUPPORT_INFO)
- [ ] T038 [P] Replace placeholder Google Form URL in SurveyEmbed
- [ ] T039 [P] Add more prompts to prompts.json (target: 20+)
- [ ] T040 [P] Create OG image (og-image.svg) at `public/images/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3-6)**: Depend on Foundational
- **Polish (Phase 7)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1)**: No dependencies — can start after Foundational
- **US2 (P2)**: Depends on US1 (uses same page structure)
- **US3 (P2)**: Independent — uses different route
- **US4 (P3)**: Independent — uses different route

### Parallel Opportunities

- All `[P]` tasks within a phase can run in parallel
- US3 and US4 can be developed in parallel (different routes)
- Polish tasks marked `[P]` can run in parallel

---

## Notes

- [P] = parallel (different files, no dependencies)
- [US1], [US2] etc. = user story mapping
- Each user story is independently testable
- Commit after each logical group
- Build verification: `next build --webpack` (Turbopack not supported on Windows)