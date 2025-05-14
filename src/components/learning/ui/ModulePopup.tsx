"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight, PlayCircle, RefreshCwIcon } from "lucide-react";
import { Module } from "@/types/learning";
import { Button } from "@/components/ui/button";

interface ModulePopupProps {
  module: Module;
  isInProgress: boolean;
  isCompleted: boolean;
  side: "left" | "right";
}

export default function ModulePopup({
  module,
  isInProgress,
  isCompleted,
  side,
}: ModulePopupProps) {
  const params = useParams();
  const router = useRouter();

  const handleModuleClick = (moduleId: string | number) => {
    const storageKey = `lesson_progress_${moduleId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        blockIndex: 0,
        timestamp: new Date().toISOString(),
      })
    );
    router.push(
      `/courses/${params.categoryId}/${params.courseSlug}/lessons/${moduleId}`
    );
  };

  return (
    <div
      className={`
        absolute
        top-full mt-8
        left-1/2
        transform
        -translate-x-1/2
        ${
          side === "right"
            ? "-translate-x-[70%] sm:-translate-x-[80%]"
            : " -translate-x-[40%] sm:-translate-x-[30%]"
        }
        w-80
        bg-white
        rounded-lg
        shadow-lg
        p-4
        border-2 border-border
        z-20
        animate-fadeIn
        text-center
      `}
    >
      {/* little arrow */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-4 h-4
          bg-white
          border-t-2 border-l-2 border-border
          rotate-45
          z-10
        "
      />

      <h3 className="font-bold mb-2">{module.title}</h3>
      <p className="text-sm mb-4">{module.description}</p>

      <Button
        onClick={() => handleModuleClick(module.id)}
        variant="default"
        className="w-full bg-foreground text-background hover:bg-foreground/70 rounded-full"
      >
        {isInProgress
          ? "Sii Wado Casharka"
          : isCompleted
          ? "Muraajacee Casharka"
          : "Billow Casharka"}
        {isInProgress ? (
          <PlayCircle className="ml-2 w-4 h-4" />
        ) : isCompleted ? (
          <RefreshCwIcon className="ml-2 w-4 h-4" />
        ) : (
          <ArrowRight className="ml-2 w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
