import { resolve } from "node:path";

import { loadResumeData, resolveVariant } from "../src/lib/resume";
import { pdfFileNameForVariant } from "../src/lib/resume/pdf";
import { assertPdfSmoke, inspectPdf } from "./pdf-smoke";

const { resume, variants } = loadResumeData();
const requestedVariant = readVariantArgument(process.argv.slice(2));
const variantIds = requestedVariant
  ? [requestedVariant]
  : variants.variants.map(({ id }) => id);

for (const variantId of variantIds) {
  const model = resolveVariant(resume, variants, variantId);
  const filePath = resolve("dist", pdfFileNameForVariant(variantId));
  const inspection = await inspectPdf(filePath);
  assertPdfSmoke(inspection, model);
  console.log(
    `${variantId}: ${inspection.pageCount} page(s), ${inspection.byteLength} bytes, ATS text checks passed.`,
  );
}

function readVariantArgument(args: string[]): string | undefined {
  const inline = args.find((argument) => argument.startsWith("--variant="));
  if (inline) return inline.slice("--variant=".length);
  const index = args.indexOf("--variant");
  return index >= 0 ? args[index + 1] : undefined;
}
