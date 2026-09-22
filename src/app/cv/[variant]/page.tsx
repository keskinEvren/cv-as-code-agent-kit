import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { VariantNavigation } from "@/components/resume/VariantNavigation";
import { loadResumeData, resolveVariant, ResumeDataError } from "@/lib/resume";

type PageProps = {
  params: Promise<{ variant: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const { variants } = loadResumeData();
  return variants.variants.map(({ id }) => ({ variant: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { variant: variantId } = await params;
  const model = getResolvedVariant(variantId);
  if (!model) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const canonical = baseUrl ? new URL(`/cv/${variantId}`, baseUrl) : undefined;
  const title = `${model.variant.label} CV`;
  const description = `${model.variant.label} resume for ${model.basics.name}.`;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: model.variant.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "profile",
      title,
      description,
      url: canonical,
    },
  };
}

export default async function CvVariantPage({ params }: PageProps) {
  const { variant: variantId } = await params;
  const model = getResolvedVariant(variantId);

  if (!model) notFound();

  const { variants } = loadResumeData();

  return (
    <main className="cv-shell" data-cv-app="evren-keskin-cv">
      <VariantNavigation
        activeVariantId={variantId}
        variants={variants.variants.map(({ id, label }) => ({ id, label }))}
      />
      <ResumeDocument resume={model} />
    </main>
  );
}

function getResolvedVariant(variantId: string) {
  const { resume, variants } = loadResumeData();

  try {
    return resolveVariant(resume, variants, variantId);
  } catch (error) {
    if (error instanceof ResumeDataError && error.message.startsWith("Unknown CV variant")) {
      return undefined;
    }
    throw error;
  }
}
