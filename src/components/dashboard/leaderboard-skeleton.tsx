export function LeaderboardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="h-6 w-24 bg-zinc-700 rounded animate-pulse"></div>
        <div className="h-8 w-20 bg-zinc-700 rounded animate-pulse"></div>
      </div>
      
      {/* Table header */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-zinc-700 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-zinc-700 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Table rows */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border-b border-zinc-800 px-4 py-3 last:border-0">
          <div className="flex items-center gap-4">
            <div className="h-4 w-6 bg-zinc-700 rounded animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-zinc-700 rounded-full animate-pulse"></div>
              <div>
                <div className="h-4 w-20 bg-zinc-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-16 bg-zinc-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 w-8 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-5 w-5 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
