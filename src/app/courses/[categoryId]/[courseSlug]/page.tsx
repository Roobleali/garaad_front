// src/app/courses/[categoryId]/[courseSlug]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "@/store/features/learningSlice";
import { AppDispatch, RootState } from "@/store";
import { BookOpen, Clock, Trophy, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

const defaultCourseImage = "/images/placeholder-course.svg";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, isLoading, error } = useSelector(
    (state: RootState) => state.learning
  );

  useEffect(() => {
    if (params.categoryId && params.courseSlug) {
      dispatch(
        fetchCourse({
          categoryId: params.categoryId as string,
          courseSlug: params.courseSlug as string,
        })
      );
    }
  }, [dispatch, params.categoryId, params.courseSlug]);

  const handleModuleClick = (moduleId: string | number) => {
    router.push(
      `/courses/${params.categoryId}/${params.courseSlug}/modules/${moduleId}`
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Course Info */}
          <div className="space-y-8">
            <div className="relative w-full h-64 bg-[#F8F9FB] rounded-2xl overflow-hidden">
              <Image
                src={currentCourse.thumbnail || defaultCourseImage}
                alt={currentCourse.title}
                fill
                className="object-contain"
                priority={true}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{currentCourse.title}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {currentCourse.description}
              </p>
            </div>

            <div className="flex gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{currentCourse.totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{currentCourse.estimatedHours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>{currentCourse.skillLevel}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Learning Path */}
          <div className="relative">
            <div className="space-y-6">
              {(currentCourse?.modules ?? []).map((module, index) => (
                <div key={module.id} className="relative">
                  {/* Connecting Line */}
                  {index < (currentCourse?.modules?.length ?? 0) - 1 && (
                    <div className="absolute left-5 top-16 bottom-0 w-0.5 bg-blue-200" />
                  )}

                  <button
                    onClick={() => handleModuleClick(module.id)}
                    className="w-full text-left"
                  >
                    <Card className="relative flex items-start gap-4 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-500">
                      {/* Level Badge */}
                      <div className="absolute -left-3 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>

                      <div className="ml-8">
                        <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                        <p className="text-gray-600 mb-2">{module.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{module.lessons?.length || 0} lessons</span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 ml-auto flex-shrink-0" />
                    </Card>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
