import { useMemo } from "react";
import useSWR from "swr";
import { Category, Course, Lesson } from "@/types/lms";
import axios from "axios";
import { Module } from "@/types/learning";
import { API_BASE_URL } from "@/lib/constants";

// Add cache configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  // Add persistent cache
  provider: () => new Map(),
  // Add cache persistence
  persistSize: 1000, // Maximum number of items to persist
  // Add stale-while-revalidate strategy
  revalidateIfStale: true,
  revalidateOnMount: true,
};

const fetcher = async (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

// Categories and Courses
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    `${API_BASE_URL}/api/lms/categories/`,
    fetcher,
    swrConfig
  );

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// export function useCourse(categoryId: string, courseSlug: string) {
//   const { data, error, isLoading, mutate } = useSWR<Course>(
//     categoryId && courseSlug
//       ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/${categoryId}/courses/${courseSlug}/`
//       : null,
//     fetcher,
//     swrConfig
//   );

//   return {
//     course: data,
//     isLoading,
//     isError: error,
//     mutate,
//   };
// }

// Modules
export function useModule(courseId: string, moduleId: string) {
  const { data, error, isLoading, mutate } = useSWR<Module>(
    courseId && moduleId
      ? `${API_BASE_URL}/api/lms/courses/${courseId}/modules/${moduleId}/`
      : null,
    fetcher,
    swrConfig
  );

  return {
    module: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Lessons
export function useLesson(moduleId: string, lessonId: string) {
  const { data, error, isLoading, mutate } = useSWR<Lesson>(
    moduleId && lessonId
      ? `${API_BASE_URL}/api/lms/modules/${moduleId}/lessons/${lessonId}/`
      : null,
    fetcher,
    swrConfig
  );

  return {
    lesson: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Progress
export function useUserProgress() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/lms/user/progress/`,
    fetcher,
    swrConfig
  );

  return {
    progress: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Leaderboard
export function useLeaderboard(
  timePeriod: "daily" | "weekly" | "all_time" = "all_time"
) {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/lms/leaderboard/?time_period=${timePeriod}`,
    fetcher,
    swrConfig
  );

  return {
    leaderboard: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Rank
export function useUserRank() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/lms/leaderboard/my_rank/`,
    fetcher,
    swrConfig
  );

  return {
    rank: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Rewards
export function useUserRewards(lessonId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    lessonId
      ? `${API_BASE_URL}/api/lms/rewards?lesson_id=${lessonId}`
      : `${API_BASE_URL}/api/lms/rewards`,
    fetcher,
    swrConfig
  );

  return {
    rewards: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Streak
export function useUserStreak() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/streaks/`,
    fetcher,
    swrConfig
  );

  console.log("streak:", data);

  return {
    streak: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCourse(categoryId: string, courseSlug: string) {
  const shouldFetch = !!categoryId && !!courseSlug;

  // Fetch the specific course list for this category
  // Using [URL, courseSlug] as key ensures SWR properly isolates caches for different courses in the same category
  const {
    data: courseData,
    error: courseError,
    isLoading: isCourseLoading,
    mutate: mutateCourse,
  } = useSWR<Course>(
    shouldFetch
      ? [`${API_BASE_URL}/api/lms/courses/?category=${categoryId}`, courseSlug]
      : null,
    async ([url]: [string, string]) => {
      const data = await fetcher(url);
      const found = data.find((c: Course) => c.slug === courseSlug);
      if (!found) throw new Error("Koorso lama helin");
      return found;
    },
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  // Fetch lessons using the specific course ID
  const {
    data: lessonsData,
    error: lessonsError,
    isLoading: isLessonsLoading,
    mutate: mutateLessons,
  } = useSWR<Lesson[]>(
    courseData?.id
      ? `${API_BASE_URL}/api/lms/lessons/?course=${courseData.id}`
      : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  // Combine data: Map EACH flat lesson to its own module for the zigzag view "simpel"
  const courseWithModules = useMemo(() => {
    if (!courseData) return null;

    // Each lesson becomes a module bubble in the zigzag path
    const syntheticModules = lessonsData
      ? [...lessonsData]
        .sort((a, b) => (a.lesson_number || 0) - (b.lesson_number || 0))
        .map((lesson) => ({
          id: lesson.id,
          course_id: courseData.id,
          title: lesson.title,
          description: lesson.description || "",
          order: lesson.lesson_number || 1,
          lessons: [lesson], // One lesson per bubble
        }))
      : [];

    return {
      ...courseData,
      modules: syntheticModules as unknown as Module[],
    };
  }, [courseData, lessonsData]);

  return {
    course: courseWithModules as unknown as Course,
    isLoading: isCourseLoading || isLessonsLoading,
    error: courseError || lessonsError,
    mutate: () => {
      mutateCourse();
      mutateLessons();
    },
  };
}
