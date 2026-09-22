import type { SectionId } from "@/lib/resume/schema";
import type { ResolvedResume } from "@/lib/resume/view-model";

import { ProjectItem } from "./ProjectItem";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeSection } from "./ResumeSection";
import { SkillsSection } from "./SkillsSection";
import { WorkItem } from "./WorkItem";

const sectionTitles: Record<SectionId, string> = {
  skills: "Skills",
  work: "Experience",
  projects: "Projects",
  education: "Education",
  certificates: "Certificates",
  languages: "Languages",
};

export function ResumeDocument({ resume }: { resume: ResolvedResume }) {
  return (
    <article
      className="resume-document"
      data-variant={resume.variant.id}
      data-render-complete="true"
    >
      <ResumeHeader basics={resume.basics} summary={resume.summary} />

      {resume.sections.map((sectionId) => {
        const content = renderSection(sectionId, resume);
        if (!content) return null;

        return (
          <ResumeSection key={sectionId} id={sectionId} title={sectionTitles[sectionId]}>
            {content}
          </ResumeSection>
        );
      })}
    </article>
  );
}

function renderSection(sectionId: SectionId, resume: ResolvedResume) {
  switch (sectionId) {
    case "skills":
      return resume.skills.length ? <SkillsSection skills={resume.skills} /> : null;
    case "work":
      return resume.work.length ? (
        <div className="resume-items">
          {resume.work.map((work) => (
            <WorkItem key={work.id} work={work} />
          ))}
        </div>
      ) : null;
    case "projects":
      return resume.projects.length ? (
        <div className="resume-items">
          {resume.projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      ) : null;
    case "education":
      return resume.education.length ? (
        <div className="compact-list">
          {resume.education.map((education) => (
            <article key={education.id} className="compact-list__item">
              <div>
                <h3>{education.degree}</h3>
                <p>
                  {education.institution}
                  {education.location ? `, ${education.location}` : ""}
                </p>
              </div>
              <p>{education.graduationYear}</p>
            </article>
          ))}
        </div>
      ) : null;
    case "certificates":
      return resume.certificates.length ? (
        <ul className="inline-list">
          {resume.certificates.map((certificate) => (
            <li key={certificate.id}>
              {certificate.url ? (
                <a href={certificate.url}>{certificate.name}</a>
              ) : (
                certificate.name
              )}
              {certificate.issuer ? `, ${certificate.issuer}` : ""}
            </li>
          ))}
        </ul>
      ) : null;
    case "languages":
      return resume.languages.length ? (
        <ul className="inline-list">
          {resume.languages.map((language) => (
            <li key={language.id}>
              <strong>{language.language}:</strong> {language.proficiency}
            </li>
          ))}
        </ul>
      ) : null;
  }
}
