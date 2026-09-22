import { formatDateRange } from "@/lib/resume/format";
import type { ResolvedWork } from "@/lib/resume/view-model";

export function WorkItem({ work }: { work: ResolvedWork }) {
  return (
    <article className="resume-item">
      <header className="resume-item__header">
        <div>
          <h3>{work.position}</h3>
          <p className="resume-item__organization">
            {work.company}
            {work.location ? `, ${work.location}` : ""}
          </p>
        </div>
        <p className="resume-item__date">
          {formatDateRange(work.startDate, work.endDate, work.current)}
        </p>
      </header>

      {work.summary ? <p>{work.summary}</p> : null}
      {work.bullets.length > 0 ? (
        <ul className="resume-bullets">
          {work.bullets.map((bullet) => (
            <li key={bullet.id}>{bullet.text}</li>
          ))}
        </ul>
      ) : null}
      {work.technologies?.length ? (
        <p className="resume-item__technologies">
          <strong>Technologies:</strong> {work.technologies.join(", ")}
        </p>
      ) : null}
    </article>
  );
}
