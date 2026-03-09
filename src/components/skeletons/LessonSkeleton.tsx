"use client";

/**
 * Matches lesson layout: title bar, video placeholder, content blocks.
 * Use while auth/store hydrates or lesson data loads to avoid layout shift.
 */
export function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-white/95 dark:bg-black/95 backdrop-blur h-14 flex items-center px-4 gap-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
        <div className="flex-1 flex gap-1 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-2 w-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full" />
          ))}
        </div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      </div>
      <main className="pt-6 pb-32 max-w-4xl mx-auto px-4">
        <div className="aspect-video w-full bg-gray-800 dark:bg-gray-900 animate-pulse rounded-xl mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              <div className="h-4 w-4/5 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
