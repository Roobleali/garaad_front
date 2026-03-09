"use client";

/**
 * Sidebar width with stacked gray bars; use when sidebar content depends on auth.
 */
export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-black/95 border-r border-gray-200 dark:border-gray-800">
      <div className="p-6">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      </div>
      <nav className="mt-8 space-y-1 px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </nav>
    </aside>
  );
}
