import { Skeleton } from "@/components/ui/skeleton";

export function StartupCardSkeleton() {
    return (
        <div className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex gap-4">
                {/* Logo Skeleton */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                    <Skeleton className="w-full h-full bg-white/10" />
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Title & Tagline */}
                    <div>
                        <Skeleton className="h-6 w-32 bg-white/10 mb-2" />
                        <Skeleton className="h-4 w-48 bg-white/10" />
                    </div>

                    {/* Tech Stack */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="w-6 h-6 rounded-full bg-white/10" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-8 bg-white/10" />
                    <Skeleton className="h-4 w-8 bg-white/10" />
                </div>
            </div>
        </div>
    );
}
