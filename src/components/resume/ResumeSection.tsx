type ResumeSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export function ResumeSection({ id, title, children }: ResumeSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section className="resume-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <div className="resume-section__content">{children}</div>
    </section>
  );
}
