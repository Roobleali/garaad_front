"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumContent from "@/components/PremiumContent";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-course.svg";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const CategoryImage = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="relative w-20 h-20">
    <Image
      src={src && isValidUrl(src) ? src : defaultCategoryImage}
      alt={alt}
      fill
      className="object-contain"
    />
  </div>
);

const CourseImage = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
    <Image
      src={src && isValidUrl(src) ? src : defaultCourseImage}
      alt={alt}
      width={100}
      height={100}
      className="object-contain"
    />
  </div>
);

interface Course {
  id: string;
  is_published: boolean;
  thumbnail?: string;
  title: string;
  is_new: boolean;
  slug: string;
}

export default function CoursesPage() {
  const { categories, isLoading, isError } = useCategories();

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load categories.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PremiumContent>
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          <h1 className="text-xl md:text-3xl font-bold mb-2">
            Wadooyinka Waxbarashada
          </h1>
          <p className="text-[16px] text-[#6B7280] mb-8">
            Wadooyin isku xiga oo loo maro hanashada
          </p>

          <div className="space-y-16">
            {(isLoading ? Array(3).fill(null) : categories ?? []).map(
              (category, idx) => (
                <div key={category?.id ?? idx}>
                  <div className="flex items-start gap-6 mb-8">
                    {isLoading ? (
                      <Skeleton className="w-20 h-20 rounded-full" />
                    ) : (
                      <CategoryImage src={category.image} alt={category.title} />
                    )}
                    <div>
                      <h2 className="md:text-2xl font-bold mb-1">
                        {isLoading ? (
                          <Skeleton className="w-48 h-6" />
                        ) : (
                          category.title
                        )}
                      </h2>
                      <div className="text-[#6B7280] text-lg">
                        {isLoading ? (
                          <Skeleton className="w-64 h-4" />
                        ) : (
                          category.description
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-lg bg-accent">
                    {(isLoading ? Array(4).fill(null) : category.courses).map(
                      (course: Course | null, index: number) => {
                        const courseCard = (
                          <Card
                            key={course?.id ?? index}
                            className={`group overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] hover:shadow-lg ${!course?.is_published
                              ? "pointer-events-none opacity-50"
                              : ""
                              }`}
                          >
                            <div className="relative">
                              {isLoading ? (
                                <Skeleton className="h-40 w-full" />
                              ) : (
                                <CourseImage
                                  src={course?.thumbnail}
                                  alt={course?.title ?? "Course image"}
                                />
                              )}
                              {!isLoading && course?.is_new && (
                                <span className="absolute top-3 right-3 bg-[#22C55E] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                  NEW
                                </span>
                              )}
                              {!isLoading && course?.is_published === false && (
                                <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm z-20">
                                  Dhowaan
                                </span>
                              )}
                            </div>
                            <div className="p-4 text-center">
                              {isLoading ? (
                                <Skeleton className="h-4 w-32 mx-auto" />
                              ) : (
                                <h3 className="font-medium text-base group-hover:text-[#2563EB] transition-colors">
                                  {course?.title}
                                </h3>
                              )}
                            </div>
                          </Card>
                        );

                        if (isLoading || !course?.is_published) {
                          return courseCard;
                        }

                        return (
                          <Link
                            href={`/courses/${category.id}/${course.slug}`}
                            key={course.id}
                          >
                            {courseCard}
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </PremiumContent>
    </div>
  );
}
