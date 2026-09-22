import { displayUrl } from "@/lib/resume/format";
import type { ResolvedProject } from "@/lib/resume/view-model";

export function ProjectItem({ project }: { project: ResolvedProject }) {
  return (
    <article className="resume-item resume-item--project">
      <header className="resume-item__header">
        <div>
          <h3>{project.name}</h3>
          {project.subtitle ? (
            <p className="resume-item__organization">{project.subtitle}</p>
          ) : null}
        </div>
        <div className="resume-item__links">
          {project.url ? (
            <a href={project.url}>{displayUrl(project.url)}</a>
          ) : null}
          {project.repositoryUrl ? (
            <a href={project.repositoryUrl}>{displayUrl(project.repositoryUrl)}</a>
          ) : null}
        </div>
      </header>

      <ul className="resume-bullets">
        {project.bullets.map((bullet) => (
          <li key={bullet.id}>{bullet.text}</li>
        ))}
      </ul>
      {project.technologies?.length ? (
        <p className="resume-item__technologies">
          <strong>Stack:</strong> {project.technologies.join(", ")}
        </p>
      ) : null}
    </article>
  );
}
