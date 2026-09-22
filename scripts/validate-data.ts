import { loadResumeData } from "../src/lib/resume";

const { resume, variants } = loadResumeData();

console.log(
  `Validated resume data: ${resume.work.length} work items, ${resume.projects.length} projects, ${variants.variants.length} variants.`,
);
