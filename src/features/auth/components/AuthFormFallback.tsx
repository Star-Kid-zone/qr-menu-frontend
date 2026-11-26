import { Skeleton } from "@/components/ui/skeleton";

/** Same shape as the forms, so nothing jumps when the real form appears. */
export function AuthFormFallback({ fields = 2 }: { fields?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-3 h-5 w-56" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
