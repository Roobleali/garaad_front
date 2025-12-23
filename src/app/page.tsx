import { Header } from "@/components/Header";
import dynamic from "next/dynamic";
import { FooterSection } from "@/components/sections/FooterSection";
import { CourseGrid } from "@/components/CourseGrid";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectionSkeleton } from "@/components/landing/SkeletonLoader";
import { Suspense } from "react";
import { Reveal } from "@/components/landing/Reveal";

// Dynamically import only necessary heavy sections
const DynamicGuidedPathsSection = dynamic(
  () => import("@/components/sections/GuidedPathsSection").then((mod) => mod.GuidedPathsSection)
);

const DynamicLearningLevelsSection = dynamic(
  () => import("@/components/sections/LearningLevelsSection").then((mod) => mod.LearningLevelsSection)
);

const DynamicDownloadApp = dynamic(
  () => import("@/components/sections/DownloadApp").then((mod) => mod.default)
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="relative">
          {/* Above the fold - Hero is Client Component for animations/user-state */}
          <HeroSection />

          <Reveal>
            <CourseGrid />
          </Reveal>

          <Suspense fallback={<SectionSkeleton />}>
            <Reveal>
              <DynamicGuidedPathsSection />
            </Reveal>
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <Reveal>
              <DynamicLearningLevelsSection />
            </Reveal>
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <Reveal>
              <DynamicDownloadApp />
            </Reveal>
          </Suspense>

          <FooterSection />
        </div>
      </main>
    </div>
  );
}
