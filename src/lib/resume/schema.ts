import { z } from "zod";

const stableIdSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "IDs must be stable lowercase kebab-case values",
  );

const dateSchema = z
  .string()
  .regex(
    /^(?:\d{4}|\d{4}-(?:0[1-9]|1[0-2]))$/,
    "Dates must use YYYY or YYYY-MM precision",
  );

const visibilitySchema = z.enum(["public", "private", "confidential"]);

const bulletSchema = z.object({
  id: stableIdSchema,
  text: z.string().trim().min(1),
  internalNotes: z.array(z.string().min(1)).optional(),
});

const skillGroupSchema = z.object({
  id: stableIdSchema,
  label: z.string().trim().min(1),
  items: z.array(z.string().trim().min(1)).min(1),
  internalNotes: z.array(z.string().min(1)).optional(),
});

const workSchema = z.object({
  id: stableIdSchema,
  company: z.string().trim().min(1),
  location: z.string().trim().min(1).optional(),
  position: z.string().trim().min(1),
  startDate: dateSchema,
  endDate: dateSchema.nullable().optional(),
  current: z.boolean().optional(),
  visibility: visibilitySchema,
  publicCompany: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1).optional(),
  products: z.array(z.string().trim().min(1)).optional(),
  bullets: z.array(bulletSchema).min(1),
  technologies: z.array(z.string().trim().min(1)).optional(),
  internalNotes: z.array(z.string().min(1)).optional(),
});

const projectSchema = z.object({
  id: stableIdSchema,
  name: z.string().trim().min(1),
  publicName: z.string().trim().min(1).optional(),
  subtitle: z.string().trim().min(1).nullable().optional(),
  url: z.string().url().nullable().optional(),
  repositoryUrl: z.string().url().nullable().optional(),
  repositoryVisibility: z.enum(["public", "private", "none"]),
  visibility: visibilitySchema,
  bullets: z.array(bulletSchema).min(1),
  technologies: z.array(z.string().trim().min(1)).optional(),
  internalNotes: z.array(z.string().min(1)).optional(),
});

const educationSchema = z.object({
  id: stableIdSchema,
  institution: z.string().trim().min(1),
  location: z.string().trim().min(1).optional(),
  degree: z.string().trim().min(1),
  startDate: dateSchema.optional(),
  graduationYear: dateSchema,
  visibility: visibilitySchema,
  internalNotes: z.array(z.string().min(1)).optional(),
});

const certificateSchema = z.object({
  id: stableIdSchema,
  name: z.string().trim().min(1),
  issuer: z.string().trim().min(1).optional(),
  date: dateSchema.optional(),
  url: z.string().url().optional(),
  visibility: visibilitySchema,
  internalNotes: z.array(z.string().min(1)).optional(),
});

const languageSchema = z.object({
  id: stableIdSchema,
  language: z.string().trim().min(1),
  proficiency: z.string().trim().min(1),
});

const pendingUpdateSchema = z.object({
  id: stableIdSchema,
  status: z.string().trim().min(1),
  note: z.string().trim().min(1),
});

function reportDuplicateIds(
  items: ReadonlyArray<{ id: string }>,
  path: (string | number)[],
  context: z.RefinementCtx,
) {
  const seen = new Set<string>();

  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate ID: ${item.id}`,
        path: [...path, index, "id"],
      });
    }
    seen.add(item.id);
  });
}

export const resumeSchema = z
  .object({
    meta: z.object({
      schemaVersion: z.number().int().positive(),
      lastImportedFrom: z.string().min(1).optional(),
      sourceStatus: z.string().min(1),
      notes: z.array(z.string().min(1)).optional(),
    }),
    basics: z.object({
      name: z.string().trim().min(1),
      location: z.string().trim().min(1),
      email: z.string().email(),
      phone: z.string().trim().min(1),
      headline: z.string().trim().min(1),
      portfolioUrl: z.string().url().optional(),
      githubUrl: z.string().url().optional(),
      linkedinUrl: z.string().url().optional(),
    }),
    summaries: z.record(z.string().min(1), z.string().trim().min(1)),
    skills: z.array(skillGroupSchema),
    work: z.array(workSchema),
    projects: z.array(projectSchema),
    education: z.array(educationSchema),
    certificates: z.array(certificateSchema),
    languages: z.array(languageSchema),
    pendingUpdates: z.array(pendingUpdateSchema).optional(),
  })
  .superRefine((resume, context) => {
    reportDuplicateIds(resume.skills, ["skills"], context);
    reportDuplicateIds(resume.work, ["work"], context);
    reportDuplicateIds(resume.projects, ["projects"], context);
    reportDuplicateIds(resume.education, ["education"], context);
    reportDuplicateIds(resume.certificates, ["certificates"], context);
    reportDuplicateIds(resume.languages, ["languages"], context);
    reportDuplicateIds(resume.pendingUpdates ?? [], ["pendingUpdates"], context);

    resume.work.forEach((work, workIndex) => {
      reportDuplicateIds(work.bullets, ["work", workIndex, "bullets"], context);
    });
    resume.projects.forEach((project, projectIndex) => {
      reportDuplicateIds(
        project.bullets,
        ["projects", projectIndex, "bullets"],
        context,
      );
    });
  });

export const sectionIdSchema = z.enum([
  "skills",
  "work",
  "projects",
  "education",
  "certificates",
  "languages",
]);

const itemSelectionSchema = z.object({
  id: stableIdSchema,
  bulletIds: z.array(stableIdSchema).min(1).optional(),
});

const variantSchema = z.object({
  id: stableIdSchema,
  label: z.string().trim().min(1),
  public: z.boolean(),
  noindex: z.boolean().optional(),
  summaryKey: stableIdSchema,
  sections: z.array(sectionIdSchema).min(1),
  skillGroupIds: z.array(stableIdSchema).optional(),
  work: z.array(itemSelectionSchema),
  projects: z.array(itemSelectionSchema),
});

export const variantsSchema = z
  .object({
    schemaVersion: z.number().int().positive(),
    variants: z.array(variantSchema).min(1),
  })
  .superRefine((data, context) => {
    reportDuplicateIds(data.variants, ["variants"], context);

    data.variants.forEach((variant, index) => {
      reportDuplicateIds(variant.work, ["variants", index, "work"], context);
      reportDuplicateIds(
        variant.projects,
        ["variants", index, "projects"],
        context,
      );

      const selections: Array<[ReadonlyArray<string>, string]> = [
        [variant.sections, "sections"],
        [variant.skillGroupIds ?? [], "skillGroupIds"],
      ];

      selections.forEach(([values, field]) => {
        const seen = new Set<string>();
        values.forEach((value, valueIndex) => {
          if (seen.has(value)) {
            context.addIssue({
              code: "custom",
              message: `Duplicate selection: ${value}`,
              path: ["variants", index, field, valueIndex],
            });
          }
          seen.add(value);
        });
      });

      [...variant.work, ...variant.projects].forEach((selection) => {
        if (!selection.bulletIds) return;
        const seen = new Set<string>();
        selection.bulletIds.forEach((bulletId, bulletIndex) => {
          if (seen.has(bulletId)) {
            context.addIssue({
              code: "custom",
              message: `Duplicate bullet selection: ${bulletId}`,
              path: ["variants", index, "bulletIds", bulletIndex],
            });
          }
          seen.add(bulletId);
        });
      });
    });
  });

export type Resume = z.infer<typeof resumeSchema>;
export type VariantsData = z.infer<typeof variantsSchema>;
export type Variant = VariantsData["variants"][number];
export type SectionId = z.infer<typeof sectionIdSchema>;
