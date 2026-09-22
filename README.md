# CV as Code — Evren Keskin

A single-source CV system that generates role-specific web and PDF resumes without repeatedly editing Word/Canva/PDF templates.

## Why this exists

The current workflow is repetitive:
- update a CV,
- reformat it,
- shorten sections,
- fix page breaks,
- create another role-specific version,
- repeat.

This project separates **career facts** from **presentation**.

One canonical source:
`data/resume.master.json`

Multiple outputs:
- Software / Full-Stack CV
- Product CV
- Freelance CV
- Master CV
- Public web pages
- PDF files

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zod
- Vitest
- Playwright
- print CSS / automated A4 PDF export

## Getting started

```bash
npm install
npm run dev
```

Open `/cv` for the default Software CV, or use a role-specific route:

- `/cv/software`
- `/cv/product`
- `/cv/freelance`
- `/cv/master`

The routes are statically generated from validated data. React components do not
contain career facts.

## Quality commands

```bash
npm run validate
npm run lint
npm run typecheck
npm test
npm run build
```

## PDF export

Install the Playwright Chromium runtime once:

```bash
npx playwright install chromium
```

Then generate any variant:

```bash
npm run pdf -- --variant software
npm run pdf -- --variant product
npm run pdf -- --variant freelance
npm run pdf -- --variant master
```

PDFs are written to `dist/`. Every export validates its variant, starts a local
rendering server when needed, prints A4 with Playwright, checks the page count,
extracts text, and verifies the name, contact fields, selected headings, and
section order. Run `npm run pdf:check` to re-check all existing PDFs.

## Repository structure

```text
.
├── AGENTS.md
├── README.md
├── data/
│   ├── resume.master.json
│   └── variants.json
├── docs/
│   ├── PRODUCT_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── QUALITY_GATES.md
│   └── DECISIONS.md
└── prompts/
    ├── CODEX_BOOTSTRAP_PROMPT.md
    └── CV_UPDATE_PROMPT.md
```

## Data status

`data/resume.master.json` is synchronized with the user-provided, authoritative
`Evren Keskin CV.pdf`. Agents must not invent details that are absent from the
approved source or later user-provided updates.

## Architecture

The runtime flow is:

```text
data/resume.master.json + data/variants.json
  -> Zod structural/reference validation
  -> deterministic variant resolution
  -> pre-render privacy sanitization
  -> semantic React view model
  -> responsive web CV / A4 print CSS
  -> Playwright PDF + ATS smoke checks
```

## Product principle

> Enter facts once. Generate every CV from the same source.
