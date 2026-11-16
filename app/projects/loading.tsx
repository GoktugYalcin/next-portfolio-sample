import { Section } from "@/components/generated/Frame";

export default function Loading() {
  return (
    <Section as="h1" title="Projects">
      <div className="mb-8 h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-full animate-pulse rounded-xl border border-border bg-card p-4"
          >
            <div className="h-28 rounded-lg bg-muted" />
            <div className="mt-4 h-5 w-1/2 rounded bg-muted" />
            <div className="mt-3 h-3 w-full rounded bg-muted" />
            <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    </Section>
  );
}
