export default function Loading() {
  return (
    <>
      <div className="mb-10 mt-12 h-5 w-2/3 max-w-[60ch] mx-auto animate-pulse rounded bg-muted" />
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 w-full animate-pulse rounded-lg border border-border bg-card p-6"
          >
            <div className="h-6 w-1/2 rounded bg-muted" />
            <div className="mt-3 h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    </>
  );
}
