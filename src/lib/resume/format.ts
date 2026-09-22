const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export function formatResumeDate(value: string): string {
  if (/^\d{4}$/.test(value)) return value;
  const [year, month] = value.split("-").map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatDateRange(
  startDate: string,
  endDate?: string | null,
  current?: boolean,
): string {
  const end = current || !endDate ? "Present" : formatResumeDate(endDate);
  return `${formatResumeDate(startDate)} - ${end}`;
}

export function displayUrl(value: string): string {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
