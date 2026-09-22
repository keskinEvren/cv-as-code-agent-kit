import { describe, expect, it } from "vitest";

import { loadResume, loadVariants } from "@/lib/resume/load";
import { resolveVariant } from "@/lib/resume/resolve";
import { validateVariants } from "@/lib/resume/validation";

describe("variant validation", () => {
  it("validates every canonical variant", () => {
    const resume = loadResume();
    expect(() => validateVariants(loadVariants(), resume)).not.toThrow();
  });

  it("rejects an unknown work reference", () => {
    const resume = loadResume();
    const variants = structuredClone(loadVariants());
    variants.variants[0].work[0].id = "missing-work";

    expect(() => validateVariants(variants, resume)).toThrow(/unknown work item/);
  });

  it("rejects an unknown project reference", () => {
    const resume = loadResume();
    const variants = structuredClone(loadVariants());
    variants.variants[0].projects[0].id = "missing-project";

    expect(() => validateVariants(variants, resume)).toThrow(/unknown project/);
  });

  it("rejects an unknown work bullet reference", () => {
    const resume = loadResume();
    const variants = structuredClone(loadVariants());
    variants.variants[0].work[0].bulletIds = ["missing-bullet"];

    expect(() => validateVariants(variants, resume)).toThrow(/unknown bullet/);
  });

  it("rejects an unknown project bullet reference", () => {
    const resume = loadResume();
    const variants = structuredClone(loadVariants());
    variants.variants[0].projects[0].bulletIds = ["missing-bullet"];

    expect(() => validateVariants(variants, resume)).toThrow(/unknown bullet/);
  });

  it("rejects an unknown skill-group reference", () => {
    const resume = loadResume();
    const variants = structuredClone(loadVariants());
    variants.variants[0].skillGroupIds = ["missing-skills"];

    expect(() => validateVariants(variants, resume)).toThrow(/unknown skill group/);
  });

  it("rejects an unknown summary", () => {
    const resume = loadResume();
    const variants = structuredClone(loadVariants());
    variants.variants[0].summaryKey = "missing-summary";

    expect(() => validateVariants(variants, resume)).toThrow(/unknown summary/);
  });
});

describe("variant resolution", () => {
  it("resolves the configured summary", () => {
    const resume = loadResume();
    const result = resolveVariant(resume, loadVariants(), "software");

    expect(result.summary).toBe(resume.summaries.software);
  });

  it("preserves configured bullet selection and order", () => {
    const result = resolveVariant(loadResume(), loadVariants(), "software");

    expect(result.work[0].bullets.map(({ id }) => id)).toEqual([
      "requirements",
      "tradeoffs",
      "workflow",
      "release",
    ]);
  });

  it("preserves configured section selection and order", () => {
    const result = resolveVariant(loadResume(), loadVariants(), "freelance");

    expect(result.sections).toEqual([
      "skills",
      "projects",
      "work",
      "education",
      "languages",
    ]);
  });

  it("resolves every configured variant deterministically", () => {
    const resume = loadResume();
    const variants = loadVariants();

    for (const { id } of variants.variants) {
      expect(resolveVariant(resume, variants, id)).toEqual(
        resolveVariant(resume, variants, id),
      );
    }
  });
});
