import { displayUrl } from "@/lib/resume/format";
import type { ResolvedResume } from "@/lib/resume/view-model";

type ResumeHeaderProps = Pick<ResolvedResume, "basics" | "summary">;

export function ResumeHeader({ basics, summary }: ResumeHeaderProps) {
  const links = [
    basics.portfolioUrl,
    basics.githubUrl,
    basics.linkedinUrl,
  ].filter((value): value is string => Boolean(value));

  return (
    <header className="resume-header">
      <div className="resume-header__identity">
        <h1>{basics.name}</h1>
        <p className="resume-header__headline">{basics.headline}</p>
      </div>

      <address className="resume-header__contact">
        <span>{basics.location}</span>
        <a href={`mailto:${basics.email}`}>{basics.email}</a>
        <a href={`tel:${basics.phone.replace(/\s/g, "")}`}>{basics.phone}</a>
        {links.map((link) => (
          <a key={link} href={link} rel="noreferrer">
            {displayUrl(link)}
          </a>
        ))}
      </address>

      <p className="resume-header__summary">{summary}</p>
    </header>
  );
}
