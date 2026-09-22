import type { SectionId } from "./schema";

export type ResolvedBullet = {
  id: string;
  text: string;
};

export type ResolvedBasics = {
  name: string;
  location: string;
  email: string;
  phone: string;
  headline: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

export type ResolvedSkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type ResolvedWork = {
  id: string;
  company: string;
  location?: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  summary?: string;
  products?: string[];
  bullets: ResolvedBullet[];
  technologies?: string[];
};

export type ResolvedProject = {
  id: string;
  name: string;
  subtitle?: string | null;
  url?: string | null;
  repositoryUrl?: string | null;
  bullets: ResolvedBullet[];
  technologies?: string[];
};

export type ResolvedEducation = {
  id: string;
  institution: string;
  location?: string;
  degree: string;
  startDate?: string;
  graduationYear: string;
};

export type ResolvedCertificate = {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
  url?: string;
};

export type ResolvedLanguage = {
  id: string;
  language: string;
  proficiency: string;
};

export type ResolvedResume = {
  variant: {
    id: string;
    label: string;
    public: boolean;
    noindex: boolean;
  };
  basics: ResolvedBasics;
  summary: string;
  sections: SectionId[];
  skills: ResolvedSkillGroup[];
  work: ResolvedWork[];
  projects: ResolvedProject[];
  education: ResolvedEducation[];
  certificates: ResolvedCertificate[];
  languages: ResolvedLanguage[];
};
