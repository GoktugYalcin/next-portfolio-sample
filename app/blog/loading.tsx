import { Section } from "@/components/generated/Frame";

export default function Loading() {
  return (
    <Section as="h1" title="Writing" flush>
      <div className="border-b border-dotted border-border px-5 py-7 sm:px-6">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <ul className="flex w-full flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-6 border-b border-dotted border-border px-5 py-4 last:border-b-0 sm:px-6"
          >
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
