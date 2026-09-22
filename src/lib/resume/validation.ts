import { resumeSchema, variantsSchema } from "./schema";
import type { Resume, VariantsData } from "./schema";

export class ResumeDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeDataError";
  }
}

export function validateResume(input: unknown): Resume {
  return resumeSchema.parse(input);
}

export function validateVariants(input: unknown, resume: Resume): VariantsData {
  const data = variantsSchema.parse(input);
  const skillIds = new Set(resume.skills.map(({ id }) => id));
  const workById = new Map(resume.work.map((item) => [item.id, item]));
  const projectById = new Map(resume.projects.map((item) => [item.id, item]));

  for (const variant of data.variants) {
    if (!(variant.summaryKey in resume.summaries)) {
      throw new ResumeDataError(
        `Variant "${variant.id}" references unknown summary "${variant.summaryKey}"`,
      );
    }

    for (const skillId of variant.skillGroupIds ?? []) {
      if (!skillIds.has(skillId)) {
        throw new ResumeDataError(
          `Variant "${variant.id}" references unknown skill group "${skillId}"`,
        );
      }
    }

    for (const selection of variant.work) {
      const work = workById.get(selection.id);
      if (!work) {
        throw new ResumeDataError(
          `Variant "${variant.id}" references unknown work item "${selection.id}"`,
        );
      }
      assertBulletReferences(
        variant.id,
        "work",
        selection.id,
        selection.bulletIds,
        work.bullets,
      );
    }

    for (const selection of variant.projects) {
      const project = projectById.get(selection.id);
      if (!project) {
        throw new ResumeDataError(
          `Variant "${variant.id}" references unknown project "${selection.id}"`,
        );
      }
      assertBulletReferences(
        variant.id,
        "project",
        selection.id,
        selection.bulletIds,
        project.bullets,
      );
    }
  }

  return data;
}

function assertBulletReferences(
  variantId: string,
  parentType: "work" | "project",
  parentId: string,
  selectedIds: string[] | undefined,
  bullets: ReadonlyArray<{ id: string }>,
) {
  if (!selectedIds) return;

  const available = new Set(bullets.map(({ id }) => id));
  for (const bulletId of selectedIds) {
    if (!available.has(bulletId)) {
      throw new ResumeDataError(
        `Variant "${variantId}" references unknown bullet "${bulletId}" on ${parentType} "${parentId}"`,
      );
    }
  }
}
