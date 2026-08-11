import { Skeleton, MentorCardSkeleton } from './Skeleton';

export default function RouteSkeleton() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-9 w-56 mb-4" />
      <Skeleton className="h-5 w-80 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <MentorCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
