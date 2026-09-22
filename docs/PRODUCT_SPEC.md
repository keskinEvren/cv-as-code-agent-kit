# Product Specification

## Product name

CV as Code

## Problem

Maintaining several CV versions manually causes:
- duplicated content,
- inconsistent dates and wording,
- layout breakage,
- unnecessary time spent reformatting,
- difficulty tailoring a CV to different roles,
- accidental disclosure of private work.

## Primary user

Evren Keskin, a software/product professional who needs to maintain and share different CV variants.

## Primary use cases

### UC-1 — Add a new role
The user adds one work experience to canonical data.
Every applicable CV variant can use it automatically.

### UC-2 — Tailor CV for a software role
The software variant prioritizes:
- software engineering skills,
- technical projects,
- implementation-focused experience,
- relevant technologies.

### UC-3 — Tailor CV for product roles
The product variant prioritizes:
- product ownership,
- stakeholder management,
- requirements,
- delivery,
- business/technical bridge.

### UC-4 — Send a freelance CV
The freelance variant prioritizes:
- practical delivery capability,
- stack,
- project examples,
- integrations,
- availability-friendly presentation.

### UC-5 — Describe private work safely
A project can appear as a generic project description even when its code/repository/client details are not public.

### UC-6 — Generate PDF
The user runs a deterministic command and receives a clean A4 PDF.

### UC-7 — Share web CV
The user shares a stable public URL for a variant.

---

## Functional requirements

### FR-1 Canonical resume data
All career facts must live in one canonical structured file.

### FR-2 Variants
A variant can:
- select sections,
- select items,
- order items,
- select bullet IDs,
- choose summary text,
- hide private links.

### FR-3 Validation
Invalid or broken data must fail at build/test time.

Examples:
- duplicate IDs,
- unknown selected project ID,
- invalid date format,
- missing required fields,
- private URL exposed in a public variant.

### FR-4 Web rendering
Each variant has a shareable URL and responsive layout.

### FR-5 Print rendering
Each variant has dedicated A4 print CSS.

### FR-6 PDF generation
CLI/script output:
```bash
npm run pdf -- --variant software
```

Expected output:
```text
dist/Evren-Keskin-Software-Engineer-CV.pdf
```

### FR-7 Privacy
A public variant must never render:
- private repository URLs,
- internal-only notes,
- confidential client names when marked confidential.

### FR-8 Metadata
Web pages should have:
- title,
- description,
- canonical URL when configured,
- OpenGraph basics,
- noindex option per variant.

---

## Non-functional requirements

### NFR-1 Maintainability
A normal CV update should usually require editing only data.

### NFR-2 Determinism
The same data + code should produce the same PDF layout.

### NFR-3 Performance
Static generation where possible.

### NFR-4 Accessibility
Semantic headings, links and text structure.

### NFR-5 ATS compatibility
PDF text extraction must preserve section order and readable text.

---

## Initial variants

### software
Focus:
- Full-Stack / Software Engineer
- Next.js / React / TypeScript / .NET / REST APIs / PostgreSQL
- technical projects

### product
Focus:
- Product Manager / Product Owner
- requirements
- prioritization
- stakeholder management
- delivery

### freelance
Focus:
- Full-Stack delivery
- integrations
- web applications
- practical project execution
- portfolio

### master
Complete source-oriented CV, up to two pages.

---

## Out of scope for MVP

- visual resume builder,
- AI-generated claims,
- job-board integrations,
- cover letter generator,
- auto-apply,
- login,
- database,
- admin panel.
