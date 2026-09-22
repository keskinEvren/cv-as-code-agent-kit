# Implementation Plan

## Phase 0 — Repository bootstrap

- [x] Initialize Next.js + TypeScript project.
- [x] Add Tailwind.
- [x] Add Zod.
- [x] Add Vitest.
- [x] Add Playwright.
- [x] Keep existing `data/` and `docs/`.
- [x] Add lint/typecheck/test scripts.
- [x] Add `dist/` to `.gitignore`.

Exit criteria:
- app boots,
- tests run,
- typecheck runs.

---

## Phase 1 — Data layer

- [x] Implement Zod schema for `resume.master.json`.
- [x] Implement schema for `variants.json`.
- [x] Load data through one typed module.
- [x] Reject duplicate IDs.
- [x] Reject unknown variant references.
- [x] Add tests.

Exit criteria:
- all current data validates,
- broken references fail tests.

---

## Phase 2 — Variant engine

- [x] Implement variant selection.
- [x] Implement bullet filtering.
- [x] Implement section ordering.
- [x] Implement privacy sanitization.
- [x] Add unit tests for public/private behavior.

Exit criteria:
- `software`, `product`, `freelance`, `master` resolve deterministically,
- no private repository link can leak into public output.

---

## Phase 3 — Web CV

- [x] Build semantic resume components.
- [x] Add `/cv/[variant]`.
- [x] Add default `/cv`.
- [x] Add metadata.
- [x] Add responsive layout.
- [x] Keep page content selectable and accessible.

Exit criteria:
- every variant renders,
- no hard-coded career facts in components.

---

## Phase 4 — Print/PDF

- [x] Add A4 print stylesheet.
- [x] Avoid awkward page breaks.
- [x] Add PDF export script.
- [x] Generate deterministic filenames.
- [x] Add PDF smoke test.

Exit criteria:
- focused variants fit one page when content allows,
- master fits max two pages,
- no clipping.

---

## Phase 5 — ATS checks

- [ ] Extract PDF text in a test/script.
- [ ] Verify headings appear in logical order.
- [ ] Verify name/contact fields are extractable.
- [ ] Verify important experience text is not omitted.
- [ ] Document known limitations.

Exit criteria:
- exported PDF can be parsed as readable text.

---

## Phase 6 — Public deployment

- [ ] Add environment-based base URL.
- [ ] Add Vercel-ready configuration if needed.
- [ ] Add robots/noindex support per variant.
- [ ] Add GitHub Actions validation.

Exit criteria:
- public route works,
- private data is absent from generated HTML.

---

## Phase 7 — Convenience features

Only after MVP:
- [ ] `npm run cv:add-work`
- [ ] interactive CLI for adding projects
- [ ] job-specific temporary variants
- [ ] JSON Resume export
- [ ] GitHub release with generated PDFs
- [ ] QR code to portfolio (only if requested)
