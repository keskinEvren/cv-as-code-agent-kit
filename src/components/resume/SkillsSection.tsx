import type { ResolvedSkillGroup } from "@/lib/resume/view-model";

export function SkillsSection({ skills }: { skills: ResolvedSkillGroup[] }) {
  return (
    <dl className="skills-list">
      {skills.map((group) => (
        <div key={group.id} className="skills-list__group">
          <dt>{group.label}</dt>
          <dd>{group.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}
