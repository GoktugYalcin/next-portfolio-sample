import { Band, PageHead, Section } from "@/components/generated/PageHead";

export default function Loading() {
  return (
    <>
      <PageHead crumb="blog" title="writing" />
      <Band />
      <Section reveal={false} className="flush">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="project animate-pulse" aria-hidden>
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="mt-3 h-3 w-1/4 rounded bg-muted" />
          </div>
        ))}
      </Section>
    </>
  );
}
