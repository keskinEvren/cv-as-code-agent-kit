# Job Tailoring Prompt

Use this when tailoring the CV for a specific job ad without corrupting the master CV.

---

Read `AGENTS.md`, `data/resume.master.json`, and `data/variants.json`.

I will provide a job advertisement.

Create a new temporary role variant for that job.

Rules:
- Never change canonical facts.
- Never invent achievements, metrics, technologies or experience.
- Reorder/select existing work, project and skill items based on relevance.
- Prefer removing weakly relevant content over rewriting it into unsupported claims.
- Keep public/private visibility rules.
- Target one A4 page when reasonable.
- Keep body text >= 9.5pt.
- Use ATS-safe headings and text.
- Name the variant using a short slug derived from the company/role.
- Generate the PDF after validation.
- Report which source items were selected and why.
