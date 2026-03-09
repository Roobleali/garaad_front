"use client";

/**
 * Same height and layout as Header so there is no layout shift while auth hydrates.
 */
export function NavbarSkeleton() {
  return (
    <header className="py-5 bg-white dark:bg-black/95 backdrop-blur-md border-b border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="items-center gap-8 flex">
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
          <nav className="hidden md:flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
          </div>
          <div className="flex md:hidden items-center gap-2">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    </header>
  );
}
