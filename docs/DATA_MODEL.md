# Data Model

The canonical data format is intentionally close to JSON Resume but adds stable IDs and privacy controls.

## Top-level shape

```ts
type Resume = {
  meta: ResumeMeta
  basics: Basics
  summaries: Record<string, string>
  skills: SkillGroup[]
  work: WorkItem[]
  projects: Project[]
  education: Education[]
  certificates: Certificate[]
  languages: Language[]
}
```

## Stable IDs

All selectable items must have stable IDs.

Example:
```json
{
  "id": "rappider-frontend-intern-2023",
  "company": "Rappider"
}
```

## Work item

```ts
type WorkItem = {
  id: string
  company: string
  location?: string
  position: string
  startDate: string
  endDate?: string
  current?: boolean
  visibility: "public" | "private" | "confidential"
  summary?: string
  bullets: {
    id: string
    text: string
  }[]
  technologies?: string[]
}
```

## Project

```ts
type Project = {
  id: string
  name: string
  subtitle?: string
  url?: string
  repositoryUrl?: string
  repositoryVisibility?: "public" | "private" | "none"
  visibility: "public" | "private" | "confidential"
  bullets: {
    id: string
    text: string
  }[]
  technologies?: string[]
}
```

## Variant

```ts
type Variant = {
  id: string
  label: string
  public: boolean
  noindex?: boolean
  summaryKey: string
  work: {
    id: string
    bulletIds?: string[]
  }[]
  projects: {
    id: string
    bulletIds?: string[]
  }[]
  skillGroupIds?: string[]
  sections: string[]
}
```

## Date format

Use:
- `YYYY-MM` for month precision,
- `YYYY` only if the source has year precision.

Do not fabricate a month to satisfy formatting.

## Privacy behavior

### public
May appear on the public website and public PDF.

### private
May appear in a private/export-only variant.
Repository URL must not appear unless explicitly approved.

### confidential
Only generic wording may be exposed.
Client/company identity should be omitted from public variants.

## Content integrity rules

- Facts are immutable unless the user changes them.
- Variants do not override dates/employers/technology facts.
- Variant-specific summaries may emphasize different aspects, but may not introduce new factual claims.
