import resumeJson from "../../../data/resume.master.json";
import variantsJson from "../../../data/variants.json";

import type { Resume, VariantsData } from "./schema";
import { validateResume, validateVariants } from "./validation";

let resumeCache: Resume | undefined;
let variantsCache: VariantsData | undefined;

export function loadResume(): Resume {
  resumeCache ??= validateResume(resumeJson);
  return resumeCache;
}

export function loadVariants(resume = loadResume()): VariantsData {
  variantsCache ??= validateVariants(variantsJson, resume);
  return variantsCache;
}

export function loadResumeData(): {
  resume: Resume;
  variants: VariantsData;
} {
  const resume = loadResume();
  return { resume, variants: loadVariants(resume) };
}
