import { describe, expect, it } from "vitest";

import { loadResume, loadVariants } from "@/lib/resume/load";
import { resolveVariant } from "@/lib/resume/resolve";
import { assertPdfSmoke, type PdfInspection } from "../scripts/pdf-smoke";

function validInspection(): PdfInspection {
  return {
    byteLength: 10_000,
    pageCount: 1,
    pageTexts: [
      "Evren Keskin evrenkeskin0998@gmail.com +90 507 110 2287 Skills Experience Projects Education Languages",
    ],
    text: "Evren Keskin evrenkeskin0998@gmail.com +90 507 110 2287 Skills Experience Projects Education Languages",
  };
}

describe("PDF smoke assertions", () => {
  const model = resolveVariant(loadResume(), loadVariants(), "software");

  it("accepts extractable ATS text in section order", () => {
    expect(() => assertPdfSmoke(validInspection(), model)).not.toThrow();
  });

  it("rejects a focused variant that overflows to a second page", () => {
    const inspection = validInspection();
    inspection.pageCount = 2;
    inspection.pageTexts.push("overflow");

    expect(() => assertPdfSmoke(inspection, model)).toThrow(/expected 1-1/);
  });

  it("rejects a blank PDF page", () => {
    const inspection = validInspection();
    inspection.pageTexts = [""];

    expect(() => assertPdfSmoke(inspection, model)).toThrow(/blank/);
  });

  it("rejects missing ATS headings", () => {
    const inspection = validInspection();
    inspection.text = inspection.text.replace("Experience", "");

    expect(() => assertPdfSmoke(inspection, model)).toThrow(/Experience/);
  });
});
