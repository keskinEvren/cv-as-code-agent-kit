import type { Resume, Variant, VariantsData } from "./schema";
import type {
  ResolvedBullet,
  ResolvedCertificate,
  ResolvedEducation,
  ResolvedProject,
  ResolvedResume,
  ResolvedWork,
} from "./view-model";
import { ResumeDataError, validateResume, validateVariants } from "./validation";

export function resolveVariant(
  resumeInput: Resume | unknown,
  variantsInput: VariantsData | unknown,
  variantId: string,
): ResolvedResume {
  const resume = validateResume(resumeInput);
  const variants = validateVariants(variantsInput, resume);
  const variant = variants.variants.find(({ id }) => id === variantId);

  if (!variant) {
    throw new ResumeDataError(`Unknown CV variant "${variantId}"`);
  }

  return buildViewModel(resume, variant);
}

function buildViewModel(resume: Resume, variant: Variant): ResolvedResume {
  const isPublic = variant.public;
  const selectedSkillIds = new Set(variant.skillGroupIds ?? []);

  return {
    variant: {
      id: variant.id,
      label: variant.label,
      public: isPublic,
      noindex: variant.noindex ?? false,
    },
    basics: {
      name: resume.basics.name,
      location: resume.basics.location,
      email: resume.basics.email,
      phone: resume.basics.phone,
      headline: resume.basics.headline,
      portfolioUrl: resume.basics.portfolioUrl,
      githubUrl: resume.basics.githubUrl,
      linkedinUrl: resume.basics.linkedinUrl,
    },
    summary: resume.summaries[variant.summaryKey],
    sections: [...variant.sections],
    skills: resume.skills
      .filter(({ id }) => selectedSkillIds.has(id))
      .map(({ id, label, items }) => ({ id, label, items: [...items] })),
    work: selectWork(resume, variant, isPublic),
    projects: selectProjects(resume, variant, isPublic),
    education: sanitizeEducation(resume, isPublic),
    certificates: sanitizeCertificates(resume, isPublic),
    languages: resume.languages.map(({ id, language, proficiency }) => ({
      id,
      language,
      proficiency,
    })),
  };
}

function selectWork(
  resume: Resume,
  variant: Variant,
  isPublic: boolean,
): ResolvedWork[] {
  const byId = new Map(resume.work.map((work) => [work.id, work]));

  return variant.work.flatMap((selection) => {
    const work = byId.get(selection.id);
    if (!work || (isPublic && work.visibility !== "public")) return [];

    return [
      {
        id: work.id,
        company:
          isPublic && work.visibility === "confidential"
            ? (work.publicCompany ?? "Confidential client")
            : work.company,
        location: work.location,
        position: work.position,
        startDate: work.startDate,
        endDate: work.endDate,
        current: work.current,
        summary: work.summary,
        products: work.products ? [...work.products] : undefined,
        bullets: selectBullets(work.bullets, selection.bulletIds),
        technologies: work.technologies ? [...work.technologies] : undefined,
      },
    ];
  });
}

function selectProjects(
  resume: Resume,
  variant: Variant,
  isPublic: boolean,
): ResolvedProject[] {
  const byId = new Map(resume.projects.map((project) => [project.id, project]));

  return variant.projects.flatMap((selection) => {
    const project = byId.get(selection.id);
    if (!project || (isPublic && project.visibility !== "public")) return [];

    const mayShareRepository =
      project.repositoryVisibility === "public" && project.visibility === "public";

    return [
      {
        id: project.id,
        name: project.name,
        subtitle: project.subtitle,
        url: project.url,
        repositoryUrl: mayShareRepository ? project.repositoryUrl : undefined,
        bullets: selectBullets(project.bullets, selection.bulletIds),
        technologies: project.technologies
          ? [...project.technologies]
          : undefined,
      },
    ];
  });
}

function selectBullets(
  bullets: ReadonlyArray<{ id: string; text: string }>,
  selectedIds?: string[],
): ResolvedBullet[] {
  const selected = selectedIds ? new Set(selectedIds) : undefined;
  const byId = new Map(bullets.map((bullet) => [bullet.id, bullet]));

  return (selectedIds ?? bullets.map(({ id }) => id)).map((id) => {
    const bullet = byId.get(id);
    if (!bullet) {
      throw new ResumeDataError(`Unable to resolve bullet "${id}"`);
    }
    if (selected && !selected.has(id)) {
      throw new ResumeDataError(`Unexpected bullet "${id}"`);
    }
    return { id: bullet.id, text: bullet.text };
  });
}

function sanitizeEducation(
  resume: Resume,
  isPublic: boolean,
): ResolvedEducation[] {
  return resume.education.flatMap((education) => {
    if (isPublic && education.visibility !== "public") return [];
    return [
      {
        id: education.id,
        institution: education.institution,
        location: education.location,
        degree: education.degree,
        startDate: education.startDate,
        graduationYear: education.graduationYear,
      },
    ];
  });
}

function sanitizeCertificates(
  resume: Resume,
  isPublic: boolean,
): ResolvedCertificate[] {
  return resume.certificates.flatMap((certificate) => {
    if (isPublic && certificate.visibility !== "public") return [];
    return [
      {
        id: certificate.id,
        name: certificate.name,
        issuer: certificate.issuer,
        date: certificate.date,
        url: certificate.url,
      },
    ];
  });
}
