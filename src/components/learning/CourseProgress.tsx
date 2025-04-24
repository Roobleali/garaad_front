// src/components/learning/CourseProgress.tsx
"use client";

import { Progress } from "@/components/ui/progress";

export function CourseProgress({ progress }: { progress: number }) {
  console.log(progress)
  return (
    <div className="mb-5 mt-2">
      <Progress value={progress || 10} className="h-[10px] w-[90%]" />
    </div>
  );
}
