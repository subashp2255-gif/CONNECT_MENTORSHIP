export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-panel border border-border/70 ${className}`} />;
}

export function MentorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
