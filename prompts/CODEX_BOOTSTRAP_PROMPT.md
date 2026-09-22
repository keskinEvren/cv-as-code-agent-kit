# Codex Bootstrap Prompt

You are implementing the MVP of the repository described by `AGENTS.md`.

Read, in this order:
1. `AGENTS.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DATA_MODEL.md`
5. `docs/IMPLEMENTATION_PLAN.md`
6. `docs/QUALITY_GATES.md`
7. `data/resume.master.json`
8. `data/variants.json`

Then implement **Phase 0 through Phase 4** of `docs/IMPLEMENTATION_PLAN.md`.

## Hard constraints

- Do not invent or rewrite resume facts.
- Do not add Atom Bilişim content yet; it is a pending content update.
- Keep career data out of React components.
- Variants must reference canonical IDs.
- Public rendering must sanitize private data before rendering.
- Use a single Next.js app.
- Use TypeScript.
- Add Zod validation.
- Add tests for schema, variant resolution and privacy.
- Add an A4 print stylesheet.
- Add a Playwright-based PDF export command.
- Keep the PDF ATS-friendly.
- Avoid unnecessary dependencies.

## Expected commands

At minimum, provide working scripts equivalent to:

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run pdf -- --variant software
npm run pdf -- --variant product
npm run pdf -- --variant freelance
npm run pdf -- --variant master
```

## Expected routes

```text
/cv
/cv/software
/cv/product
/cv/freelance
/cv/master
```

`/cv` should redirect or default to the `software` variant.

## Implementation behavior

Work incrementally.

After each phase:
1. run relevant checks,
2. fix failures,
3. continue only when green.

When done:
- run all quality checks,
- generate all four PDFs,
- report any page overflow,
- report any content TODOs,
- summarize created files,
- do not claim success for checks you did not actually run.
