"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { PracticeSet } from "@/components/practice/PracticeSet";
import { GamificationPanel } from "@/components/gamification/GamificationPanel";
import { RecommendedCoursesSection } from "@/components/courses/RecommendedCoursesSection";
import { progressService } from "@/services/progress";
import { practiceService } from "@/services/practice";
import { useCategories, useOnboarding, useEnrollments } from "@/hooks/useApi";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserProgress } from "@/services/progress";
import type { PracticeSet as PracticeSetType } from "@/services/practice";
import type { Course } from "@/types/lms";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [practiceSets, setPracticeSets] = useState<PracticeSetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { goal_label, hasOnboardingData } = useOnboarding();
  const { enrollments } = useEnrollments();
  const { isAuthenticated } = useAuthStore();

  const getCourseProgress = (courseId: number) => {
    if (!enrollments || !Array.isArray(enrollments)) return undefined;
    const e = enrollments.find((x: { course: number }) => x.course === courseId);
    return (e as { progress_percent?: number } | undefined)?.progress_percent;
  };

  const safeCategories = useMemo(() => Array.isArray(categories) ? categories : [], [categories]);

  const { spotlightCourses, spotlightTitle } = useMemo(() => {
    const recommended: { course: Course; categoryId: string }[] = [];
    for (const cat of safeCategories) {
      if (!cat?.courses?.length) continue;
      for (const c of cat.courses) {
        if (c?.is_published && c.recommended) recommended.push({ course: c, categoryId: String(cat.id) });
      }
    }
    if (recommended.length > 0) {
      return {
        spotlightCourses: recommended,
        spotlightTitle: hasOnboardingData && goal_label ? `Based on your goal: ${goal_label}` : "Recommended for you",
      };
    }
    const popular: { course: Course; categoryId: string }[] = [];
    for (const cat of safeCategories) {
      if (!cat?.courses?.length) continue;
      for (const c of cat.courses) {
        if (c?.is_published) popular.push({ course: c, categoryId: String(cat.id) });
      }
    }
    return {
      spotlightCourses: popular.slice(0, 6),
      spotlightTitle: "Popular courses",
    };
  }, [safeCategories, hasOnboardingData, goal_label]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          progressData,
          practiceSetsData,
        ] = await Promise.all([
          progressService.getUserProgress(),
          practiceService.getPracticeSets(),
        ]);

        setProgress(progressData);
        setPracticeSets(practiceSetsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Boorka Shaqada</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        <div className="space-y-8">
          <ProgressCard progress={progress} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {practiceSets.map((practiceSet) => (
            <PracticeSet
              key={practiceSet.id}
              practiceSet={practiceSet}
              onSubmit={(problemId, answer) => {
                // Handle answer submission
                console.log("Answer submitted:", { problemId, answer });
              }}
            />
          ))}
        </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <GamificationPanel />
        </aside>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link href="/courses" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
          View full course list →
        </Link>
      </div>
    </div>
  );
}
