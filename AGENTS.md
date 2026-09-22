# AGENTS.md — CV as Code

## Mission

Build and maintain a public, developer-friendly CV system for Evren Keskin.

The product must make CV maintenance boring:
- career facts are entered once,
- visual templates are separate from content,
- multiple role-specific CV variants are generated from the same source,
- web and PDF outputs stay consistent,
- ATS readability is preserved,
- private/non-public work can be described without exposing confidential repositories or client details.

The repository is intended to be worked on by Codex/AI coding agents. Treat this file as the highest-level implementation guidance unless a user instruction explicitly overrides it.

---

## Product goals

1. One canonical career data source.
2. Role-specific variants without duplicating facts.
3. Public web CV routes.
4. One-click/repeatable PDF generation.
5. ATS-safe output.
6. Clean, professional layout with no manual Word/Canva formatting.
7. Easy updates: adding one job/project should not require touching layout files.
8. Support public and private projects.
9. Preserve factual accuracy. Never invent dates, employers, technologies, metrics, or achievements.
10. Keep the system simple enough for one person to maintain.

## Non-goals for v1

- No user accounts.
- No database.
- No CMS.
- No drag-and-drop editor.
- No AI rewriting inside the web app.
- No analytics dashboard.
- No complex multi-tenant architecture.
- No WYSIWYG PDF editor.

---

## Source of truth

`data/resume.master.json` is the canonical content source.

Do not hard-code career facts into components.

Role variants live in `data/variants.json` and should reference canonical IDs from the master file.

The user-provided `Evren Keskin CV.pdf` is the current authoritative career source. Do not add roles, dates, titles, bullets, technologies, or links that are absent from that source unless the user later supplies and approves new information.

---

## Core architecture

Preferred stack:
- Next.js 15+
- React 19+
- TypeScript
- Tailwind CSS
- Zod for runtime validation
- Vitest for unit tests
- Playwright for rendering/PDF smoke tests
- Browser print CSS for deterministic A4 PDF output

Prefer a single Next.js app over a monorepo unless a concrete need appears.

Suggested routes:
- `/cv` — default software/full-stack variant
- `/cv/software`
- `/cv/product`
- `/cv/freelance`
- `/cv/master` — optional full version
- `/api/resume/:variant` — optional normalized JSON endpoint

PDF generation may use a script such as:
`npm run pdf -- --variant software`

---

## Data rules

### Never duplicate facts
A work item/project is defined once in `resume.master.json`.
Variants only select, order, shorten, or hide items.

### IDs are stable
Every work/project/education item needs a stable `id`.
Never use array index as identity.

### Visibility
Each item may declare:
- `public`: safe for public website/PDF
- `private`: can be used in private CVs but must not expose protected details
- `confidential`: only a generic description can be shown

A private repository is not a reason to omit the project. It may be described without a repository URL.

### Facts vs presentation
Facts belong in master data.
Presentation belongs in variants/templates.

Allowed variant behavior:
- choose items
- reorder items
- choose bullet subsets
- choose a shorter summary
- set section visibility

Disallowed variant behavior:
- invent new achievements
- change dates
- change employer names
- fabricate metrics
- claim tools not present in master data

---

## ATS requirements

PDFs must:
- use selectable text,
- have a single logical reading order,
- avoid text embedded in images,
- use standard section headings,
- avoid multi-column layouts that scramble extraction,
- include plain-text contact details,
- avoid icons as the only representation of contact data,
- render to A4 cleanly,
- not clip text,
- not place essential information in headers/footers only.

Target:
- 1 page for focused role variants when realistic,
- max 2 pages for the master/general CV.

Do not shrink body text below 9.5pt merely to force one page.

---

## Design requirements

Visual direction:
- restrained,
- modern,
- professional,
- typography-first,
- minimal ornament,
- printable in grayscale,
- no progress bars for skills,
- no skill ratings,
- no oversized photo,
- no decorative charts.

Use CSS variables/tokens for:
- typography,
- spacing,
- page margins,
- line height,
- section gaps.

Avoid styling facts directly in JSX.

---

## Content editing policy

When asked to update CV content:
1. Edit canonical data first.
2. Validate against schema.
3. Check every variant still resolves.
4. Run tests.
5. Generate affected PDF(s).
6. Visually inspect for overflow/clipping.
7. Summarize exactly which facts changed.

Never silently rewrite factual bullets simply because a different wording sounds stronger. If rewriting is requested, preserve meaning and flag any claim that would require user confirmation.

---

## Implementation order

Follow `docs/IMPLEMENTATION_PLAN.md`.

Do not jump to advanced features before the MVP quality gates pass.

---

## Quality gates

Before considering a change complete:
- `npm run lint`
- `npm run typecheck`
- `npm test`
- schema validation passes
- all variant references resolve
- no duplicate stable IDs
- A4 PDF export succeeds
- no page overflow/clipping
- ATS text extraction smoke test passes
- mobile web rendering remains usable

See `docs/QUALITY_GATES.md`.

---

## Agent behavior

### Do
- inspect existing files before changing architecture,
- make small coherent commits,
- explain assumptions in commit/PR notes,
- add tests for schema/variant logic,
- preserve stable IDs,
- keep content and layout decoupled,
- update docs when architecture changes.

### Do not
- replace the stack without a concrete reason,
- add a database for v1,
- add authentication for v1,
- copy career text into components,
- invent resume facts,
- expose private repository URLs,
- add unnecessary dependencies,
- make page layout dependent on arbitrary pixel offsets,
- solve overflow by indiscriminately shrinking font sizes.

---

## Definition of done for v1

A user can:
1. edit one JSON file with a new career item,
2. validate it,
3. open multiple role-specific CV pages,
4. generate PDFs,
5. get visually consistent and ATS-readable documents,
6. share a public URL without exposing private projects/repositories.
