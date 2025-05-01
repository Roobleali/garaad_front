import useSWR from "swr";
import { Category } from "@/types/lms";

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
    throw new Error("Failed to fetch courses");
  }

  return response.json();
};

export function useCourses() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    courses: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCourseBySlug(categoryId: string, courseSlug: string) {
  const { data, error, isLoading, mutate } = useSWR<Category>(
    categoryId && courseSlug
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/${categoryId}/courses/${courseSlug}/`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    course: data,
    isLoading,
    isError: error,
    mutate,
  };
}
