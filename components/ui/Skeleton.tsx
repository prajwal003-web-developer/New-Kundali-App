export function SkeletonText({ w = 'full', h = 4 }: { w?: string; h?: number }) {
  return <div className={`skeleton rounded w-${w} h-${h}`} />
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="card">
      <div className="skeleton h-5 w-1/3 rounded mb-4 mx-auto" />
      <div className="skeleton mx-auto rounded" style={{ width: 320, height: 320 }} />
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="skeleton h-5 w-20 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function SkeletonResult() {
  return (
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonChart />
      <SkeletonCard />
    </div>
  )
}
