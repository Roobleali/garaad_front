"use client";

/**
 * Card shape matching course list cards; use in grids to avoid layout shift.
 */
export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-slate-900">
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="h-10 w-28 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
