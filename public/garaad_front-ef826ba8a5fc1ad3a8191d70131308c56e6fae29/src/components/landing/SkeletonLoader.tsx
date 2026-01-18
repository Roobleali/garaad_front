const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
);

export function SectionSkeleton() {
    return (
        <div className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            <div className="relative h-10 w-1/3 bg-primary/10 rounded-lg overflow-hidden">
                <Shimmer />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="relative aspect-video w-full bg-primary/5 rounded-xl overflow-hidden">
                            <Shimmer />
                        </div>
                        <div className="relative h-6 w-2/3 bg-primary/5 rounded overflow-hidden">
                            <Shimmer />
                        </div>
                        <div className="relative h-4 w-full bg-primary/5 rounded overflow-hidden">
                            <Shimmer />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="w-full h-[600px] flex flex-col items-center justify-center space-y-8 px-4">
            <div className="relative h-16 w-3/4 bg-primary/10 rounded-2xl overflow-hidden">
                <Shimmer />
            </div>
            <div className="relative h-16 w-1/2 bg-primary/10 rounded-2xl overflow-hidden">
                <Shimmer />
            </div>
            <div className="relative h-12 w-40 bg-secondary/10 rounded-xl overflow-hidden">
                <Shimmer />
            </div>
        </div>
    );
}
