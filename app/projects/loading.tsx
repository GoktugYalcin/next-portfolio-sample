import { Band, PageHead, Section } from "@/components/generated/PageHead";

export default function Loading() {
  return (
    <>
      <PageHead crumb="projects" title="projects" />
      <Band />
      <Section reveal={false}>
        <div className="cases">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="case animate-pulse" aria-hidden>
              <div className="h-3 w-1/3 rounded bg-muted" />
              <div className="mt-4 h-5 w-1/2 rounded bg-muted" />
              <div className="mt-3 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
