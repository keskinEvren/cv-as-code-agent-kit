# Architecture Decision Log

## ADR-001 — Structured source instead of editable document

**Decision:** Career content lives in structured data, not Word/PDF/Canva.

**Reason:** Prevent duplicated content and recurring formatting work.

---

## ADR-002 — One canonical source + variants

**Decision:** Variants reference master item IDs.

**Reason:** A date or bullet correction should propagate everywhere.

---

## ADR-003 — Next.js single app

**Decision:** Use one Next.js application for web rendering and print rendering.

**Reason:** Keeps the project simple and aligns with the user's stack.

---

## ADR-004 — Browser print PDF

**Decision:** Generate PDFs from the same HTML using print CSS and Playwright.

**Reason:** Avoid maintaining a second PDF layout implementation.

---

## ADR-005 — Runtime validation

**Decision:** Use Zod to validate content.

**Reason:** Agents and humans can accidentally create broken references or malformed data. Fail early.

---

## ADR-006 — Explicit privacy model

**Decision:** Work/projects carry visibility metadata; public output is sanitized before rendering.

**Reason:** Some real projects are not public and must not leak through URLs or hidden markup.

---

## ADR-007 — No database in MVP

**Decision:** Store data in Git.

**Reason:** Version control is sufficient for a single-user CV system and is ideal for Codex/agent workflows.
