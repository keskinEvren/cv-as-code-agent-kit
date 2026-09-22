import type { SectionId } from "./schema";

export const pdfFileNames: Record<string, string> = {
  software: "Evren-Keskin-Software-Engineer-CV.pdf",
  product: "Evren-Keskin-Product-CV.pdf",
  freelance: "Evren-Keskin-Freelance-CV.pdf",
  master: "Evren-Keskin-Master-CV.pdf",
};

export const pdfSectionHeadings: Record<SectionId, string> = {
  skills: "Skills",
  work: "Experience",
  projects: "Projects",
  education: "Education",
  certificates: "Certificates",
  languages: "Languages",
};

export function pdfFileNameForVariant(variantId: string): string {
  const fileName = pdfFileNames[variantId];
  if (!fileName) {
    throw new Error(`No PDF filename configured for variant "${variantId}"`);
  }
  return fileName;
}
