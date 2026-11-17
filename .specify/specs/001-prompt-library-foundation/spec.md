# Feature Specification: Prompt Library Foundation

**Feature Branch**: `001-prompt-library-foundation`

**Created**: 2026-11-16

**Status**: Draft

**Input**: User description: "Thư viện prompt tiếng Việt cho ChatGPT, Gemini, Google Workspace"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Discover Prompts (Priority: P1)

User visits the homepage, sees a hero section with value proposition, stats bar (total prompts, categories, platforms), and a grid of prompt cards. Each card shows icon, category badge, platform badge, tags, and a copy button. User can browse all prompts without any interaction.

**Why this priority**: This is the core value — without a browsable library, the product has no reason to exist.

**Independent Test**: Can be fully tested by loading the homepage and verifying prompt cards render with correct data, badges, and copy buttons.

**Acceptance Scenarios**:

1. **Given** user lands on homepage, **When** page loads, **Then** sees hero, stats bar, and at least 8 prompt cards in a responsive grid
2. **Given** a prompt card, **When** user clicks copy button, **Then** prompt content is copied to clipboard and button shows "Đã copy" for 2 seconds
3. **Given** a prompt card, **When** user clicks the card link, **Then** navigates to `/prompt/[id]` detail page

---

### User Story 2 - Search and Filter Prompts (Priority: P2)

User uses the sidebar search input to type a keyword (e.g., "email"). The grid updates in real-time to show only matching prompts. User can also filter by category and platform using dropdowns.

**Why this priority**: Search/filter is the primary way users find specific prompts in a growing library.

**Independent Test**: Can be fully tested by typing in search box, selecting filters, and verifying filtered results update correctly.

**Acceptance Scenarios**:

1. **Given** user types "email" in search, **When** search executes, **Then** only prompts with "email" in title/content/tags are shown
2. **Given** user selects category "Lập trình", **When** filter applies, **Then** only prompts in that category are shown
3. **Given** user selects platform "Gemini", **When** filter applies, **Then** only Gemini prompts are shown
4. **Given** active filters, **When** user clicks "Xóa bộ lọc", **Then** all prompts reappear

---

### User Story 3 - Prompt Detail Page (Priority: P2)

User clicks a prompt card and lands on a detail page. The page shows the full prompt content in a code block, metadata (category, platform, tags), a survey section, and reference links.

**Why this priority**: Detail page provides full context and copy functionality for individual prompts.

**Independent Test**: Can be fully tested by navigating to `/prompt/[id]` and verifying content, metadata, and copy button.

**Acceptance Scenarios**:

1. **Given** user on detail page, **When** page loads, **Then** sees full prompt content in monospace block with copy button
2. **Given** user on detail page, **When** clicks copy, **Then** prompt content copied with confirmation
3. **Given** user on detail page, **When** scrolls down, **Then** sees survey section and reference links

---

### User Story 4 - Support/Contribute Page (Priority: P3)

User navigates to `/support` to find ways to contribute — bank transfer QR codes, MoMo, Buy Me a Coffee, GitHub links, and contribution guidelines.

**Why this priority**: Support page is important for sustainability but not blocking core experience.

**Independent Test**: Can be fully tested by visiting `/support` and verifying all support options render.

**Acceptance Scenarios**:

1. **Given** user on support page, **When** page loads, **Then** sees 4 support cards (Coffee, Ko-fi, Bank, MoMo)
2. **Given** user clicks "Copy số TK", **When** action fires, **Then** bank number copied to clipboard

---

### User Story 5 - Dark Mode Toggle (Priority: P3)

User clicks the moon/sun icon in header to toggle between light and dark themes. Preference is persisted in localStorage.

**Why this priority**: Accessibility and UX polish, not blocking.

**Independent Test**: Can be tested by clicking toggle and verifying color scheme changes and persistence.

**Acceptance Scenarios**:

1. **Given** user in light mode, **When** clicks toggle, **Then** switches to dark mode and saves preference
2. **Given** user in dark mode, **When** refreshes page, **Then** dark mode persists

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all prompts from `src/data/prompts.json` in a responsive grid
- **FR-002**: System MUST support real-time search across title, content, and tags
- **FR-003**: System MUST support filtering by category and platform
- **FR-004**: System MUST provide one-click copy-to-clipboard for each prompt
- **FR-005**: System MUST have a detail page at `/prompt/[id]` for each prompt
- **FR-006**: System MUST have a support page at `/support`
- **FR-007**: System MUST support dark/light mode toggle with localStorage persistence
- **FR-008**: System MUST be fully static (no server runtime), deployable to Cloudflare Pages

### Key Entities

- **Prompt**: id (string), title (string), content (string), category (string), tags (string[]), platform (string)
- **Category**: Derived from prompts (Học tập, Công việc, Phân tích dữ liệu, Content Marketing, Lập trình, Sản xuất)
- **Platform**: ChatGPT, Gemini, Google Workspace

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can find and copy any prompt in under 3 clicks from homepage
- **SC-002**: Search returns results in under 100ms for library up to 100 prompts
- **SC-003**: Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices, SEO
- **SC-004**: Page loads in under 2s on 3G connection

## Assumptions

- Target users are Vietnamese-speaking AI enthusiasts, content creators, developers
- Mobile support is required (responsive design)
- No authentication or user accounts needed for v1
- Prompts are curated manually, not auto-generated
- Cloudflare Pages is the deployment target