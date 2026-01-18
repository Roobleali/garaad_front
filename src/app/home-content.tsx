"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { SectionSkeleton } from "@/components/landing/SkeletonLoader";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

const TestimonialsSection = dynamic(() => import("@/components/landing/TestimonialsSection").then(mod => mod.TestimonialsSection), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

const CommunityCTASection = dynamic(() => import("@/components/landing/CommunityCTASection").then(mod => mod.CommunityCTASection), {
    loading: () => <SectionSkeleton />,
    ssr: true
});

export function HomeContent() {
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = !!user;

    return (
        <main>
            {isAuthenticated ? (
                <StudentDashboard />
            ) : (
                <>
                    <HeroSection />

                    <Suspense fallback={<SectionSkeleton />}>
                        <TestimonialsSection />
                    </Suspense>

                    <Suspense fallback={<SectionSkeleton />}>
                        <CommunityCTASection />
                    </Suspense>
                </>
            )}
        </main>
    );
}
