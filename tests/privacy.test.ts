import { describe, expect, it } from "vitest";

import { loadResume, loadVariants } from "@/lib/resume/load";
import { resolveVariant } from "@/lib/resume/resolve";

describe("public privacy sanitization", () => {
  it("removes a private repository URL before rendering", () => {
    const resume = structuredClone(loadResume());
    const privateUrl = "https://github.com/example/private-repository";
    resume.projects[0].repositoryUrl = privateUrl;
    resume.projects[0].repositoryVisibility = "private";

    const result = resolveVariant(resume, loadVariants(), "software");
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain(privateUrl);
    expect(result.projects[0].repositoryUrl).toBeUndefined();
  });

  it("never shares a private repository URL in a non-public variant without approval", () => {
    const resume = structuredClone(loadResume());
    const privateUrl = "https://github.com/example/private-repository";
    resume.projects[0].repositoryUrl = privateUrl;
    resume.projects[0].repositoryVisibility = "private";

    const result = resolveVariant(resume, loadVariants(), "master");

    expect(JSON.stringify(result)).not.toContain(privateUrl);
  });

  it("removes private and confidential projects from public variants", () => {
    const variants = loadVariants();

    for (const visibility of ["private", "confidential"] as const) {
      const resume = structuredClone(loadResume());
      resume.projects[0].visibility = visibility;
      const result = resolveVariant(resume, variants, "software");

      expect(result.projects.some(({ id }) => id === resume.projects[0].id)).toBe(false);
    }
  });

  it("does not carry internal notes or master metadata into the view model", () => {
    const resume = structuredClone(loadResume());
    const protectedText = "INTERNAL_ONLY_DO_NOT_RENDER";
    resume.projects[0].internalNotes = [protectedText];
    resume.projects[0].bullets[0].internalNotes = [protectedText];

    const result = resolveVariant(resume, loadVariants(), "software");

    expect(JSON.stringify(result)).not.toContain(protectedText);
    expect(JSON.stringify(result)).not.toContain("pendingUpdates");
    expect(JSON.stringify(result)).not.toContain("sourceStatus");
  });
});
