
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-32 md:h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3 mx-auto" />
    </div>
  );
}
