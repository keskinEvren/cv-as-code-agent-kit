import { describe, expect, it } from "vitest";

import { loadResume } from "@/lib/resume/load";
import { validateResume } from "@/lib/resume/validation";

describe("resume schema", () => {
  it("validates the canonical resume", () => {
    expect(() => validateResume(loadResume())).not.toThrow();
  });

  it("rejects duplicate work IDs", () => {
    const resume = structuredClone(loadResume());
    resume.work[1].id = resume.work[0].id;

    expect(() => validateResume(resume)).toThrow(/Duplicate ID/);
  });

  it("rejects duplicate bullet IDs within a work item", () => {
    const resume = structuredClone(loadResume());
    resume.work[0].bullets[1].id = resume.work[0].bullets[0].id;

    expect(() => validateResume(resume)).toThrow(/Duplicate ID/);
  });

  it("rejects dates outside the documented precision", () => {
    const resume = structuredClone(loadResume());
    resume.work[0].startDate = "2025-13";

    expect(() => validateResume(resume)).toThrow(/YYYY or YYYY-MM/);
  });

  it("rejects unsupported visibility values", () => {
    const resume: unknown = {
      ...structuredClone(loadResume()),
      projects: [
        {
          ...structuredClone(loadResume().projects[0]),
          visibility: "secret",
        },
      ],
    };

    expect(() => validateResume(resume)).toThrow();
  });
});
