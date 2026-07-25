export default function Loading() {
  return (
    <>
      <div className="mb-3 mt-8 h-3 w-32 animate-pulse rounded-sm bg-muted" />
      <div className="mb-10 h-5 w-2/3 max-w-[60ch] animate-pulse rounded-sm bg-muted" />
      <ul className="w-full flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center justify-between border-b border-border py-4"
          >
            <div className="h-4 w-1/2 animate-pulse rounded-sm bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-sm bg-muted" />
          </li>
        ))}
      </ul>
    </>
  );
}
