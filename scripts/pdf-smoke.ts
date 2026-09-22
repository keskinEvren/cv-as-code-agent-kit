import { readFile, stat } from "node:fs/promises";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { pdfSectionHeadings } from "../src/lib/resume/pdf";
import type { ResolvedResume } from "../src/lib/resume/view-model";

export type PdfInspection = {
  byteLength: number;
  pageCount: number;
  pageTexts: string[];
  text: string;
};

export async function inspectPdf(filePath: string): Promise<PdfInspection> {
  const fileStats = await stat(filePath);
  if (fileStats.size === 0) {
    throw new Error(`PDF is empty: ${filePath}`);
  }

  const bytes = new Uint8Array(await readFile(filePath));
  const document = await getDocument({ data: bytes }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pageTexts.push(text);
  }

  return {
    byteLength: fileStats.size,
    pageCount: document.numPages,
    pageTexts,
    text: pageTexts.join(" "),
  };
}

export function assertPdfSmoke(
  inspection: PdfInspection,
  resume: ResolvedResume,
): void {
  const maxPages = resume.variant.id === "master" ? 2 : 1;

  if (inspection.pageCount < 1 || inspection.pageCount > maxPages) {
    throw new Error(
      `${resume.variant.id} PDF has ${inspection.pageCount} pages; expected 1-${maxPages}`,
    );
  }

  inspection.pageTexts.forEach((text, index) => {
    if (!text.trim()) {
      throw new Error(`PDF page ${index + 1} is unexpectedly blank`);
    }
  });

  const requiredText = [
    resume.basics.name,
    resume.basics.email,
    resume.basics.phone,
    ...resume.sections.map((section) => pdfSectionHeadings[section]),
  ];

  const normalizedText = inspection.text.toLocaleLowerCase("en-US");
  for (const expected of requiredText) {
    if (!normalizedText.includes(expected.toLocaleLowerCase("en-US"))) {
      throw new Error(`Extracted PDF text is missing "${expected}"`);
    }
  }

  const orderedMarkers = [
    resume.basics.name,
    ...resume.sections.map((section) => pdfSectionHeadings[section]),
  ];
  let previousIndex = -1;
  for (const marker of orderedMarkers) {
    const markerIndex = normalizedText.indexOf(
      marker.toLocaleLowerCase("en-US"),
      previousIndex + 1,
    );
    if (markerIndex <= previousIndex) {
      throw new Error(`Extracted PDF text has an unexpected order near "${marker}"`);
    }
    previousIndex = markerIndex;
  }
}
