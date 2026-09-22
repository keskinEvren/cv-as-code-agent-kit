# Architecture

## Overview

The system is a static-first Next.js application with structured resume data and deterministic role variants.

```text
resume.master.json
        │
        ├── validate with Zod
        │
variants.json
        │
        ▼
normalize/select content
        │
        ├── Web renderer
        └── Print renderer
                  │
                  ▼
            Playwright PDF
```

## Recommended folders after bootstrap

```text
src/
├── app/
│   ├── cv/
│   │   ├── [variant]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── globals.css
├── components/
│   └── resume/
│       ├── ResumeDocument.tsx
│       ├── Header.tsx
│       ├── Section.tsx
│       ├── WorkItem.tsx
│       ├── ProjectItem.tsx
│       └── Skills.tsx
├── lib/
│   └── resume/
│       ├── schema.ts
│       ├── load.ts
│       ├── variants.ts
│       ├── privacy.ts
│       └── types.ts
└── styles/
    └── print.css

scripts/
├── export-pdf.ts
└── extract-pdf-text.ts

tests/
├── resume-schema.test.ts
├── variants.test.ts
├── privacy.test.ts
└── pdf-smoke.test.ts
```

## Rendering flow

1. Read canonical master data.
2. Validate it.
3. Read a named variant.
4. Resolve stable IDs.
5. Apply privacy rules.
6. Produce normalized view model.
7. Render the same view model to browser/print.
8. Export PDF from the print route.

## Why JSON

JSON is:
- simple,
- diffable,
- agent-friendly,
- schema-friendly,
- compatible with JSON Resume concepts,
- easy to consume in Next.js.

YAML can be added later if manual editing ergonomics become important.

## PDF strategy

Use browser print rendering rather than a second PDF-specific layout engine.

Benefits:
- one visual system,
- fewer discrepancies,
- easier debugging,
- print CSS is inspectable in browser.

Playwright should:
1. start/use the local app,
2. open the target route,
3. wait for fonts/layout,
4. print with `format: "A4"`,
5. enable background graphics only if needed,
6. save to `dist/`.

## Privacy layer

Privacy must be enforced before rendering, not merely hidden with CSS.

Example:
```ts
sanitizeForPublicVariant(resume, variant)
```

A hidden DOM node containing a private URL is still considered a leak.

## Content model philosophy

Store rich canonical content; variants reference it.

Good:
```json
{
  "projectId": "komsu-site",
  "bulletIds": ["architecture", "reservation-locking"]
}
```

Bad:
```json
{
  "title": "komşu.site",
  "bullet": "Architectural design..."
}
```

The second form duplicates source content and will drift.

## Deployment

Preferred:
- GitHub repository
- Vercel for web CV
- GitHub Actions for validation
- optional artifact generation of PDFs on tagged releases

Do not block local PDF generation on CI/CD.
