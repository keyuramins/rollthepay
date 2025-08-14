import { formatCurrency, formatHourlyRate, getLocale, getCurrencyCode } from "@/lib/format/currency";
import type { OccupationRecord } from "@/lib/data/types";

export interface OccupationPageProps {
  record: OccupationRecord;
}

export default function OccupationPage({ record }: OccupationPageProps) {
  const locale = getLocale(record.country);
  const currency = getCurrencyCode(record.country);

  const displayTitle = record.title || record.h1Title || record.occupation || record.slug_url;
  const low = formatCurrency(record.lowSalary, record.country, record);
  const avg = formatCurrency(record.avgAnnualSalary, record.country, record);
  const high = formatCurrency(record.highSalary, record.country, record);

  const hasExperience = [
    record.entryLevel,
    record.earlyCareer,
    record.midCareer,
    record.experienced,
    record.lateCareer,
  ].some((v) => typeof v === "number" && Number.isFinite(v));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">{displayTitle}</h1>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          {record.country}
          {record.state ? ` • ${record.state}` : ""}
          {record.location ? ` • ${record.location}` : ""}
        </p>
        {record.occupation && <p>Occupation: {record.occupation}</p>}
        <p>Slug: {record.slug_url}</p>
      </div>

      {(low || avg || high) && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {low && (
            <div className="rounded border p-4">
              <div className="text-xs text-muted-foreground">Low</div>
              <div className="text-lg font-medium">{low}</div>
            </div>
          )}
          {avg && (
            <div className="rounded border p-4">
              <div className="text-xs text-muted-foreground">Average</div>
              <div className="text-lg font-medium">{avg}</div>
            </div>
          )}
          {high && (
            <div className="rounded border p-4">
              <div className="text-xs text-muted-foreground">High</div>
              <div className="text-lg font-medium">{high}</div>
            </div>
          )}
        </section>
      )}

      {hasExperience && (
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {typeof record.entryLevel === "number" && Number.isFinite(record.entryLevel) && (
              <div className="rounded border p-3">Entry level: {record.entryLevel}</div>
            )}
            {typeof record.earlyCareer === "number" && Number.isFinite(record.earlyCareer) && (
              <div className="rounded border p-3">Early career: {record.earlyCareer}</div>
            )}
            {typeof record.midCareer === "number" && Number.isFinite(record.midCareer) && (
              <div className="rounded border p-3">Mid career: {record.midCareer}</div>
            )}
            {typeof record.experienced === "number" && Number.isFinite(record.experienced) && (
              <div className="rounded border p-3">Experienced: {record.experienced}</div>
            )}
            {typeof record.lateCareer === "number" && Number.isFinite(record.lateCareer) && (
              <div className="rounded border p-3">Late career: {record.lateCareer}</div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}


